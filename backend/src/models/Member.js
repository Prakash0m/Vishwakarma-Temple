import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true
    },
    nameDevanagari: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    membershipType: {
      type: String,
      enum: ['Life Member', 'General Member', 'Executive Member', 'Patron', 'Honorary'],
      default: 'General Member'
    },
    membershipTypeDevanagari: {
      type: String,
      default: 'साधारण सदस्य'
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    photo: {
      type: String,
      default: ''
    },
    occupation: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

memberSchema.index({ name: 'text', memberId: 'text', phone: 'text' });

export default mongoose.model('Member', memberSchema);
