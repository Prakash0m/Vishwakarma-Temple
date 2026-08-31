import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      default: 'सामान्य सोधपुछ (General Inquiry)'
    },
    message: {
      type: String,
      required: [true, 'Message is required']
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied', 'Closed'],
      default: 'New'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1, status: 1 });

export default mongoose.model('ContactMessage', contactMessageSchema);
