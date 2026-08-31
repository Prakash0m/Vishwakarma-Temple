import express from 'express';
import {
  getContactMessages,
  submitContactMessage,
  updateContactMessage,
  deleteContactMessage
} from '../controllers/contactController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getContactMessages)
  .post(submitContactMessage);

router.route('/:id')
  .put(protect, updateContactMessage)
  .delete(protect, deleteContactMessage);

export default router;
