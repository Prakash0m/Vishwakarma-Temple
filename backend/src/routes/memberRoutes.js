import express from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getMembers)
  .post(protect, createMember);

router.route('/:id')
  .get(protect, getMemberById)
  .put(protect, updateMember)
  .delete(protect, deleteMember);

export default router;
