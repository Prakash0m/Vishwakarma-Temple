import mongoose from 'mongoose';

const incomeSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nameEnglish: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Pokhari', 'Donation', 'Rental', 'Agriculture', 'Other', 'पोखरी', 'दान', 'भाडा', 'कृषि', 'अन्य'],
    default: 'Pokhari'
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const IncomeSource = mongoose.model('IncomeSource', incomeSourceSchema);
export default IncomeSource;
