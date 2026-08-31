import express from 'express';
import {
  getDonations,
  getPublicSupporters,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation
} from '../controllers/donationController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/public-supporters', getPublicSupporters);

router.route('/')
  .get(getDonations)
  .post(createDonation); // Allows public devotee donations as well as admin entries

router.route('/:id')
  .get(protect, getDonationById)
  .put(protect, updateDonation)
  .delete(protect, deleteDonation);

export default router;
