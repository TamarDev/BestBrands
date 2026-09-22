import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Determine whether the password is already encrypted with bcrypt.
const isBcryptHash = (value) => /^\$2[aby]\$/.test(value || '');

// Automatically encrypt the password when saving a changed, unencrypted value.
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password || isBcryptHash(this.password)) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Apply the same encryption to updates made through findOneAndUpdate/findByIdAndUpdate.
// These updates do not trigger the save hook above.
UserSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() || {};
  const password = update.password ?? update.$set?.password;

  if (!password || isBcryptHash(password)) {
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  if (update.$set) {
    update.$set.password = hashed;
  } else {
    update.password = hashed;
  }
});

export default mongoose.model('User', UserSchema);
