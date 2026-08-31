import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema({
  fineId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
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
    trim: true
  },
  personName: {
    type: String,
    required: true,
    trim: true
  },
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ToleMeeting'
  },
  fineType: {
    type: String,
    enum: ['Meeting Absence', 'Late Attendance', 'Tole Rule Violation', 'Other', 'बैठक अनुपस्थिति', 'ढिलो उपस्थिति', 'टोल नियम उल्लंघन', 'अन्य'],
    default: 'Meeting Absence',
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Paid', 'Waived', 'बाँकी', 'आंशिक भुक्तानी', 'चुक्ता', 'मिनाहा'],
    default: 'Pending',
    index: true
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'eSewa', 'Khalti', 'Fonepay', 'Bank Transfer', 'Other'],
    default: 'Cash'
  },
  receiptNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  recordedBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

export const Fine = mongoose.model('Fine', fineSchema);
export default Fine;
