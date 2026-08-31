import express from 'express';
import {
  getPoojas,
  getPoojaById,
  createPooja,
  updatePooja,
  deletePooja
} from '../controllers/poojaController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getPoojas)
  .post(protect, createPooja);

router.route('/:id')
  .get(getPoojaById)
  .put(protect, updatePooja)
  .delete(protect, deletePooja);

export default router;
