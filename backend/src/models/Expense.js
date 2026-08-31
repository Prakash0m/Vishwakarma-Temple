import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    voucherNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'मन्दिर मर्मत',
        'पूजा सामग्री',
        'बिजुली',
        'पानी',
        'कार्यक्रम',
        'तलब',
        'सामाजिक सेवा',
        'अन्य'
      ],
      required: [true, 'Expense category is required'],
      default: 'पूजा सामग्री'
    },
    categoryEnglish: {
      type: String,
      default: 'Pooja Materials'
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [1, 'Amount must be greater than 0']
    },
    date: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'eSewa', 'Cheque', 'Other'],
      default: 'Cash'
    },
    description: {
      type: String,
      default: ''
    },
    receiptImage: {
      type: String,
      default: ''
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });

export default mongoose.model('Expense', expenseSchema);
