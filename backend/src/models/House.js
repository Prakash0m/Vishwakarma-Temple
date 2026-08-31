import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'पुरुष', 'महिला', 'अन्य'],
    default: 'Male'
  },
  dob: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  relationship: {
    type: String,
    required: true,
    trim: true,
    default: 'Head of Family'
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  occupation: {
    type: String,
    trim: true
  },
  education: {
    type: String,
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['Married', 'Unmarried', 'Divorced', 'Widowed', 'विवाहित', 'अविवाहित', 'एकल'],
    default: 'Married'
  },
  isRepresentative: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Abroad', 'सक्रिय', 'निष्क्रिय', 'वैदेशिक रोजगार'],
    default: 'Active'
  },
  photo: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  }
}, { _id: true });

const houseSchema = new mongoose.Schema({
  houseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  houseNumber: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  tole: {
    type: String,
    default: 'छापकी (Chhapki)',
    trim: true
  },
  ward: {
    type: String,
    default: '५',
    trim: true
  },
  address: {
    type: String,
    default: 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी',
    trim: true
  },
  familyType: {
    type: String,
    enum: ['Single Family', 'Joint Family', 'एकल परिवार', 'संयुक्त परिवार'],
    default: 'Single Family',
    index: true
  },
  representativeName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  representativePhone: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  totalMembers: {
    type: Number,
    default: 1
  },
  maleCount: {
    type: Number,
    default: 1
  },
  femaleCount: {
    type: Number,
    default: 0
  },
  childrenCount: {
    type: Number,
    default: 0
  },
  seniorCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'सक्रिय', 'निष्क्रिय'],
    default: 'Active',
    index: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true
  },
  familyMembers: [familyMemberSchema]
}, {
  timestamps: true
});

// Auto-calculate counts before saving
houseSchema.pre('save', function(next) {
  if (this.familyMembers && this.familyMembers.length > 0) {
    this.totalMembers = this.familyMembers.length;
    this.maleCount = this.familyMembers.filter(m => m.gender === 'Male' || m.gender === 'पुरुष').length;
    this.femaleCount = this.familyMembers.filter(m => m.gender === 'Female' || m.gender === 'महिला').length;
  }
  next();
});

export const House = mongoose.model('House', houseSchema);
export default House;
