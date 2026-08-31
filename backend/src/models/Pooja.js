import mongoose from 'mongoose';

const poojaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Pooja title (Nepali) is required'],
      trim: true
    },
    titleEnglish: {
      type: String,
      required: [true, 'Pooja title (English) is required'],
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
    price: {
      type: Number,
      required: [true, 'Pooja price is required'],
      min: [0, 'Price must be 0 or positive']
    },
    duration: {
      type: String,
      default: '४५ मिनेट'
    },
    durationEnglish: {
      type: String,
      default: '45 Minutes'
    },
    image: {
      type: String,
      default: '/assets/images/deity-altar-lamps.jpg'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Pooja', poojaSchema);
