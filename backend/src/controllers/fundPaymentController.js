import { FundPayment } from '../models/FundPayment.js';
import { FundCampaign } from '../models/FundCampaign.js';
import { House } from '../models/House.js';

// Auto-generate Payment ID (TFC-2026-0001)
const generatePaymentId = async () => {
  const last = await FundPayment.findOne().sort({ createdAt: -1 });
  if (!last || !last.paymentId) {
    return 'TFC-2026-0001';
  }
  const match = last.paymentId.match(/TFC-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `TFC-2026-${String(nextNum).padStart(4, '0')}`;
  }
  return `TFC-2026-${Date.now().toString().slice(-4)}`;
};

// @desc    Mobile Number Verification & Resident Identification for Fund Payment
// @route   GET /api/tole/fund-payments/lookup
// @access  Public
export const lookupMemberByPhone = async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone || phone.trim().length < 6) {
      return res.status(400).json({ success: false, message: 'कृपया मान्य मोबाइल नम्बर प्रविष्ट गर्नुहोस् (Please enter valid phone number)' });
    }

    const cleanPhone = phone.trim();
    const phoneRegex = new RegExp(cleanPhone, 'i');

    // Search house by representative phone, alternate phone, or family member phone
    const house = await House.findOne({
      $or: [
        { representativePhone: phoneRegex },
        { alternatePhone: phoneRegex },
        { 'familyMembers.phone': phoneRegex }
      ],
      status: { $in: ['Active', 'सक्रिय'] }
    });

    if (!house) {
      return res.status(404).json({
        success: false,
        message: 'यो मोबाइल नम्बर टोल दर्ता प्रणालीमा फेला परेन। कृपया टोल समितिसँग सम्पर्क गर्नुहोस्।'
      });
    }

    // Get active campaign
    const activeCampaign = await FundCampaign.findOne({ status: { $in: ['Active', 'सक्रिय'] } }) || await FundCampaign.findOne().sort({ createdAt: -1 });

    if (!activeCampaign) {
      return res.status(400).json({
        success: false,
        message: 'हाल कुनै सक्रिय मासिक कोष संकलन अभियान छैन।'
      });
    }

    // Check if house has already submitted or paid for this active campaign
    const existingPayment = await FundPayment.findOne({
      campaign: activeCampaign._id,
      house: house._id,
      status: { $in: ['Pending', 'Approved', 'प्रतीक्षारत', 'स्वीकृत'] }
    });

    let paymentStatusMsg = null;
    let canSubmit = true;

    if (existingPayment) {
      if (existingPayment.status === 'Approved' || existingPayment.status === 'स्वीकृत') {
        paymentStatusMsg = `यस महिना (${activeCampaign.month} ${activeCampaign.year}) को कोष रकम रु. ${existingPayment.amount} पहिले नै भुक्तानी भइसकेको छ (रसिद नं: ${existingPayment.receiptNumber || existingPayment.paymentId})।`;
        canSubmit = false;
      } else if (existingPayment.status === 'Pending' || existingPayment.status === 'प्रतीक्षारत') {
        paymentStatusMsg = `यस महिनाको भुक्तानी विवरण (ID: ${existingPayment.paymentId}) प्रशासनको समीक्षामा छ।`;
        canSubmit = false;
      }
    }

    // Identify matching person's name
    let matchedPerson = house.representativeName;
    const memberMatch = house.familyMembers.find(m => m.phone && m.phone.includes(cleanPhone));
    if (memberMatch) {
      matchedPerson = memberMatch.fullName;
    }

    // Return safe public details (do not expose sensitive private data)
    res.status(200).json({
      success: true,
      data: {
        houseIdDb: house._id,
        houseId: house.houseId,
        houseNumber: house.houseNumber,
        representativeName: house.representativeName,
        matchedPersonName: matchedPerson,
        familyType: house.familyType,
        totalMembers: house.totalMembers,
        address: house.address,
        phone: cleanPhone,
        activeCampaign: {
          _id: activeCampaign._id,
          campaignId: activeCampaign.campaignId,
          title: activeCampaign.title,
          month: activeCampaign.month,
          year: activeCampaign.year,
          amountPerHouse: activeCampaign.amountPerHouse,
          paymentInstructions: activeCampaign.paymentInstructions
        },
        canSubmit,
        paymentStatusMsg,
        existingPayment: existingPayment ? {
          paymentId: existingPayment.paymentId,
          receiptNumber: existingPayment.receiptNumber,
          amount: existingPayment.amount,
          status: existingPayment.status,
          submittedDate: existingPayment.submittedDate
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Monthly Fund Payment (Public with receipt voucher upload)
// @route   POST /api/tole/fund-payments/submit
// @access  Public
export const submitFundPayment = async (req, res, next) => {
  try {
    const {
      houseIdDb,
      campaignId,
      memberName,
      phone,
      amount,
      paymentMethod,
      transactionId,
      receiptVoucherImage,
      payerNotes
    } = req.body;

    if (!houseIdDb || !campaignId || !amount || !phone) {
      return res.status(400).json({
        success: false,
        message: 'घर, अभियान, रकम र फोन नम्बर अनिवार्य छ (House, Campaign, Amount, and Phone are required)'
      });
    }

    const house = await House.findById(houseIdDb);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर फेला परेन' });
    }

    const campaign = await FundCampaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'अभियान फेला परेन' });
    }

    // Check duplicate payment for this campaign
    const existing = await FundPayment.findOne({
      campaign: campaign._id,
      house: house._id,
      status: { $in: ['Pending', 'Approved', 'प्रतीक्षारत', 'स्वीकृत'] }
    });

    if (existing) {
      if (existing.status === 'Approved' || existing.status === 'स्वीकृत') {
        return res.status(400).json({
          success: false,
          message: `यस महिनाको कोष पहिले नै भुक्तानी भइसकेको छ (रसिद नं: ${existing.receiptNumber || existing.paymentId})`
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `यस महिनाको भुक्तानी पहिले नै दर्ता भइसकेको छ र प्रशासनिक समीक्षामा छ (ID: ${existing.paymentId})`
        });
      }
    }

    const paymentId = await generatePaymentId();

    const payment = await FundPayment.create({
      paymentId,
      receiptNumber: `REC-${paymentId.replace('TFC-', '')}`,
      campaign: campaign._id,
      campaignMonth: campaign.month,
      campaignYear: campaign.year,
      house: house._id,
      houseId: house.houseId,
      houseNumber: house.houseNumber,
      memberName: memberName || house.representativeName,
      phone,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'eSewa',
      transactionId: transactionId || '',
      receiptVoucherImage: receiptVoucherImage || '',
      payerNotes: payerNotes || '',
      status: 'Pending',
      submittedDate: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'तपाईंको मासिक कोष भुक्तानी विवरण सफलतापूर्वक पेश भयो। प्रशासनको प्रमाणीकरणपछि आधिकारिक रसिद जारी हुनेछ।',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all fund payments with filters (Admin)
// @route   GET /api/tole/fund-payments
// @access  Public / Admin
export const getFundPayments = async (req, res, next) => {
  try {
    const { status, campaignId, houseId, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (campaignId && campaignId !== 'all') {
      query.campaign = campaignId;
    }

    if (houseId) {
      query.houseId = houseId;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { paymentId: searchRegex },
        { receiptNumber: searchRegex },
        { houseId: searchRegex },
        { houseNumber: searchRegex },
        { memberName: searchRegex },
        { phone: searchRegex },
        { transactionId: searchRegex }
      ];
    }

    const total = await FundPayment.countDocuments(query);
    const payments = await FundPayment.find(query)
      .populate('campaign', 'title month year amountPerHouse')
      .populate('house', 'houseId houseNumber representativeName representativePhone familyType address')
      .sort({ submittedDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    // Summary calculations
    const allPayments = await FundPayment.find();
    const approvedPayments = allPayments.filter(p => p.status === 'Approved' || p.status === 'स्वीकृत');
    const pendingPayments = allPayments.filter(p => p.status === 'Pending' || p.status === 'प्रतीक्षारत');
    const rejectedPayments = allPayments.filter(p => p.status === 'Rejected' || p.status === 'अस्वीकृत');

    const totalCollectedAmount = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      summary: {
        totalPaymentsCount: allPayments.length,
        approvedCount: approvedPayments.length,
        pendingCount: pendingPayments.length,
        rejectedCount: rejectedPayments.length,
        totalCollectedAmount,
        totalPendingAmount
      },
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve fund payment
// @route   PUT /api/tole/fund-payments/:id/approve
// @access  Private/Admin
export const approveFundPayment = async (req, res, next) => {
  try {
    const payment = await FundPayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'भुक्तानी फेला परेन' });
    }

    payment.status = 'Approved';
    payment.approvedDate = new Date();
    payment.approvedBy = req.user?.name || 'Admin';
    payment.adminRemarks = req.body.adminRemarks || 'प्रशासनद्वारा प्रमाणीकरण गरी भुक्तानी स्वीकृत गरियो।';

    if (!payment.receiptNumber) {
      payment.receiptNumber = `REC-${payment.paymentId.replace('TFC-', '')}`;
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'कोष भुक्तानी सफलतापूर्वक स्वीकृत गरियो (Payment approved)',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject fund payment / Request correction
// @route   PUT /api/tole/fund-payments/:id/reject
// @access  Private/Admin
export const rejectFundPayment = async (req, res, next) => {
  try {
    const payment = await FundPayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'भुक्तानी फेला परेन' });
    }

    const { adminRemarks } = req.body;
    if (!adminRemarks) {
      return res.status(400).json({ success: false, message: 'अस्वीकृत गर्नुको कारण / टिप्पणी अनिवार्य छ' });
    }

    payment.status = 'Rejected';
    payment.adminRemarks = adminRemarks;
    payment.approvedDate = new Date();
    payment.approvedBy = req.user?.name || 'Admin';
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'भुक्तानी अस्वीकृत गरिएको छ',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get House-wise Fund Report & Due Analysis
// @route   GET /api/tole/fund-payments/reports/house-due
// @access  Public / Admin
export const getHouseFundReport = async (req, res, next) => {
  try {
    const { year = 2026 } = req.query;
    const yr = parseInt(year, 10);

    const [houses, campaigns, approvedPayments] = await Promise.all([
      House.find({ status: { $in: ['Active', 'सक्रिय'] } }).sort({ houseNumber: 1 }),
      FundCampaign.find({ year: yr }),
      FundPayment.find({
        campaignYear: yr,
        status: { $in: ['Approved', 'स्वीकृत'] }
      })
    ]);

    const totalCampaignAmountPerHouse = campaigns.reduce((sum, c) => sum + (c.amountPerHouse || 0), 0);

    const houseReport = houses.map(house => {
      const housePayments = approvedPayments.filter(p => p.house.toString() === house._id.toString() || p.houseId === house.houseId);
      const paidAmount = housePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const dueAmount = Math.max(0, totalCampaignAmountPerHouse - paidAmount);

      return {
        houseIdDb: house._id,
        houseId: house.houseId,
        houseNumber: house.houseNumber,
        representativeName: house.representativeName,
        representativePhone: house.representativePhone,
        familyType: house.familyType,
        totalRequired: totalCampaignAmountPerHouse,
        totalPaid: paidAmount,
        totalDue: dueAmount,
        status: dueAmount === 0 ? 'Fully Paid' : paidAmount > 0 ? 'Partially Paid' : 'Due'
      };
    });

    const totalExpected = houseReport.reduce((sum, h) => sum + h.totalRequired, 0);
    const totalCollected = houseReport.reduce((sum, h) => sum + h.totalPaid, 0);
    const totalDue = houseReport.reduce((sum, h) => sum + h.totalDue, 0);

    res.status(200).json({
      success: true,
      year: yr,
      totalHouses: houses.length,
      totalCampaigns: campaigns.length,
      summary: {
        totalExpected,
        totalCollected,
        totalDue,
        collectionRate: totalExpected > 0 ? Number(((totalCollected / totalExpected) * 100).toFixed(1)) : 0
      },
      data: houseReport
    });
  } catch (error) {
    next(error);
  }
};
