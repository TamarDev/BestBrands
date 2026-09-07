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

// מזהה האם ערך סיסמה כבר מוצפן ב-bcrypt (ולא צריך להצפין אותו שוב)
const isBcryptHash = (value) => /^\$2[aby]\$/.test(value || '');

// מצפין את הסיסמה אוטומטית בכל שמירה של מסמך, אם היא שונתה וטרם הוצפנה
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password || isBcryptHash(this.password)) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// אותה הצפנה, אבל עבור עדכונים שרצים דרך findOneAndUpdate/findByIdAndUpdate
// (עדכונים כאלה לא מפעילים את ה-hook של 'save' מעל)
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() || {};
  const password = update.password ?? update.$set?.password;

  if (!password || isBcryptHash(password)) {
    return next();
  }

  const hashed = await bcrypt.hash(password, 10);

  if (update.$set) {
    update.$set.password = hashed;
  } else {
    update.password = hashed;
  }

  next();
});

export default mongoose.model('User', UserSchema);
