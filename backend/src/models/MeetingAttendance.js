import mongoose from 'mongoose';

const meetingAttendanceSchema = new mongoose.Schema({
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ToleMeeting',
    required: true,
    index: true
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
    index: true
  },
  houseId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  houseNumber: {
    type: String,
    trim: true
  },
  representativeName: {
    type: String,
    required: true,
    trim: true
  },
  attendeeName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Excused', 'उपस्थित', 'अनुपस्थित', 'बिदा / जानकारी'],
    default: 'Present',
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  remarks: {
    type: String,
    trim: true
  },
  fineImposed: {
    type: Boolean,
    default: false
  },
  fineAmount: {
    type: Number,
    default: 0
  },
  markedBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

// Composite unique index so one house only has one record per meeting
meetingAttendanceSchema.index({ meeting: 1, house: 1 }, { unique: true });

export const MeetingAttendance = mongoose.model('MeetingAttendance', meetingAttendanceSchema);
export default MeetingAttendance;
