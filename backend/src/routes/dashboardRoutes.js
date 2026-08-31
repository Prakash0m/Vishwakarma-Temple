import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);

export default router;
