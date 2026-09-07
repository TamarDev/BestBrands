import Order from '../Models/Orders.js'
import Product from '../Models/Products.js'

// נרמול מידה זהה לזה שבסל ובמוצר (אותיות גדולות, בלי רווחים, ברירת מחדל ONESIZE)
const normalizeOrderSize = (size) =>
  String(size || '').trim().toUpperCase().replace(/\s+/g, '') || 'ONESIZE'

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
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // המחיר והמלאי נלקחים תמיד מה-DB, לא מהלקוח
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = products.reduce((map, prod) => {
      map[prod._id.toString()] = prod;
      return map;
    }, {});

    // ולידציית מלאי לכל הפריטים לפני שמנכים כלום
    for (const item of items) {
      const product = productMap[String(item.product)];
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }

      const size = normalizeOrderSize(item.size);
      const sizeEntry = product.sizes.find(s => normalizeOrderSize(s.size) === size);
      if (!sizeEntry) {
        return res.status(400).json({ message: `Size ${size} is not available for ${product.name}` });
      }
      if (sizeEntry.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name} (${size})` });
      }
    }

    // ניכוי מלאי אטומי לכל פריט; אם ניכוי נכשל מחזירים את מה שכבר נוכה
    const decremented = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      const size = normalizeOrderSize(item.size);

      const result = await Product.updateOne(
        { _id: item.product, sizes: { $elemMatch: { size, stock: { $gte: quantity } } } },
        { $inc: { 'sizes.$.stock': -quantity } }
      );

      if (result.modifiedCount === 0) {
        for (const done of decremented) {
          await Product.updateOne(
            { _id: done.product, 'sizes.size': done.size },
            { $inc: { 'sizes.$.stock': done.quantity } }
          );
        }
        const product = productMap[String(item.product)];
        return res.status(409).json({
          message: `Not enough stock for ${product?.name || item.product} (${size})`
        });
      }

      decremented.push({ product: item.product, size, quantity });
    }

    const total = items.reduce((sum, item) => {
      const price = productMap[String(item.product)]?.price || 0;
      return sum + price * Number(item.quantity);
    }, 0);

    const newOrder = new Order({
      user,
      items: items.map(item => ({
        product: item.product,
        quantity: Number(item.quantity),
        size: item.size || ''
      })),
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
    let update = await Order.findById(id);
    if (!update) return res.status(404).json({ message: 'Order not found' });
    if (user) update.user = user;
    if (items) {
        const productIds = items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });
        const priceMap = products.reduce((map, prod) => { map[prod._id.toString()] = prod.price; return map; }, {});
        update.items = items;
        update.total = items.reduce((sum, item) => { const price = priceMap[item.product.toString()] || 0; return sum + (price * Number(item.quantity)); }, 0);
    }
    if (shippingAddress) update.shippingAddress = shippingAddress;
    if (status) update.status = status;
    if (note) update.note = note;
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
    res.status(200).json({ message: 'Order deleted successfully', order: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}