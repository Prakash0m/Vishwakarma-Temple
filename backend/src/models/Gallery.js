import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    titleEnglish: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    category: {
      type: String,
      enum: ['Temple', 'Bhagwan', 'Pooja', 'Events', 'Devotees', 'Donation', 'Festival', 'Other'],
      default: 'Temple'
    },
    categoryNepali: {
      type: String,
      default: 'मन्दिर'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1, isFeatured: 1 });

export default mongoose.model('Gallery', gallerySchema);
