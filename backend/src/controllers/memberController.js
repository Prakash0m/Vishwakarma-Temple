import Member from '../models/Member.js';
import Donation from '../models/Donation.js';

// @desc    Get all members with search, filter, pagination
// @route   GET /api/members
// @access  Public/Private
export const getMembers = async (req, res, next) => {
  try {
    const { search, status, membershipType, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (membershipType && membershipType !== 'All') {
      query.membershipType = membershipType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { memberId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Member.countDocuments(query);
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Calculate total donation per member
    const membersWithDonations = await Promise.all(
      members.map(async (m) => {
        const donationAgg = await Donation.aggregate([
          { $match: { member: m._id, isVerified: true } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);
        return {
          ...m.toObject(),
          totalDonated: donationAgg.length > 0 ? donationAgg[0].total : 0,
          donationCount: donationAgg.length > 0 ? donationAgg[0].count : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      count: members.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: membersWithDonations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single member profile with full donation history
// @route   GET /api/members/:id
// @access  Private
export const getMemberById = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Fetch full donation history
    const donations = await Donation.find({ member: member._id, isVerified: true })
      .sort({ date: -1 });

    const totalDonated = donations.reduce((acc, curr) => acc + curr.amount, 0);
    const donationCount = donations.length;
    const lastDonation = donations.length > 0 ? donations[0].date : null;

    res.status(200).json({
      success: true,
      data: {
        member,
        donations,
        totalDonated,
        donationCount,
        lastDonation
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new member
// @route   POST /api/members
// @access  Private
export const createMember = async (req, res, next) => {
  try {
    let { memberId } = req.body;

    // Auto-generate memberId if not provided
    if (!memberId) {
      const count = await Member.countDocuments();
      const currentYear = new Date().getFullYear();
      memberId = `VKT-${currentYear}-${String(count + 1).padStart(3, '0')}`;
    }

    const newMember = await Member.create({
      ...req.body,
      memberId: memberId.toUpperCase().trim()
    });

    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
      data: newMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
export const updateMember = async (req, res, next) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
export const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await Member.findByIdAndDelete(req.params.id);

    // Unlink any donations associated with this member (keep donations intact)
    await Donation.updateMany({ member: req.params.id }, { $set: { member: null } });

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
