import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title (Nepali) is required'],
      trim: true
    },
    titleEnglish: {
      type: String,
      required: [true, 'Event title (English) is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description (Nepali) is required']
    },
    descriptionEnglish: {
      type: String,
      required: [true, 'Description (English) is required']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      default: 'बिहान ९:०० बजे'
    },
    timeEnglish: {
      type: String,
      default: '9:00 AM onwards'
    },
    location: {
      type: String,
      default: 'विश्वकर्मा मन्दिर परिसर, छापकी, सप्तरी'
    },
    locationEnglish: {
      type: String,
      default: 'Vishwakarma Temple Premises, Chhapki, Saptari'
    },
    bannerImage: {
      type: String,
      default: '/assets/images/temple-structure.jpg'
    },
    meetingUrl: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['उत्सव', 'विशेष पूजा', 'सामूहिक भजन', 'हवन तथा यज्ञ', 'समुदाय कार्यक्रम', 'बैठक'],
      default: 'उत्सव'
    },
    categoryEnglish: {
      type: String,
      default: 'Festival'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

eventSchema.index({ date: 1, isPublished: 1 });

export default mongoose.model('Event', eventSchema);
