import mongoose from 'mongoose';

const UserSchema =new mongoose.Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }
    },
    googleId: { type: String, unique: true, sparse: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
   
  },{collection:'Users'}
);

export default mongoose.model('User', UserSchema);
