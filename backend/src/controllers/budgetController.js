import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Get all budgets with real-time spent, remaining, and health status
// @route   GET /api/budgets
// @access  Public/Private
export const getBudgets = async (req, res, next) => {
  try {
    const { fiscalYear = '2081/82 (2026)' } = req.query;

    const budgets = await Budget.find({ fiscalYear }).sort({ category: 1 });

    const budgetsWithAnalysis = await Promise.all(
      budgets.map(async (b) => {
        const spentAgg = await Expense.aggregate([
          { $match: { category: b.category } },
          { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
        ]);

        const spent = spentAgg.length > 0 ? spentAgg[0].totalSpent : 0;
        const allocated = b.allocatedAmount;
        const remaining = allocated - spent;
        const percentageUsed = allocated > 0 ? Number(((spent / allocated) * 100).toFixed(1)) : 0;

        let statusColor = 'green';
        if (percentageUsed >= 100) {
          statusColor = 'red';
        } else if (percentageUsed >= 80) {
          statusColor = 'orange';
        }

        return {
          ...b.toObject(),
          spent,
          remaining,
          percentageUsed,
          statusColor
        };
      })
    );

    // Total budget summary calculations
    const totalAllocated = budgetsWithAnalysis.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
    const totalSpent = budgetsWithAnalysis.reduce((acc, curr) => acc + curr.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const overallPercentage = totalAllocated > 0 ? Number(((totalSpent / totalAllocated) * 100).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      summary: {
        totalAllocated,
        totalSpent,
        totalRemaining,
        overallPercentage
      },
      data: budgetsWithAnalysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new budget allocation
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { category, allocatedAmount, fiscalYear, notes, categoryEnglish } = req.body;

    const existing = await Budget.findOne({ category, fiscalYear: fiscalYear || '2081/82 (2026)' });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Budget for '${category}' in fiscal year '${fiscalYear}' already exists. Please update it instead.`
      });
    }

    const newBudget = await Budget.create({
      category,
      categoryEnglish: categoryEnglish || '',
      allocatedAmount: Number(allocatedAmount),
      fiscalYear: fiscalYear || '2081/82 (2026)',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Budget allocated successfully',
      data: newBudget
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget allocation
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Budget record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget allocation
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const deleted = await Budget.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Budget record not found' });
    }
    res.status(200).json({ success: true, message: 'Budget record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
