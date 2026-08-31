import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true
    },
    donorNameDevanagari: {
      type: String,
      default: ''
    },
    donorPhone: {
      type: String,
      trim: true,
      default: ''
    },
    donorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    donorAddress: {
      type: String,
      trim: true,
      default: ''
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Amount must be greater than 0']
    },
    purpose: {
      type: String,
      required: [true, 'Donation purpose is required'],
      default: 'General Temple Fund'
    },
    purposeDevanagari: {
      type: String,
      default: 'सामान्य मन्दिर कोष'
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'eSewa', 'Khalti', 'Bank Transfer', 'Fonepay', 'Other'],
      required: [true, 'Payment method is required'],
      default: 'Cash'
    },
    transactionId: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      default: ''
    },
    privacy: {
      type: String,
      enum: ['public', 'initials', 'anonymous'],
      default: 'public'
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

donationSchema.index({ donorName: 'text', receiptNumber: 'text' });
donationSchema.index({ date: -1 });
donationSchema.index({ member: 1 });

export default mongoose.model('Donation', donationSchema);
