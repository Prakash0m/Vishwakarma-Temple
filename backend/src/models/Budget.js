import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    categoryEnglish: {
      type: String,
      default: ''
    },
    fiscalYear: {
      type: String,
      required: [true, 'Fiscal Year is required'],
      default: '2081/82 (2026)'
    },
    allocatedAmount: {
      type: Number,
      required: [true, 'Allocated amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Archived'],
      default: 'Active'
    }
  },
  { timestamps: true }
);

budgetSchema.index({ category: 1, fiscalYear: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema);
