import Expense from '../models/Expense.js';

// @desc    Get all expenses (search, filter, pagination)
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      paymentMethod,
      page = 1,
      limit = 50,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { voucherNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Calculate sum for current query filter
    const aggregateSum = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const filteredTotalAmount = aggregateSum.length > 0 ? aggregateSum[0].totalAmount : 0;

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      filteredTotalAmount,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Record new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res, next) => {
  try {
    let { voucherNumber, amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid expense amount is required' });
    }

    // Auto-generate voucher number if not supplied
    if (!voucherNumber) {
      const count = await Expense.countDocuments();
      const currentYear = new Date().getFullYear();
      voucherNumber = `EXP-${currentYear}-${String(count + 1).padStart(4, '0')}`;
    }

    const expenseData = {
      ...req.body,
      voucherNumber: voucherNumber.toUpperCase().trim(),
      amount: Number(amount),
      recordedBy: req.user ? req.user._id : null
    };

    const newExpense = await Expense.create(expenseData);

    res.status(201).json({
      success: true,
      message: 'Expense recorded successfully',
      data: newExpense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res, next) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};
