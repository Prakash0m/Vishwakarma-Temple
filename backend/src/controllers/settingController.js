import Setting from '../models/Setting.js';
import Pooja from '../models/Pooja.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import Meeting from '../models/Meeting.js';
import Donation from '../models/Donation.js';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import Member from '../models/Member.js';

// Fast In-Memory Cache for ultra-fast response
let cachedSettings = null;
let lastSettingsFetch = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds memory cache

let cachedFeed = null;
let lastFeedFetch = 0;
const FEED_TTL = 30 * 1000; // 30 seconds memory cache

// @desc    Get website settings & CMS content
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedSettings && (now - lastSettingsFetch) < CACHE_TTL_MS) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.status(200).json({ success: true, data: cachedSettings });
    }

    let settings = await Setting.findOne().lean();
    if (!settings) {
      const created = await Setting.create({});
      settings = created.toObject();
    }

    cachedSettings = settings;
    lastSettingsFetch = now;

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unified homepage feed in 1 single fast roundtrip (replaces 10 separate API calls)
// @route   GET /api/homepage-feed
// @access  Public
export const getHomepageFeed = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedFeed && (now - lastFeedFetch) < FEED_TTL) {
      res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      return res.status(200).json({ success: true, cached: true, data: cachedFeed });
    }

    const [
      settings,
      poojas,
      events,
      gallery,
      meetings,
      donations,
      budgets,
      donAgg,
      expAgg,
      totalMembers
    ] = await Promise.all([
      Setting.findOne().lean(),
      Pooja.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
      Event.find({ isPublished: true }).sort({ date: 1 }).lean(),
      Gallery.find().sort({ order: 1, createdAt: -1 }).limit(16).lean(),
      Meeting.find().lean(),
      Donation.find({ isVerified: true }).sort({ date: -1 }).limit(25).lean(),
      Budget.find().sort({ category: 1 }).lean(),
      Donation.aggregate([{ $match: { isVerified: true } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Member.countDocuments()
    ]);

    let virtualMeeting = meetings.find(m => m.type === 'VirtualMeeting') || null;
    let liveDarshan = meetings.find(m => m.type === 'LiveDarshan') || null;

    const totalDonation = donAgg.length > 0 ? donAgg[0].total : 0;
    const totalExpense = expAgg.length > 0 ? expAgg[0].total : 0;
    const totalBudget = budgets.reduce((sum, b) => sum + (b.allocatedAmount || 0), 0);

    const supporters = donations.map(d => ({
      _id: d._id,
      name: d.privacy === 'anonymous' ? 'एक श्रद्धालु भक्तजन (Devotee)' : d.donorName,
      amount: d.amount,
      purpose: d.purpose,
      date: d.date
    }));

    const feedData = {
      settings: settings || {},
      poojas: poojas || [],
      events: events || [],
      gallery: gallery || [],
      meetingData: { virtualMeeting, liveDarshan },
      supporters,
      budgets: budgets || [],
      summary: {
        totalDonation,
        totalExpense,
        totalMembers,
        totalDonors: supporters.length,
        totalBudget
      }
    };

    cachedFeed = feedData;
    lastFeedFetch = now;

    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.status(200).json({ success: true, data: feedData });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings & CMS content
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    // Invalidate and update memory cache
    cachedSettings = settings ? settings.toObject() : null;
    lastSettingsFetch = Date.now();
    cachedFeed = null; // Invalidate feed cache

    res.status(200).json({
      success: true,
      message: 'Website settings and content updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};
