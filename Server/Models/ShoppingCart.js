import mongoose from 'mongoose';

const ShoppingCartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true
    },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: Number.isInteger
      },
      size: {
        type: String,
        required: true,
          },
        
    }],

    sum: { type: Number, default: 0, min: 0 }
  },
  {
    collection: 'ShoppingCart',
    timestamps: true
  }
);

export default mongoose.model('ShoppingCart', ShoppingCartSchema);
