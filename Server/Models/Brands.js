import mongoose from 'mongoose';

const BrandSchema =new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true,trim: true},
        description: { type: String, default: '' },
        image: { type: String, required: true},
        inventor:{type:String},
        imagePage:{type:String},
    }, { collection: 'Brands' }
);

export default mongoose.model('Brand', BrandSchema);


