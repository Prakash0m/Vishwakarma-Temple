import mongoose from 'mongoose';

const poojaBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    devoteeName: {
      type: String,
      required: [true, 'Devotee name is required'],
      trim: true
    },
    devoteePhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    devoteeEmail: {
      type: String,
      trim: true,
      default: ''
    },
    pooja: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pooja',
      required: [true, 'Pooja reference is required']
    },
    poojaName: {
      type: String,
      required: true
    },
    requestedDate: {
      type: Date,
      required: [true, 'Requested date is required']
    },
    requestedTime: {
      type: String,
      default: 'बिहान ८:०० बजे'
    },
    gotra: {
      type: String,
      default: ''
    },
    sankalpaNotes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

poojaBookingSchema.index({ requestedDate: -1, status: 1 });

export default mongoose.model('PoojaBooking', poojaBookingSchema);
