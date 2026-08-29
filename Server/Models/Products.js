import mongoose from 'mongoose';

const ProductSchema =new mongoose.Schema(
  {
    name: { type: String, required: true,trim: true},
    description: { type: String, default: '' },
    image: { type: String,},
    price: { type: Number, default:0 ,min:0},
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    color: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => typeof value === 'string' && value.trim().length > 0,
        message: 'Color cannot be empty'
      }
    },
    sizes: {
      type: [
        {
          size: { type: String, required: true, trim: true },
          stock: { type: Number, default: 0, min: 0, validate: Number.isInteger }
        }
      ],
      default: [],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one size is required'
      }
    }

  },{collection:'Products'}
);

export default mongoose.model('Product', ProductSchema);
