import mongoose from 'mongoose';

const templeIncomeSchema = new mongoose.Schema({
  incomeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  sourceName: {
    type: String,
    required: true,
    enum: [
      'जलाहवा पोखरी (Jalahawa Pokhari)',
      'गोसाइँ पोखरी (Gosai Pokhari)',
      'मन्दिर भेटी तथा दान',
      'घर/सटर भाडा',
      'अन्य मन्दिर आम्दानी'
    ],
    default: 'जलाहवा पोखरी (Jalahawa Pokhari)',
    index: true
  },
  sourceCategory: {
    type: String,
    enum: ['Pokhari', 'Donation', 'Rental', 'Other', 'पोखरी ठेक्का', 'भेटी', 'भाडा', 'अन्य'],
    default: 'Pokhari'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  fiscalYear: {
    type: String,
    default: '२०८३/२०८४',
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  receivedBy: {
    type: String,
    required: true,
    trim: true
  },
  payerName: {
    type: String,
    trim: true
  },
  payerPhone: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Cheque', 'eSewa', 'Khalti', 'Fonepay'],
    default: 'Bank Transfer'
  },
  transactionId: {
    type: String,
    trim: true
  },
  receiptImage: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const TempleIncome = mongoose.model('TempleIncome', templeIncomeSchema);
export default TempleIncome;
