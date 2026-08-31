import mongoose from 'mongoose';

const toleCandidateSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  fullNameDevanagari: {
    type: String,
    trim: true
  },
  house: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  },
  houseNumber: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    required: true,
    enum: [
      'Tole President', 'Vice President', 'Secretary', 'Treasurer', 'Executive Member', 'Candidate',
      'टोल अध्यक्ष', 'उपाध्यक्ष', 'सचिव', 'कोषाध्यक्ष', 'सदस्य', 'उम्मेदवार'
    ],
    default: 'Tole President'
  },
  positionDevanagari: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: '/assets/images/deity-portrait.jpg'
  },
  bio: {
    type: String,
    trim: true
  },
  bioEnglish: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  electionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'सक्रिय', 'निष्क्रिय'],
    default: 'Active',
    index: true
  },
  displayOrder: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

export const ToleCandidate = mongoose.model('ToleCandidate', toleCandidateSchema);
export default ToleCandidate;
