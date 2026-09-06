import Order from '../Models/Orders.js'
import Product from '../Models/Products.js'

export const getAllOrder = async (req, res) => {
  try {
      const orders = await Order.find({}).populate('user', 'firstName lastName email').populate('items.product');
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
  const {  items = [], orderDate, status, shippingAddress, note } = req.body;
  try {
      const productIds = items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });
      const priceMap = products.reduce((map, prod) => { map[prod._id.toString()] = prod.price; return map; }, {});
      const total = items.reduce((sum, item) => { const price = priceMap[item.product.toString()] || 0; return sum + (price * Number(item.quantity)); }, 0);
      const newOrder = new Order({
        user,
        items: items.map(item => ({ product: item.product, quantity: item.quantity, size: item.size || '' })),
        total,
        orderDate,
        shippingAddress,
        status,
        note
      });
      await newOrder.save();
      res.status(201).json({ message: "Order added successfully", order: newOrder });
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