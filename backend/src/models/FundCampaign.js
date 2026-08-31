import mongoose from 'mongoose';

const fundCampaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleEnglish: {
    type: String,
    trim: true
  },
  month: {
    type: String,
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
      'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
    ],
    index: true
  },
  year: {
    type: Number,
    required: true,
    default: 2026,
    index: true
  },
  amountPerHouse: {
    type: Number,
    required: true,
    default: 1000,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  paymentInstructions: {
    type: String,
    default: 'कृपया eSewa / Khalti / Fonepay वा बैंक ट्रान्सफर मार्फत तोकिएको रकम भुक्तानी गरी भौचर/स्क्रिनसट अपलोड गर्नुहोस्।',
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Closed', 'सक्रिय', 'निष्क्रिय', 'बन्द'],
    default: 'Active',
    index: true
  },
  targetHouses: {
    type: Number,
    default: 0
  },
  collectedHouses: {
    type: Number,
    default: 0
  },
  totalExpectedAmount: {
    type: Number,
    default: 0
  },
  totalCollectedAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export const FundCampaign = mongoose.model('FundCampaign', fundCampaignSchema);
export default FundCampaign;
