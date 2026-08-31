import mongoose from 'mongoose';

const fundPaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  receiptNumber: {
    type: String,
    unique: true,
    trim: true,
    index: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FundCampaign',
    required: true,
    index: true
  },
  campaignMonth: {
    type: String,
    required: true
  },
  campaignYear: {
    type: Number,
    required: true
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
    index: true
  },
  houseId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  houseNumber: {
    type: String,
    required: true,
    trim: true
  },
  memberName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    enum: ['eSewa', 'Khalti', 'Fonepay', 'Bank Transfer', 'Cash', 'Other'],
    default: 'eSewa'
  },
  transactionId: {
    type: String,
    trim: true
  },
  receiptVoucherImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'प्रतीक्षारत', 'स्वीकृत', 'अस्वीकृत'],
    default: 'Pending',
    index: true
  },
  submittedDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  approvedDate: {
    type: Date
  },
  approvedBy: {
    type: String,
    default: ''
  },
  adminRemarks: {
    type: String,
    trim: true
  },
  payerNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Composite index to help check if a house has already paid for a campaign
fundPaymentSchema.index({ campaign: 1, house: 1, status: 1 });

export const FundPayment = mongoose.model('FundPayment', fundPaymentSchema);
export default FundPayment;
