import Order from '../Models/Orders.js'
import Product from '../Models/Products.js'

// Size normalization shared with cart and product (uppercase, no spaces, default ONESIZE)
const normalizeOrderSize = (size) =>
  String(size || '').trim().toUpperCase().replace(/\s+/g, '') || 'ONESIZE'

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'cancelled'];

// Restocks order items on cancel/delete - same $elemMatch pattern as addOrder
const restockItems = async (items = []) => {
  for (const item of items) {
    const size = normalizeOrderSize(item.size);
    await Product.updateOne(
      { _id: item.product, 'sizes.size': size },
      { $inc: { 'sizes.$.stock': Number(item.quantity) } }
    );
  }
};

// Validates items against the DB (product exists, quantity, size availability) - shared by addOrder and UpdateOrder
const validateItemsAgainstStock = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: { status: 400, message: 'Order must contain at least one item' } };
  }

  const productIds = items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = products.reduce((map, prod) => {
    map[prod._id.toString()] = prod;
    return map;
  }, {});

  const normalizedItems = [];
  for (const item of items) {
    const product = productMap[String(item.product)];
    if (!product) {
      return { error: { status: 404, message: `Product ${item.product} not found` } };
    }

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { error: { status: 400, message: `Invalid quantity for ${product.name}` } };
    }

    const size = normalizeOrderSize(item.size);
    const sizeEntry = product.sizes.find(s => normalizeOrderSize(s.size) === size);
    if (!sizeEntry) {
      return { error: { status: 400, message: `Size ${size} is not available for ${product.name}` } };
    }

    normalizedItems.push({ product: item.product, quantity, size });
  }

  const total = normalizedItems.reduce(
    (sum, item) => sum + (productMap[String(item.product)].price || 0) * item.quantity,
    0
  );

  return { normalizedItems, productMap, total };
};

// Atomically decrements stock per item; rolls back on failure and returns the failed item (null = success)
const decrementStock = async (items) => {
  const decremented = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, sizes: { $elemMatch: { size: item.size, stock: { $gte: item.quantity } } } },
      { $inc: { 'sizes.$.stock': -item.quantity } }
    );

    if (result.modifiedCount === 0) {
      for (const done of decremented) {
        await Product.updateOne(
          { _id: done.product, 'sizes.size': done.size },
          { $inc: { 'sizes.$.stock': done.quantity } }
        );
      }
      return item;
    }

    decremented.push(item);
  }
  return null;
};

export const getAllOrder = async (req, res) => {
  try {
      const orders = await Order.find({}).populate('user', 'firstName lastName email').populate('items.product').lean();
      res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getOrderById = async (req, res) => {
  try {
        const id = req.params.id;
        const order = await Order.findById(id).populate('user', 'firstName lastName email').populate('items.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const getOrderByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const orders = await Order.find({ user: userId }).populate('user', 'firstName lastName email').populate('items.product').sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addOrder = async (req, res) => {
  const user = req.user.userId;
  const { items = [], shippingAddress, note } = req.body;
  try {
    // Price, size, and stock always come from the DB, never the client
    const validation = await validateItemsAgainstStock(items);
    if (validation.error) {
      return res.status(validation.error.status).json({ message: validation.error.message });
    }
    const { normalizedItems, productMap, total } = validation;

    const failedItem = await decrementStock(normalizedItems);
    if (failedItem) {
      const product = productMap[String(failedItem.product)];
      return res.status(409).json({
        message: `Not enough stock for ${product?.name || failedItem.product} (${failedItem.size})`
      });
    }

    const newOrder = new Order({
      user,
      items: normalizedItems,
      total,
      shippingAddress,
      status: 'pending',
      note
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order added successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const UpdateOrder = async (req, res) => {
 const id = req.params.id;
 const { user, items, shippingAddress, status, note } = req.body;
  try {
    const update = await Order.findById(id);
    if (!update) return res.status(404).json({ message: 'Order not found' });

    if (status && !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}` });
    }

    const previousStatus = update.status;
    const previousItems = update.items;
    let itemsReplaced = false;

    if (user) update.user = user;

    if (items) {
      // Items can't be changed once an order is paid
      if (previousStatus === 'paid') {
        return res.status(400).json({ message: 'Cannot modify items of an order that has already been paid' });
      }

      const validation = await validateItemsAgainstStock(items);
      if (validation.error) {
        return res.status(validation.error.status).json({ message: validation.error.message });
      }
      const { normalizedItems, productMap, total } = validation;

      // Release stock held by the old items before decrementing the new ones
      await restockItems(previousItems);

      const failedItem = await decrementStock(normalizedItems);
      if (failedItem) {
        // New items failed to decrement - restore the previous state
        await decrementStock(previousItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          size: normalizeOrderSize(item.size)
        })));
        const product = productMap[String(failedItem.product)];
        return res.status(409).json({
          message: `Not enough stock for ${product?.name || failedItem.product} (${failedItem.size})`
        });
      }

      update.items = normalizedItems;
      update.total = total;
      itemsReplaced = true;
    }

    if (shippingAddress) update.shippingAddress = shippingAddress;
    if (status) update.status = status;
    if (note) update.note = note;

    // Restock only on transition to cancelled, and only once;
    // if items were replaced above, update.items already holds the new (decremented) ones
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      await restockItems(itemsReplaced ? update.items : previousItems);
    }

    await update.save();
    return res.status(200).json({ message: "Order updated successfully", order: update });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });

    // Stock was already restored if the order was cancelled - don't double-restock
    if (deleted.status !== 'cancelled') {
      await restockItems(deleted.items);
    }

    res.status(200).json({ message: 'Order deleted successfully', order: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}