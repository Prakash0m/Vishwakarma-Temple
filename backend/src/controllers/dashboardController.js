import Donation from '../models/Donation.js';
import Expense from '../models/Expense.js';
import Member from '../models/Member.js';
import Budget from '../models/Budget.js';
import PoojaBooking from '../models/PoojaBooking.js';
import ContactMessage from '../models/ContactMessage.js';

// Fast In-Memory Cache for Dashboard Metrics
let cachedDashboard = null;
let lastDashboardFetch = 0;
const DASHBOARD_TTL = 15 * 1000; // 15 seconds memory cache

// @desc    Get complete financial & operational dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedDashboard && (now - lastDashboardFetch) < DASHBOARD_TTL) {
      res.set('Cache-Control', 'private, max-age=15');
      return res.status(200).json({ success: true, cached: true, data: cachedDashboard });
    }

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    // Run ALL independent aggregations concurrently with Promise.all (Eliminates sequential roundtrips)
    const [
      donationAgg,
      expenseAgg,
      budgetAgg,
      totalMembers,
      activeMembers,
      distinctDonors,
      monthlyDonations,
      monthlyExpenses,
      paymentMethods,
      donationPurposes,
      expenseCategories,
      allBudgets,
      categoryExpensesAgg,
      recentDonations,
      recentExpenses,
      pendingBookingsCount,
      newMessagesCount
    ] = await Promise.all([
      Donation.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Budget.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: null, total: { $sum: '$allocatedAmount' } } }
      ]),
      Member.countDocuments(),
      Member.countDocuments({ status: 'Active' }),
      Donation.distinct('donorName'),
      Donation.aggregate([
        {
          $match: {
            isVerified: true,
            date: { $gte: yearStart }
          }
        },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Expense.aggregate([
        {
          $match: {
            date: { $gte: yearStart }
          }
        },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Donation.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Donation.aggregate([
        { $match: { isVerified: true } },
        { $group: { _id: '$purpose', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Expense.aggregate([
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Budget.find({ status: 'Active' }).lean(),
      Expense.aggregate([
        { $group: { _id: '$category', spent: { $sum: '$amount' } } }
      ]),
      Donation.find({ isVerified: true })
        .sort({ date: -1 })
        .limit(5)
        .populate('member', 'name memberId')
        .lean(),
      Expense.find()
        .sort({ date: -1 })
        .limit(5)
        .lean(),
      PoojaBooking.countDocuments({ status: 'Pending' }),
      ContactMessage.countDocuments({ status: 'New' })
    ]);

    const totalDonation = donationAgg.length > 0 ? donationAgg[0].total : 0;
    const totalDonationCount = donationAgg.length > 0 ? donationAgg[0].count : 0;
    const totalExpense = expenseAgg.length > 0 ? expenseAgg[0].total : 0;
    const totalExpenseCount = expenseAgg.length > 0 ? expenseAgg[0].count : 0;
    const balance = totalDonation - totalExpense;
    const totalBudget = budgetAgg.length > 0 ? budgetAgg[0].total : 0;
    const remainingBudget = Math.max(0, totalBudget - totalExpense);
    const totalDonors = distinctDonors.length;

    // Monthly trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNamesNepali = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत'];

    const monthlyTrends = monthNames.map((m, index) => {
      const monthNum = index + 1;
      const dMatch = monthlyDonations.find(d => d._id === monthNum);
      const eMatch = monthlyExpenses.find(e => e._id === monthNum);
      return {
        month: m,
        monthNepali: monthNamesNepali[index] || m,
        donations: dMatch ? dMatch.total : 0,
        expenses: eMatch ? eMatch.total : 0
      };
    });

    // Zero-query in-memory Map for Budget utilization (completely eliminates N+1 loop)
    const catExpenseMap = new Map(categoryExpensesAgg.map(c => [c._id, c.spent]));
    const budgetUtilization = allBudgets.map(b => {
      const spent = catExpenseMap.get(b.category) || 0;
      const remaining = b.allocatedAmount - spent;
      const percentage = b.allocatedAmount > 0 ? Math.round((spent / b.allocatedAmount) * 100) : 0;

      let health = 'green';
      if (percentage >= 100) health = 'red';
      else if (percentage >= 80) health = 'orange';

      return {
        _id: b._id,
        category: b.category,
        categoryEnglish: b.categoryEnglish,
        allocated: b.allocatedAmount,
        spent,
        remaining,
        percentage,
        health
      };
    });

    const responseData = {
      totalDonation,
      totalDonationCount,
      totalExpense,
      totalExpenseCount,
      balance,
      totalBudget,
      remainingBudget,
      totalMembers,
      activeMembers,
      totalDonors,
      monthlyTrends,
      paymentMethods,
      donationPurposes,
      expenseCategories,
      budgetUtilization,
      recentDonations,
      recentExpenses,
      pendingBookingsCount,
      newMessagesCount
    };

    cachedDashboard = responseData;
    lastDashboardFetch = now;

    res.set('Cache-Control', 'private, max-age=15');
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};
