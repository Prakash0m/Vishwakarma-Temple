import { Fine } from '../models/Fine.js';
import { House } from '../models/House.js';

// Auto-generate next Fine ID
const generateFineId = async () => {
  const last = await Fine.findOne().sort({ createdAt: -1 });
  if (!last || !last.fineId) {
    return 'FINE-2026-0001';
  }
  const match = last.fineId.match(/FINE-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `FINE-2026-${String(nextNum).padStart(4, '0')}`;
  }
  return `FINE-2026-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all fines with search and filter
// @route   GET /api/tole/fines
// @access  Public / Admin
export const getFines = async (req, res, next) => {
  try {
    const { status, houseId, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (houseId) {
      query.houseId = houseId;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fineId: searchRegex },
        { houseId: searchRegex },
        { personName: searchRegex },
        { reason: searchRegex },
        { receiptNumber: searchRegex }
      ];
    }

    const total = await Fine.countDocuments(query);
    const fines = await Fine.find(query)
      .populate('house', 'houseId houseNumber representativeName representativePhone familyType address')
      .populate('meeting', 'title date meetingType')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    // Summary calculations
    const allFines = await Fine.find();
    const totalFineAmount = allFines.reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalCollectedAmount = allFines.reduce((sum, f) => sum + (f.paidAmount || (f.status === 'Paid' ? f.amount : 0)), 0);
    const totalPendingAmount = totalFineAmount - totalCollectedAmount;

    res.status(200).json({
      success: true,
      count: fines.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      summary: {
        totalFinesCount: allFines.length,
        totalFineAmount,
        totalCollectedAmount,
        totalPendingAmount,
        pendingFinesCount: allFines.filter(f => f.status === 'Pending').length,
        paidFinesCount: allFines.filter(f => f.status === 'Paid').length
      },
      data: fines
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new fine
// @route   POST /api/tole/fines
// @access  Private/Admin
export const createFine = async (req, res, next) => {
  try {
    const { houseIdDb, personName, meetingId, fineType, amount, reason, notes } = req.body;

    if (!houseIdDb || !amount || !reason) {
      return res.status(400).json({ success: false, message: 'घर, रकम र जरिवानाको कारण अनिवार्य छ' });
    }

    const house = await House.findById(houseIdDb);
    if (!house) {
      return res.status(404).json({ success: false, message: 'घर फेला परेन' });
    }

    const fineId = await generateFineId();

    const fine = await Fine.create({
      fineId,
      house: house._id,
      houseId: house.houseId,
      personName: personName || house.representativeName,
      meeting: meetingId || null,
      fineType: fineType || 'Tole Rule Violation',
      amount: Number(amount),
      reason,
      notes,
      date: new Date(),
      status: 'Pending',
      recordedBy: req.user?.name || 'Admin'
    });

    res.status(201).json({
      success: true,
      message: 'जरिवाना विवरण दर्ता भयो (Fine recorded successfully)',
      data: fine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pay fine
// @route   PUT /api/tole/fines/:id/pay
// @access  Private/Admin
export const payFine = async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'जरिवाना फेला परेन' });
    }

    const { paidAmount, paymentMethod, notes, transactionId } = req.body;
    const amountToPay = paidAmount !== undefined ? Number(paidAmount) : fine.amount;

    fine.paidAmount = amountToPay;
    fine.paymentMethod = paymentMethod || 'Cash';
    fine.paymentDate = new Date();
    fine.receiptNumber = `FRCP-${Date.now().toString().slice(-6)}`;
    fine.notes = notes || fine.notes;

    if (amountToPay >= fine.amount) {
      fine.status = 'Paid';
    } else if (amountToPay > 0) {
      fine.status = 'Partially Paid';
    }

    await fine.save();

    res.status(200).json({
      success: true,
      message: 'जरिवाना भुक्तानी सफलतापूर्वक दर्ता भयो (Fine payment recorded)',
      data: fine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Waive / forgive fine
// @route   PUT /api/tole/fines/:id/waive
// @access  Private/Admin
export const waiveFine = async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'जरिवाना फेला परेन' });
    }

    fine.status = 'Waived';
    fine.notes = `${fine.notes ? fine.notes + ' | ' : ''}मिनाहा कारण: ${req.body.reason || 'समितिको निर्णय अनुसार मिनाहा गरिएको'}`;
    await fine.save();

    res.status(200).json({
      success: true,
      message: 'जरिवाना मिनाहा गरिएको छ (Fine waived)',
      data: fine
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete fine
// @route   DELETE /api/tole/fines/:id
// @access  Private/Admin
export const deleteFine = async (req, res, next) => {
  try {
    const fine = await Fine.findByIdAndDelete(req.params.id);
    if (!fine) {
      return res.status(404).json({ success: false, message: 'जरिवाना फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'जरिवाना सफलतापूर्वक मेटाइयो'
    });
  } catch (error) {
    next(error);
  }
};
