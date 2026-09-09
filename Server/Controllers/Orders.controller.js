import Order from '../Models/Orders.js'
import Product from '../Models/Products.js'

// נרמול מידה זהה לזה שבסל ובמוצר (אותיות גדולות, בלי רווחים, ברירת מחדל ONESIZE)
const normalizeOrderSize = (size) =>
  String(size || '').trim().toUpperCase().replace(/\s+/g, '') || 'ONESIZE'

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'cancelled'];

// מחזיר מלאי לפריטי הזמנה (ביטול/מחיקה) - אותו דפוס $elemMatch כמו ב-addOrder
const restockItems = async (items = []) => {
  for (const item of items) {
    const size = normalizeOrderSize(item.size);
    await Product.updateOne(
      { _id: item.product, 'sizes.size': size },
      { $inc: { 'sizes.$.stock': Number(item.quantity) } }
    );
  }
};

// ולידציה של items מול ה-DB (קיום מוצר, כמות, נרמול מידה וזמינותה) - משותף ל-addOrder ול-UpdateOrder
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

// ניכוי מלאי אטומי לכל פריט; אם ניכוי נכשל, מחזיר את מה שכבר נוכה ומחזיר את הפריט שנכשל (null = הצליח)
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
    // המחיר, נרמול המידה והמלאי נלקחים תמיד מה-DB, לא מהלקוח
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
      // לא מאפשרים לשנות פריטים בהזמנה ששולמה כבר
      if (previousStatus === 'paid') {
        return res.status(400).json({ message: 'Cannot modify items of an order that has already been paid' });
      }

      const validation = await validateItemsAgainstStock(items);
      if (validation.error) {
        return res.status(validation.error.status).json({ message: validation.error.message });
      }
      const { normalizedItems, productMap, total } = validation;

      // משחררים את המלאי השמור לפריטים הישנים לפני שמנכים את החדשים
      await restockItems(previousItems);

      const failedItem = await decrementStock(normalizedItems);
      if (failedItem) {
        // כשלון בניכוי הפריטים החדשים - מחזירים את המצב לקדמותו
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

    // מחזירים מלאי רק במעבר אל cancelled, כדי לא להחזיר פעמיים
    // אם הפריטים הוחלפו באותה בקשה, המלאי הרלוונטי להחזרה הוא כבר update.items (החדשים, שכבר נוכו למעלה)
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

    // אם ההזמנה כבר בוטלה, המלאי כבר הוחזר - לא להחזיר פעמיים
    if (deleted.status !== 'cancelled') {
      await restockItems(deleted.items);
    }

    res.status(200).json({ message: 'Order deleted successfully', order: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}