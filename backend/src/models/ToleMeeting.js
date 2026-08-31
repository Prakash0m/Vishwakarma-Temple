import mongoose from 'mongoose';

const toleMeetingSchema = new mongoose.Schema({
  meetingId: {
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
  date: {
    type: Date,
    required: true,
    index: true
  },
  time: {
    type: String,
    required: true,
    default: 'बिहान ८:०० बजे'
  },
  timeEnglish: {
    type: String,
    default: '8:00 AM'
  },
  location: {
    type: String,
    default: 'श्री विश्वकर्मा मन्दिर सामुदायिक भवन, छापकी',
    trim: true
  },
  meetingType: {
    type: String,
    enum: ['Regular Meeting', 'Emergency Meeting', 'General Meeting', 'Committee Meeting', 'Special Meeting', 'नियमित बैठक', 'आपतकालीन बैठक', 'साधारण सभा', 'कार्यसमिति बैठक', 'विशेष बैठक'],
    default: 'Regular Meeting',
    index: true
  },
  agenda: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'तयारीमा', 'सम्पन्न', 'रद्द'],
    default: 'Scheduled',
    index: true
  },
  images: [{
    type: String
  }],
  documents: [{
    title: String,
    url: String
  }],
  notes: {
    type: String,
    trim: true
  },
  totalHouses: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  absentCount: {
    type: Number,
    default: 0
  },
  excusedCount: {
    type: Number,
    default: 0
  },
  attendancePercentage: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

export const ToleMeeting = mongoose.model('ToleMeeting', toleMeetingSchema);
export default ToleMeeting;
