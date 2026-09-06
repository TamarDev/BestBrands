import mongoose from 'mongoose';


// 2. הגדרת ההזמנה כולה
const OrderSchema =new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // כאן החיבור החשוב: המערך מכיל אובייקטים מסוג OrderItemSchema
    items: [{
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: {
            type: Number,
            required: true,
            min: 1,
           validate: Number.isInteger
          },
          size: { type: String, default: '' }
        }],
    
    total: { type: Number, default: 0 ,min:0},
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      fullName: String,
      email: String,
      address: String,
      city: String,
      zipCode: String
    },
    note: { type: String, default: '' }
  },{ collection: 'Orders' }
);

export default mongoose.model('Order', OrderSchema);

