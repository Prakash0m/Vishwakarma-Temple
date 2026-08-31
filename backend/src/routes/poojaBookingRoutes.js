import express from 'express';
import {
  getPoojaBookings,
  createPoojaBooking,
  updatePoojaBooking,
  deletePoojaBooking
} from '../controllers/poojaBookingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getPoojaBookings)
  .post(createPoojaBooking); // Public booking submission

router.route('/:id')
  .put(protect, updatePoojaBooking)
  .delete(protect, deletePoojaBooking);

export default router;
