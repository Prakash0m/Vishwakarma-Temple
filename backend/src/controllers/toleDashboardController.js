import { House } from '../models/House.js';
import { ToleMeeting } from '../models/ToleMeeting.js';
import { MeetingAttendance } from '../models/MeetingAttendance.js';
import { Fine } from '../models/Fine.js';
import { Wedding } from '../models/Wedding.js';
import { ToleCandidate } from '../models/ToleCandidate.js';
import { TempleIncome } from '../models/TempleIncome.js';
import { FundCampaign } from '../models/FundCampaign.js';
import { FundPayment } from '../models/FundPayment.js';
import Donation from '../models/Donation.js';
import Expense from '../models/Expense.js';

// @desc    Get master dashboard metrics including Tole, Meetings, Fines, Weddings, Leadership, Temple Income, and Tole Fund
// @route   GET /api/tole/dashboard
// @access  Public / Admin
export const getToleDashboardMetrics = async (req, res, next) => {
  try {
    const [
      houses,
      meetings,
      fines,
      weddings,
      candidates,
      templeIncomes,
      fundCampaigns,
      fundPayments,
      templeDonations,
      templeExpenses
    ] = await Promise.all([
      House.find(),
      ToleMeeting.find().sort({ date: -1 }),
      Fine.find().sort({ date: -1 }),
      Wedding.find().sort({ weddingDate: 1 }),
      ToleCandidate.find({ status: { $in: ['Active', 'सक्रिय'] } }).sort({ displayOrder: 1 }),
      TempleIncome.find(),
      FundCampaign.find().sort({ createdAt: -1 }),
      FundPayment.find().sort({ submittedDate: -1 }),
      Donation.find(),
      Expense.find()
    ]);

    // 1. Tole Demographics
    const totalHouses = houses.length;
    const singleFamilies = houses.filter(h => h.familyType === 'Single Family' || h.familyType === 'एकल परिवार').length;
    const jointFamilies = houses.filter(h => h.familyType === 'Joint Family' || h.familyType === 'संयुक्त परिवार').length;
    const totalPopulation = houses.reduce((sum, h) => sum + (h.totalMembers || 0), 0);
    const totalMale = houses.reduce((sum, h) => sum + (h.maleCount || 0), 0);
    const totalFemale = houses.reduce((sum, h) => sum + (h.femaleCount || 0), 0);

    // 2. Meeting Attendance
    const totalMeetings = meetings.length;
    const completedMeetings = meetings.filter(m => m.status === 'Completed');
    const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled' && new Date(m.date) >= new Date());
    
    let totalPresentSum = 0;
    let totalRosterSum = 0;
    completedMeetings.forEach(m => {
      totalPresentSum += m.presentCount || 0;
      totalRosterSum += m.totalHouses || 0;
    });
    const avgAttendanceRate = totalRosterSum > 0 ? Number(((totalPresentSum / totalRosterSum) * 100).toFixed(1)) : 0;

    // 3. Fines
    const totalFineAmount = fines.reduce((sum, f) => sum + (f.amount || 0), 0);
    const collectedFineAmount = fines.reduce((sum, f) => sum + (f.paidAmount || (f.status === 'Paid' ? f.amount : 0)), 0);
    const pendingFineAmount = totalFineAmount - collectedFineAmount;

    // 4. Weddings
    const upcomingWeddings = weddings.filter(w => w.status === 'Upcoming' && new Date(w.weddingDate) >= new Date());
    const totalWeddings = weddings.length;

    // 5. Temple Income (Kept financially distinct)
    const totalTempleIncome = templeIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const jalahawaPokhariIncome = templeIncomes
      .filter(i => i.sourceName.includes('जलाहवा') || i.sourceName.includes('Jalahawa'))
      .reduce((sum, i) => sum + (i.amount || 0), 0);
    const gosaiPokhariIncome = templeIncomes
      .filter(i => i.sourceName.includes('गोसाइँ') || i.sourceName.includes('Gosai'))
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    // 6. Tole Fund Collection
    const approvedFundPayments = fundPayments.filter(p => p.status === 'Approved' || p.status === 'स्वीकृत');
    const pendingFundPayments = fundPayments.filter(p => p.status === 'Pending' || p.status === 'प्रतीक्षारत');
    const totalFundCollected = approvedFundPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalFundPending = pendingFundPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const activeCampaign = fundCampaigns.find(c => c.status === 'Active' || c.status === 'सक्रिय') || fundCampaigns[0] || null;

    res.status(200).json({
      success: true,
      data: {
        tole: {
          totalHouses,
          singleFamilies,
          jointFamilies,
          totalPopulation,
          totalMale,
          totalFemale
        },
        meetings: {
          totalMeetings,
          completedCount: completedMeetings.length,
          upcomingCount: upcomingMeetings.length,
          avgAttendanceRate,
          recentMeeting: meetings[0] || null,
          upcomingMeetings: upcomingMeetings.slice(0, 3)
        },
        fines: {
          totalFinesCount: fines.length,
          totalFineAmount,
          collectedFineAmount,
          pendingFineAmount
        },
        weddings: {
          totalWeddings,
          upcomingCount: upcomingWeddings.length,
          upcomingWeddings: upcomingWeddings.slice(0, 3)
        },
        leadership: {
          totalActiveCandidates: candidates.length,
          candidates
        },
        templeIncome: {
          totalTempleIncome,
          jalahawaPokhariIncome,
          gosaiPokhariIncome,
          otherIncome: totalTempleIncome - (jalahawaPokhariIncome + gosaiPokhariIncome)
        },
        toleFund: {
          activeCampaign,
          totalCampaigns: fundCampaigns.length,
          totalFundCollected,
          totalFundPending,
          approvedPaymentsCount: approvedFundPayments.length,
          pendingPaymentsCount: pendingFundPayments.length,
          recentPayments: fundPayments.slice(0, 5)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
