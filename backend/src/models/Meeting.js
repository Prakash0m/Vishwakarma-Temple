import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['VirtualMeeting', 'LiveDarshan'],
      required: true,
      default: 'VirtualMeeting'
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    titleEnglish: {
      type: String,
      default: ''
    },
    platform: {
      type: String,
      enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'YouTube Live', 'Facebook Live', 'Custom Stream'],
      default: 'Google Meet'
    },
    meetingUrl: {
      type: String,
      trim: true,
      default: 'https://meet.google.com/new'
    },
    streamUrl: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
      type: String,
      default: 'प्रत्येक शनिबार (Every Saturday)'
    },
    time: {
      type: String,
      default: 'साँझ ६:०० - ७:०० बजे'
    },
    timeEnglish: {
      type: String,
      default: '6:00 PM - 7:00 PM'
    },
    description: {
      type: String,
      default: 'विश्वकर्मा मन्दिर व्यवस्थापन तथा भक्तजन सत्संग भर्चुअल बैठक'
    },
    descriptionEnglish: {
      type: String,
      default: 'Vishwakarma Temple Management & Devotee Satsang Virtual Gathering'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isLiveNow: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
