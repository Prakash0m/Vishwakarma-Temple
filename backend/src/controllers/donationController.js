import Donation from '../models/Donation.js';
import Setting from '../models/Setting.js';

// @desc    Get all donations (with search, filter, pagination)
// @route   GET /api/donations
// @access  Public/Private
export const getDonations = async (req, res, next) => {
  try {
    const {
      search,
      paymentMethod,
      purpose,
      memberId,
      page = 1,
      limit = 50,
      startDate,
      endDate
    } = req.query;

    const query = { isVerified: true };

    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    if (purpose && purpose !== 'All') {
      query.purpose = purpose;
    }

    if (memberId) {
      query.member = memberId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
        { donorPhone: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .populate('member', 'name memberId phone')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Calculate sum for current query filter
    const aggregateSum = await Donation.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const filteredTotalAmount = aggregateSum.length > 0 ? aggregateSum[0].totalAmount : 0;

    res.status(200).json({
      success: true,
      count: donations.length,
      total,
      filteredTotalAmount,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public donor ticker list (respecting privacy rules)
// @route   GET /api/donations/public-supporters
// @access  Public
export const getPublicSupporters = async (req, res, next) => {
  try {
    const settings = await Setting.findOne();
    const privacySetting = settings?.donorPrivacyDisplay || 'public';

    if (privacySetting === 'disabled' || settings?.showDonorList === false) {
      return res.status(200).json({ success: true, data: [] });
    }

    const donations = await Donation.find({ isVerified: true })
      .sort({ date: -1 })
      .limit(30)
      .select('donorName donorNameDevanagari amount purpose date privacy');

    const formattedDonors = donations.map((d) => {
      let displayName = d.donorNameDevanagari || d.donorName;
      let displayPrivacy = d.privacy || privacySetting;

      if (displayPrivacy === 'anonymous' || privacySetting === 'anonymous') {
        displayName = 'एक श्रद्धालु भक्तजन (Devotee)';
      } else if (displayPrivacy === 'initials' || privacySetting === 'initials') {
        const parts = displayName.split(' ');
        displayName = parts.map(p => p[0] ? p[0] + '.' : '').join(' ');
      }

      return {
        _id: d._id,
        name: displayName,
        amount: d.amount,
        purpose: d.purpose,
        date: d.date
      };
    });

    res.status(200).json({
      success: true,
      data: formattedDonors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Private
export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('member');
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

// @desc    Record new donation (Admin or Public pledge)
// @route   POST /api/donations
// @access  Public/Private
export const createDonation = async (req, res, next) => {
  try {
    let { receiptNumber, amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid donation amount is required' });
    }

    // Auto-generate receipt number if not provided
    if (!receiptNumber) {
      const count = await Donation.countDocuments();
      const currentYear = new Date().getFullYear();
      receiptNumber = `RCP-${currentYear}-${String(count + 1).padStart(4, '0')}`;
    }

    const donationData = {
      ...req.body,
      receiptNumber: receiptNumber.toUpperCase().trim(),
      amount: Number(amount),
      recordedBy: req.user ? req.user._id : null
    };

    const newDonation = await Donation.create(donationData);

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: newDonation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private
export const updateDonation = async (req, res, next) => {
  try {
    const updated = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('member');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private
export const deleteDonation = async (req, res, next) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }
    res.status(200).json({ success: true, message: 'Donation record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
