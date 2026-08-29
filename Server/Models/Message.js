import mongoose from 'mongoose';

const MessageSchema =new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    body: { type: String, required: true},

    subject: { type: String, required: true },
    
    isRead: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["new", "inProgress", "answered", "closed"],
      default: "new",
    },

  },{ collection: 'Message' ,timestamps: true,}
);

export default mongoose.model('Message', MessageSchema);
