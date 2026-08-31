import { TempleIncome } from '../models/TempleIncome.js';
import { IncomeSource } from '../models/IncomeSource.js';

// Auto-generate next Income ID
const generateIncomeId = async () => {
  const last = await TempleIncome.findOne().sort({ createdAt: -1 });
  if (!last || !last.incomeId) {
    return 'INC-2026-0001';
  }
  const match = last.incomeId.match(/INC-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `INC-2026-${String(nextNum).padStart(4, '0')}`;
  }
  return `INC-2026-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all temple income records with search and filters
// @route   GET /api/temple-income
// @access  Public / Admin
export const getIncomes = async (req, res, next) => {
  try {
    const { sourceName, sourceCategory, year, month, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (sourceName && sourceName !== 'all') {
      query.sourceName = sourceName;
    }

    if (sourceCategory && sourceCategory !== 'all') {
      query.sourceCategory = sourceCategory;
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

      query.date = { $gte: start, $lte: end };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { incomeId: searchRegex },
        { sourceName: searchRegex },
        { description: searchRegex },
        { receivedBy: searchRegex },
        { payerName: searchRegex }
      ];
    }

    const total = await TempleIncome.countDocuments(query);
    const incomes = await TempleIncome.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));

    // Calculate source-wise aggregations
    const allIncomes = await TempleIncome.find();
    const totalTempleIncome = allIncomes.reduce((sum, item) => sum + (item.amount || 0), 0);

    const jalahawaPokhariIncome = allIncomes
      .filter(i => i.sourceName.includes('जलाहवा') || i.sourceName.includes('Jalahawa'))
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const gosaiPokhariIncome = allIncomes
      .filter(i => i.sourceName.includes('गोसाइँ') || i.sourceName.includes('Gosai'))
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const donationIncome = allIncomes
      .filter(i => i.sourceName.includes('भेटी') || i.sourceName.includes('दान'))
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    const otherIncome = totalTempleIncome - (jalahawaPokhariIncome + gosaiPokhariIncome + donationIncome);

    res.status(200).json({
      success: true,
      count: incomes.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      summary: {
        totalTempleIncome,
        jalahawaPokhariIncome,
        gosaiPokhariIncome,
        donationIncome,
        otherIncome
      },
      data: incomes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new temple income record
// @route   POST /api/temple-income
// @access  Private/Admin
export const createIncome = async (req, res, next) => {
  try {
    const { sourceName, sourceCategory, amount, date, fiscalYear, description, receivedBy, payerName, payerPhone, paymentMethod, transactionId, receiptImage, notes } = req.body;

    if (!sourceName || !amount || !description || !receivedBy) {
      return res.status(400).json({ success: false, message: 'आम्दानीको स्रोत, रकम, विवरण र बुझिलिने व्यक्तिको नाम अनिवार्य छ' });
    }

    const incomeId = await generateIncomeId();

    const income = await TempleIncome.create({
      incomeId,
      sourceName,
      sourceCategory: sourceCategory || (sourceName.includes('पोखरी') ? 'Pokhari' : 'Other'),
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      fiscalYear: fiscalYear || '२०८३/२०८४',
      description,
      receivedBy,
      payerName: payerName || '',
      payerPhone: payerPhone || '',
      paymentMethod: paymentMethod || 'Bank Transfer',
      transactionId: transactionId || '',
      receiptImage: receiptImage || '',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'मन्दिर आम्दानी विवरण सफलतापूर्वक दर्ता भयो (Temple income recorded)',
      data: income
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update temple income
// @route   PUT /api/temple-income/:id
// @access  Private/Admin
export const updateIncome = async (req, res, next) => {
  try {
    const income = await TempleIncome.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!income) {
      return res.status(404).json({ success: false, message: 'आम्दानी विवरण फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'आम्दानी विवरण अद्यावधिक भयो',
      data: income
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete temple income
// @route   DELETE /api/temple-income/:id
// @access  Private/Admin
export const deleteIncome = async (req, res, next) => {
  try {
    const income = await TempleIncome.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, message: 'आम्दानी विवरण फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'आम्दानी विवरण सफलतापूर्वक मेटाइयो'
    });
  } catch (error) {
    next(error);
  }
};
