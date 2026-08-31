import mongoose from 'mongoose';

const weddingSchema = new mongoose.Schema({
  weddingId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  brideName: {
    type: String,
    required: true,
    trim: true
  },
  groomName: {
    type: String,
    required: true,
    trim: true
  },
  brideHouse: {
    type: String,
    trim: true
  },
  groomHouse: {
    type: String,
    trim: true
  },
  brideHouseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  },
  groomHouseRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  },
  weddingDate: {
    type: Date,
    required: true,
    index: true
  },
  weddingDateNepali: {
    type: String,
    trim: true
  },
  weddingType: {
    type: String,
    enum: ['Traditional Hindu', 'Social Wedding', 'Court Marriage', 'वैदिक सनातन विवाह', 'सामाजिक विवाह', 'कानुनी विवाह'],
    default: 'Traditional Hindu'
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: 'छापकी, सप्तरी (विश्वकर्मा मन्दिर परिसर / वर-वधु निवास)',
    trim: true
  },
  weddingImage: {
    type: String,
    default: ''
  },
  documents: [{
    title: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled', 'आगामी', 'सम्पन्न', 'रद्द'],
    default: 'Upcoming',
    index: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export const Wedding = mongoose.model('Wedding', weddingSchema);
export default Wedding;
