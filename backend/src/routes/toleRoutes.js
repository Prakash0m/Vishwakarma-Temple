import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';

// House Controller
import {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  addFamilyMember,
  deleteFamilyMember
} from '../controllers/houseController.js';

// Meeting & Attendance Controllers
import {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting
} from '../controllers/toleMeetingController.js';

import {
  getMeetingRoster,
  saveBatchAttendance,
  getAttendanceStats
} from '../controllers/meetingAttendanceController.js';

// Fine Controller
import {
  getFines,
  createFine,
  payFine,
  waiveFine,
  deleteFine
} from '../controllers/fineController.js';

// Wedding Controller
import {
  getWeddings,
  createWedding,
  updateWedding,
  deleteWedding
} from '../controllers/weddingController.js';

// Leadership / 5 Candidates Controller
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  toggleCandidateStatus,
  deleteCandidate
} from '../controllers/toleCandidateController.js';

// Fund Campaign & Payment Controllers
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  toggleCampaignStatus
} from '../controllers/fundCampaignController.js';

import {
  lookupMemberByPhone,
  submitFundPayment,
  getFundPayments,
  approveFundPayment,
  rejectFundPayment,
  getHouseFundReport
} from '../controllers/fundPaymentController.js';

// Dashboard Metrics Controller
import { getToleDashboardMetrics } from '../controllers/toleDashboardController.js';

const router = express.Router();

// --- 1. DASHBOARD ---
router.get('/dashboard', getToleDashboardMetrics);
router.get('/dashboard/stats', getToleDashboardMetrics);

// --- 2. HOUSES & FAMILY MEMBERS ---
router.route('/houses')
  .get(getHouses)
  .post(protect, createHouse);

router.route('/houses/:id')
  .get(getHouseById)
  .put(protect, updateHouse)
  .delete(protect, deleteHouse);

router.post('/houses/:id/members', protect, addFamilyMember);
router.delete('/houses/:id/members/:memberId', protect, deleteFamilyMember);

// --- 3. MEETINGS ---
router.route('/meetings')
  .get(getMeetings)
  .post(protect, createMeeting);

router.route('/meetings/:id')
  .get(getMeetingById)
  .put(protect, updateMeeting)
  .delete(protect, deleteMeeting);

// --- 4. ATTENDANCE ---
router.get('/attendance/stats', getAttendanceStats);
router.get('/attendance/roster/:meetingId', protect, getMeetingRoster);
router.post('/attendance/batch', protect, saveBatchAttendance);

// --- 5. FINES ---
router.route('/fines')
  .get(getFines)
  .post(protect, createFine);

router.put('/fines/:id/pay', protect, payFine);
router.put('/fines/:id/waive', protect, waiveFine);
router.delete('/fines/:id', protect, deleteFine);

// --- 6. WEDDINGS ---
router.route('/weddings')
  .get(getWeddings)
  .post(protect, createWedding);

router.route('/weddings/:id')
  .put(protect, updateWedding)
  .delete(protect, deleteWedding);

// --- 7. LEADERSHIP / 5 CANDIDATES ---
router.route('/leadership')
  .get(getCandidates)
  .post(protect, createCandidate);

router.route('/leadership/:id')
  .put(protect, updateCandidate)
  .delete(protect, deleteCandidate);

router.patch('/leadership/:id/status', protect, toggleCandidateStatus);

// --- 8. MONTHLY FUND CAMPAIGNS ---
router.route('/fund-campaigns')
  .get(getCampaigns)
  .post(protect, createCampaign);

router.route('/fund-campaigns/:id')
  .put(protect, updateCampaign);

router.patch('/fund-campaigns/:id/status', protect, toggleCampaignStatus);

// --- 9. FUND PAYMENTS & APPROVALS ---
router.get('/fund-payments/lookup', lookupMemberByPhone); // Public mobile lookup
router.post('/fund-payments/submit', submitFundPayment);  // Public payment submission
router.get('/fund-payments/reports/house-due', getHouseFundReport);

router.route('/fund-payments')
  .get(protect, getFundPayments);

router.put('/fund-payments/:id/approve', protect, approveFundPayment);
router.put('/fund-payments/:id/reject', protect, rejectFundPayment);

export default router;
