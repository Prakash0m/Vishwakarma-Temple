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
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['Temple', 'Bhagwan', 'Pooja', 'Events', 'Bhajan', 'Devotees', 'Donation', 'Festival', 'Other'],
      default: 'Temple'
    },
    categoryNepali: {
      type: String,
      default: 'मन्दिर'
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    blobPathname: {
      type: String,
      default: ''
    },
    altText: {
      type: String,
      default: '',
      trim: true
    },
    isFeatured: {
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

gallerySchema.index({ category: 1, isFeatured: 1, order: 1 });

export default mongoose.model('Gallery', gallerySchema);
