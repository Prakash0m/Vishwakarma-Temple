import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .put(protect, updateSettings);

export default router;
