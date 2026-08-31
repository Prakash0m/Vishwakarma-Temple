import { FundCampaign } from '../models/FundCampaign.js';
import { House } from '../models/House.js';
import { FundPayment } from '../models/FundPayment.js';

// Auto-generate Campaign ID (CAMP-2026-09)
const generateCampaignId = (month, year) => {
  const monthMap = {
    January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
    July: '07', August: '08', September: '09', October: '10', November: '11', December: '12',
    बैशाख: '01', जेठ: '02', असार: '03', साउन: '04', भदौ: '05', असोज: '06',
    कार्तिक: '07', मंसिर: '08', पुष: '09', माघ: '10', फागुन: '11', चैत: '12'
  };
  const mCode = monthMap[month] || '01';
  return `CAMP-${year}-${mCode}`;
};

// @desc    Get all monthly fund campaigns
// @route   GET /api/tole/fund-campaigns
// @access  Public / Admin
export const getCampaigns = async (req, res, next) => {
  try {
    const { status, year } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (year) {
      query.year = parseInt(year, 10);
    }

    const campaigns = await FundCampaign.find(query).sort({ year: -1, createdAt: -1 });

    // Update real-time collected statistics for each campaign
    const updatedCampaigns = await Promise.all(campaigns.map(async (camp) => {
      const approvedPayments = await FundPayment.find({
        campaign: camp._id,
        status: { $in: ['Approved', 'स्वीकृत'] }
      });

      const totalCollectedAmount = approvedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const collectedHouses = new Set(approvedPayments.map(p => p.houseId)).size;

      return {
        ...camp.toObject(),
        collectedHouses,
        totalCollectedAmount
      };
    }));

    // Find currently active campaign for public submission
    const activeCampaign = updatedCampaigns.find(c => c.status === 'Active' || c.status === 'सक्रिय') || updatedCampaigns[0] || null;

    res.status(200).json({
      success: true,
      count: updatedCampaigns.length,
      activeCampaign,
      data: updatedCampaigns
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new monthly fund campaign
// @route   POST /api/tole/fund-campaigns
// @access  Private/Admin
export const createCampaign = async (req, res, next) => {
  try {
    const { title, titleEnglish, month, year, amountPerHouse = 1000, startDate, endDate, description, paymentInstructions, status = 'Active' } = req.body;

    if (!title || !month || !year) {
      return res.status(400).json({ success: false, message: 'अभियानको शीर्षक, महिना र वर्ष अनिवार्य छ' });
    }

    const campaignId = generateCampaignId(month, year);

    // Count total active houses to calculate expected amount
    const activeHousesCount = await House.countDocuments({ status: { $in: ['Active', 'सक्रिय'] } });
    const totalExpectedAmount = activeHousesCount * Number(amountPerHouse);

    // If new campaign is set to Active, deactivate previous ones
    if (status === 'Active' || status === 'सक्रिय') {
      await FundCampaign.updateMany({}, { status: 'Closed' });
    }

    const campaign = await FundCampaign.create({
      campaignId,
      title,
      titleEnglish: titleEnglish || title,
      month,
      year: Number(year),
      amountPerHouse: Number(amountPerHouse),
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description,
      paymentInstructions: paymentInstructions || 'eSewa / Khalti / Fonepay वा बैंक ट्रान्सफर मार्फत भुक्तानी गरी भौचर अपलोड गर्नुहोस्।',
      status,
      targetHouses: activeHousesCount,
      totalExpectedAmount
    });

    res.status(201).json({
      success: true,
      message: 'नयाँ मासिक कोष संकलन अभियान सुरु गरियो (Monthly Fund Campaign created)',
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campaign
// @route   PUT /api/tole/fund-campaigns/:id
// @access  Private/Admin
export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await FundCampaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'अभियान फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'अभियान विवरण अद्यावधिक भयो',
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle campaign active status
// @route   PATCH /api/tole/fund-campaigns/:id/status
// @access  Private/Admin
export const toggleCampaignStatus = async (req, res, next) => {
  try {
    const campaign = await FundCampaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'अभियान फेला परेन' });
    }

    if (campaign.status !== 'Active') {
      // Deactivate other campaigns
      await FundCampaign.updateMany({}, { status: 'Closed' });
      campaign.status = 'Active';
    } else {
      campaign.status = 'Closed';
    }

    await campaign.save();

    res.status(200).json({
      success: true,
      message: `अभियान स्थिति परिवर्तन भयो: ${campaign.status}`,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};
