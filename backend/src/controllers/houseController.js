import { House } from '../models/House.js';
import { MeetingAttendance } from '../models/MeetingAttendance.js';
import { Fine } from '../models/Fine.js';
import { FundPayment } from '../models/FundPayment.js';
import { Wedding } from '../models/Wedding.js';

// Generate next unique House ID (HOUSE-0001)
const generateHouseId = async () => {
  const lastHouse = await House.findOne().sort({ createdAt: -1 });
  if (!lastHouse || !lastHouse.houseId) {
    return 'HOUSE-0001';
  }
  const match = lastHouse.houseId.match(/HOUSE-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `HOUSE-${String(nextNum).padStart(4, '0')}`;
  }
  return `HOUSE-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all houses with search, filter, and pagination
// @route   GET /api/tole/houses
// @access  Public / Admin
export const getHouses = async (req, res, next) => {
  try {
    const {
      search,
      familyType,
      status,
      tole,
      ward,
      page = 1,
      limit = 50,
      sortBy = 'houseNumber',
      order = 'asc'
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (familyType && familyType !== 'all') {
      query.familyType = familyType;
    }

    if (ward) {
      query.ward = ward;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { houseId: searchRegex },
        { houseNumber: searchRegex },
        { representativeName: searchRegex },
        { representativePhone: searchRegex },
        { alternatePhone: searchRegex },
        { 'familyMembers.fullName': searchRegex },
        { 'familyMembers.phone': searchRegex }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const total = await House.countDocuments(query);
    const houses = await House.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    // Calculate summary statistics
    const singleFamilyCount = await House.countDocuments({ familyType: { $in: ['Single Family', 'एकल परिवार'] } });
    const jointFamilyCount = await House.countDocuments({ familyType: { $in: ['Joint Family', 'संयुक्त परिवार'] } });
    const totalPopulation = await House.aggregate([
      { $group: { _id: null, totalMembers: { $sum: '$totalMembers' }, totalMale: { $sum: '$maleCount' }, totalFemale: { $sum: '$femaleCount' } } }
    ]);

    res.status(200).json({
      success: true,
      count: houses.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      summary: {
        totalHouses: total,
        singleFamilyCount,
        jointFamilyCount,
        totalPopulation: totalPopulation[0]?.totalMembers || 0,
        totalMale: totalPopulation[0]?.totalMale || 0,
        totalFemale: totalPopulation[0]?.totalFemale || 0
      },
      data: houses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single house by ID with complete activity timeline
// @route   GET /api/tole/houses/:id
// @access  Public / Admin
export const getHouseById = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर विवरण फेला परेन (House not found)' });
    }

    // Fetch house-related timeline: attendance, fines, fund payments, weddings
    const [attendance, fines, fundPayments, weddings] = await Promise.all([
      MeetingAttendance.find({ house: house._id }).populate('meeting', 'title titleEnglish date time meetingType').sort({ date: -1 }),
      Fine.find({ house: house._id }).sort({ date: -1 }),
      FundPayment.find({ house: house._id }).populate('campaign', 'title month year amountPerHouse').sort({ submittedDate: -1 }),
      Wedding.find({ $or: [{ brideHouseRef: house._id }, { groomHouseRef: house._id }, { brideHouse: house.houseNumber }, { groomHouse: house.houseNumber }] }).sort({ weddingDate: -1 })
    ]);

    // Calculate attendance percentage for this house
    const totalMeetings = attendance.length;
    const presentMeetings = attendance.filter(a => a.status === 'Present' || a.status === 'उपस्थित').length;
    const attendancePercentage = totalMeetings > 0 ? ((presentMeetings / totalMeetings) * 100).toFixed(1) : 0;

    // Calculate fine summary
    const totalFineAmount = fines.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidFineAmount = fines.reduce((sum, f) => sum + (f.paidAmount || (f.status === 'Paid' ? f.amount : 0)), 0);
    const pendingFineAmount = totalFineAmount - paidFineAmount;

    // Calculate fund summary
    const approvedFundPayments = fundPayments.filter(p => p.status === 'Approved' || p.status === 'स्वीकृत');
    const totalFundPaid = approvedFundPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        house,
        timeline: {
          attendance,
          fines,
          fundPayments,
          weddings
        },
        metrics: {
          totalMeetings,
          presentMeetings,
          attendancePercentage: Number(attendancePercentage),
          totalFineAmount,
          paidFineAmount,
          pendingFineAmount,
          totalFundPaid
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new house
// @route   POST /api/tole/houses
// @access  Private/Admin
export const createHouse = async (req, res, next) => {
  try {
    const {
      houseNumber,
      tole,
      ward,
      address,
      familyType,
      representativeName,
      representativePhone,
      alternatePhone,
      email,
      notes,
      image,
      familyMembers
    } = req.body;

    if (!houseNumber || !representativeName || !representativePhone) {
      return res.status(400).json({
        success: false,
        message: 'घर नम्बर, मुख्य अभिभावकको नाम र फोन नम्बर अनिवार्य छ (House number, Representative name and Phone are required)'
      });
    }

    // Check for duplicate house number
    const existing = await House.findOne({ houseNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `घर नम्बर ${houseNumber} पहिले नै दर्ता भइसकेको छ (House number ${houseNumber} already exists)`
      });
    }

    const houseId = await generateHouseId();

    // Prepare family members with default representative if empty
    let membersList = familyMembers || [];
    if (membersList.length === 0) {
      membersList = [{
        memberId: 'MEM-0001',
        fullName: representativeName,
        gender: 'Male',
        relationship: 'घरमुली (Head of Family)',
        phone: representativePhone,
        isRepresentative: true,
        status: 'Active'
      }];
    } else {
      // Auto-assign member IDs
      membersList = membersList.map((m, idx) => ({
        ...m,
        memberId: m.memberId || `MEM-${String(idx + 1).padStart(4, '0')}`
      }));
    }

    const house = await House.create({
      houseId,
      houseNumber,
      tole: tole || 'छापकी (Chhapki)',
      ward: ward || '५',
      address: address || 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी',
      familyType: familyType || 'Single Family',
      representativeName,
      representativePhone,
      alternatePhone,
      email,
      notes,
      image: image || '',
      familyMembers: membersList,
      totalMembers: membersList.length,
      maleCount: membersList.filter(m => m.gender === 'Male' || m.gender === 'पुरुष').length,
      femaleCount: membersList.filter(m => m.gender === 'Female' || m.gender === 'महिला').length
    });

    res.status(201).json({
      success: true,
      message: 'नयाँ घर सफलतापूर्वक दर्ता भयो (House registered successfully)',
      data: house
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update house
// @route   PUT /api/tole/houses/:id
// @access  Private/Admin
export const updateHouse = async (req, res, next) => {
  try {
    let house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर फेला परेन (House not found)' });
    }

    // If houseNumber is being changed, check for duplicate
    if (req.body.houseNumber && req.body.houseNumber !== house.houseNumber) {
      const duplicate = await House.findOne({ houseNumber: req.body.houseNumber });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `घर नम्बर ${req.body.houseNumber} पहिले नै दर्ता छ` });
      }
    }

    if (req.body.familyMembers && Array.isArray(req.body.familyMembers)) {
      req.body.familyMembers = req.body.familyMembers.map((m, idx) => ({
        ...m,
        memberId: m.memberId || `MEM-${String(idx + 1).padStart(4, '0')}`
      }));
      req.body.totalMembers = req.body.familyMembers.length;
      req.body.maleCount = req.body.familyMembers.filter(m => m.gender === 'Male' || m.gender === 'पुरुष').length;
      req.body.femaleCount = req.body.familyMembers.filter(m => m.gender === 'Female' || m.gender === 'महिला').length;
    }

    house = await House.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'घर विवरण अद्यावधिक भयो (House updated successfully)',
      data: house
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate house
// @route   DELETE /api/tole/houses/:id
// @access  Private/Admin
export const deleteHouse = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर फेला परेन' });
    }

    // Safety check: if soft delete parameter is present, deactivate instead
    if (req.query.soft === 'true') {
      house.status = 'Inactive';
      await house.save();
      return res.status(200).json({ success: true, message: 'घर निष्क्रिय गरिएको छ (House deactivated)' });
    }

    await House.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'घर सफलतापूर्वक मेटाइयो (House deleted successfully)'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add family member to house
// @route   POST /api/tole/houses/:id/members
// @access  Private/Admin
export const addFamilyMember = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर फेला परेन' });
    }

    const { fullName, gender, relationship, phone, dob, occupation, education, maritalStatus, isRepresentative, photo, notes } = req.body;
    if (!fullName || !relationship) {
      return res.status(400).json({ success: false, message: 'सदस्यको नाम र नाता अनिवार्य छ' });
    }

    const memberId = `MEM-${String(house.familyMembers.length + 1).padStart(4, '0')}`;
    const newMember = {
      memberId,
      fullName,
      gender: gender || 'Male',
      relationship,
      phone: phone || '',
      dob: dob || '',
      occupation: occupation || '',
      education: education || '',
      maritalStatus: maritalStatus || 'Married',
      isRepresentative: isRepresentative || false,
      photo: photo || '',
      notes: notes || '',
      status: 'Active'
    };

    house.familyMembers.push(newMember);
    house.totalMembers = house.familyMembers.length;
    house.maleCount = house.familyMembers.filter(m => m.gender === 'Male' || m.gender === 'पुरुष').length;
    house.femaleCount = house.familyMembers.filter(m => m.gender === 'Female' || m.gender === 'महिला').length;

    await house.save();

    res.status(201).json({
      success: true,
      message: 'परिवार सदस्य थपियो (Family member added successfully)',
      data: house
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete family member from house
// @route   DELETE /api/tole/houses/:id/members/:memberId
// @access  Private/Admin
export const deleteFamilyMember = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर फेला परेन' });
    }

    house.familyMembers = house.familyMembers.filter(
      m => m._id.toString() !== req.params.memberId && m.memberId !== req.params.memberId
    );

    house.totalMembers = house.familyMembers.length;
    house.maleCount = house.familyMembers.filter(m => m.gender === 'Male' || m.gender === 'पुरुष').length;
    house.femaleCount = house.familyMembers.filter(m => m.gender === 'Female' || m.gender === 'महिला').length;

    await house.save();

    res.status(200).json({
      success: true,
      message: 'परिवार सदस्य हटाइयो',
      data: house
    });
  } catch (error) {
    next(error);
  }
};
