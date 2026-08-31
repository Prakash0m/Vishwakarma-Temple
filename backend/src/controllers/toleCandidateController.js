import { ToleCandidate } from '../models/ToleCandidate.js';

// Auto-generate Candidate ID
const generateCandidateId = async () => {
  const count = await ToleCandidate.countDocuments();
  return `CAN-${String(count + 1).padStart(3, '0')}`;
};

// @desc    Get all tole committee candidates (Public: Active only | Admin: All)
// @route   GET /api/tole/leadership
// @access  Public / Admin
export const getCandidates = async (req, res, next) => {
  try {
    const { all } = req.query;
    const query = all === 'true' ? {} : { status: { $in: ['Active', 'सक्रिय'] } };

    const candidates = await ToleCandidate.find(query).sort({ displayOrder: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new committee candidate
// @route   POST /api/tole/leadership
// @access  Private/Admin
export const createCandidate = async (req, res, next) => {
  try {
    const { fullName, fullNameDevanagari, houseNumber, position, positionDevanagari, profileImage, bio, bioEnglish, phone, email, displayOrder } = req.body;

    if (!fullName || !position || !phone) {
      return res.status(400).json({ success: false, message: 'नाम, पद र फोन नम्बर अनिवार्य छ' });
    }

    const candidateId = await generateCandidateId();

    const candidate = await ToleCandidate.create({
      candidateId,
      fullName,
      fullNameDevanagari: fullNameDevanagari || fullName,
      houseNumber: houseNumber || '',
      position,
      positionDevanagari: positionDevanagari || position,
      profileImage: profileImage || '/assets/images/deity-portrait.jpg',
      bio: bio || '',
      bioEnglish: bioEnglish || '',
      phone,
      email: email || '',
      status: 'Active',
      displayOrder: displayOrder || 1
    });

    res.status(201).json({
      success: true,
      message: 'टोल नेतृत्व उम्मेदवार सफलतापूर्वक दर्ता भयो (Leader/Candidate added)',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate
// @route   PUT /api/tole/leadership/:id
// @access  Private/Admin
export const updateCandidate = async (req, res, next) => {
  try {
    const candidate = await ToleCandidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'उम्मेदवार फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'उम्मेदवार विवरण अद्यावधिक भयो',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle candidate active status
// @route   PATCH /api/tole/leadership/:id/status
// @access  Private/Admin
export const toggleCandidateStatus = async (req, res, next) => {
  try {
    const candidate = await ToleCandidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'उम्मेदवार फेला परेन' });
    }

    candidate.status = candidate.status === 'Active' ? 'Inactive' : 'Active';
    await candidate.save();

    res.status(200).json({
      success: true,
      message: `स्थिति परिवर्तन भयो: ${candidate.status}`,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete candidate
// @route   DELETE /api/tole/leadership/:id
// @access  Private/Admin
export const deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await ToleCandidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'उम्मेदवार फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'उम्मेदवार सफलतापूर्वक मेटाइयो'
    });
  } catch (error) {
    next(error);
  }
};
