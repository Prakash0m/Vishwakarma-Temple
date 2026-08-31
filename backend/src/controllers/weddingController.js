import { Wedding } from '../models/Wedding.js';
import { House } from '../models/House.js';

// Auto-generate next Wedding ID
const generateWeddingId = async () => {
  const last = await Wedding.findOne().sort({ createdAt: -1 });
  if (!last || !last.weddingId) {
    return 'WED-2026-0001';
  }
  const match = last.weddingId.match(/WED-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `WED-2026-${String(nextNum).padStart(4, '0')}`;
  }
  return `WED-2026-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all weddings with search and calendar filters
// @route   GET /api/tole/weddings
// @access  Public / Admin
export const getWeddings = async (req, res, next) => {
  try {
    const { status, month, year, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (year) {
      const yr = parseInt(year, 10);
      let start = new Date(yr, 0, 1);
      let end = new Date(yr, 11, 31, 23, 59, 59);

      if (month && month !== 'all') {
        const mo = parseInt(month, 10) - 1;
        start = new Date(yr, mo, 1);
        end = new Date(yr, mo + 1, 0, 23, 59, 59);
      }

      query.weddingDate = { $gte: start, $lte: end };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { weddingId: searchRegex },
        { brideName: searchRegex },
        { groomName: searchRegex },
        { brideHouse: searchRegex },
        { groomHouse: searchRegex },
        { contactPerson: searchRegex },
        { contactPhone: searchRegex }
      ];
    }

    const weddings = await Wedding.find(query).sort({ weddingDate: 1 });

    const upcomingWeddings = await Wedding.find({
      weddingDate: { $gte: new Date() },
      status: 'Upcoming'
    }).sort({ weddingDate: 1 }).limit(5);

    res.status(200).json({
      success: true,
      count: weddings.length,
      summary: {
        totalWeddings: weddings.length,
        upcomingCount: weddings.filter(w => w.status === 'Upcoming').length,
        completedCount: weddings.filter(w => w.status === 'Completed').length
      },
      upcomingWeddings,
      data: weddings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new wedding record
// @route   POST /api/tole/weddings
// @access  Private/Admin
export const createWedding = async (req, res, next) => {
  try {
    const {
      brideName,
      groomName,
      brideHouse,
      groomHouse,
      weddingDate,
      weddingDateNepali,
      weddingType,
      contactPerson,
      contactPhone,
      location,
      weddingImage,
      notes
    } = req.body;

    if (!brideName || !groomName || !weddingDate || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'दुलहीको नाम, दुलहाको नाम, विवाह मिति र सम्पर्क नम्बर अनिवार्य छ'
      });
    }

    const weddingId = await generateWeddingId();

    const wedding = await Wedding.create({
      weddingId,
      brideName,
      groomName,
      brideHouse: brideHouse || '',
      groomHouse: groomHouse || '',
      weddingDate: new Date(weddingDate),
      weddingDateNepali: weddingDateNepali || '',
      weddingType: weddingType || 'Traditional Hindu',
      contactPerson: contactPerson || `${brideName} / ${groomName}`,
      contactPhone,
      location: location || 'छापकी, सप्तरी (विश्वकर्मा मन्दिर परिसर / वर-वधु निवास)',
      weddingImage: weddingImage || '',
      notes,
      status: 'Upcoming'
    });

    res.status(201).json({
      success: true,
      message: 'विवाह विवरण सफलतापूर्वक दर्ता भयो (Wedding registered successfully)',
      data: wedding
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update wedding
// @route   PUT /api/tole/weddings/:id
// @access  Private/Admin
export const updateWedding = async (req, res, next) => {
  try {
    const wedding = await Wedding.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!wedding) {
      return res.status(404).json({ success: false, message: 'विवाह विवरण फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'विवाह विवरण अद्यावधिक भयो',
      data: wedding
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete wedding
// @route   DELETE /api/tole/weddings/:id
// @access  Private/Admin
export const deleteWedding = async (req, res, next) => {
  try {
    const wedding = await Wedding.findByIdAndDelete(req.params.id);
    if (!wedding) {
      return res.status(404).json({ success: false, message: 'विवाह विवरण फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'विवाह विवरण सफलतापूर्वक मेटाइयो'
    });
  } catch (error) {
    next(error);
  }
};
