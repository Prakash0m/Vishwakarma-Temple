import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome
} from '../controllers/templeIncomeController.js';

const router = express.Router();

router.route('/')
  .get(getIncomes)
  .post(protect, createIncome);

router.route('/:id')
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

export default router;
