import Donation from '../models/Donation.js';
import Expense from '../models/Expense.js';
import Member from '../models/Member.js';
import Budget from '../models/Budget.js';
import PoojaBooking from '../models/PoojaBooking.js';
import ContactMessage from '../models/ContactMessage.js';

// @desc    Get complete financial & operational dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    // 1. Total Donation calculation
    const donationAgg = await Donation.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const totalDonation = donationAgg.length > 0 ? donationAgg[0].total : 0;
    const totalDonationCount = donationAgg.length > 0 ? donationAgg[0].count : 0;

    // 2. Total Expense calculation
    const expenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const totalExpense = expenseAgg.length > 0 ? expenseAgg[0].total : 0;
    const totalExpenseCount = expenseAgg.length > 0 ? expenseAgg[0].count : 0;

    // 3. Current Net Balance
    const balance = totalDonation - totalExpense;

    // 4. Total Budget allocated
    const budgetAgg = await Budget.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, total: { $sum: '$allocatedAmount' } } }
    ]);
    const totalBudget = budgetAgg.length > 0 ? budgetAgg[0].total : 0;
    const remainingBudget = Math.max(0, totalBudget - totalExpense);

    // 5. Total Members
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });

    // 6. Distinct Donors count
    const distinctDonors = await Donation.distinct('donorName');
    const totalDonors = distinctDonors.length;

    // 7. Monthly donations & expenses (Last 6-12 months aggregation)
    const currentYear = new Date().getFullYear();
    const monthlyDonations = await Donation.aggregate([
      {
        $match: {
          isVerified: true,
          date: { $gte: new Date(currentYear, 0, 1) }
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
    ]);

    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: new Date(currentYear, 0, 1) }
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
    ]);

    // Build monthly combined array (Jan - Dec)
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

    // 8. Payment Method distribution
    const paymentMethods = await Donation.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // 9. Donation Purpose distribution
    const donationPurposes = await Donation.aggregate([
      { $match: { isVerified: true } },
      { $group: { _id: '$purpose', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // 10. Expense Category breakdown
    const expenseCategories = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // 11. Budget utilization per category
    const allBudgets = await Budget.find({ status: 'Active' });
    const budgetUtilization = await Promise.all(
      allBudgets.map(async (b) => {
        const spentAgg = await Expense.aggregate([
          { $match: { category: b.category } },
          { $group: { _id: null, spent: { $sum: '$amount' } } }
        ]);
        const spent = spentAgg.length > 0 ? spentAgg[0].spent : 0;
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
      })
    );

    // 12. Recent Activity & Counts
    const recentDonations = await Donation.find({ isVerified: true })
      .sort({ date: -1 })
      .limit(5)
      .populate('member', 'name memberId');

    const recentExpenses = await Expense.find()
      .sort({ date: -1 })
      .limit(5);

    const pendingBookingsCount = await PoojaBooking.countDocuments({ status: 'Pending' });
    const newMessagesCount = await ContactMessage.countDocuments({ status: 'New' });

    res.status(200).json({
      success: true,
      data: {
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
      }
    });
  } catch (error) {
    next(error);
  }
};
