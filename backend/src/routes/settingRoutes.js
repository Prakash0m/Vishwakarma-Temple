import express from 'express';
import { getSettings, updateSettings, getHomepageFeed } from '../controllers/settingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/feed', getHomepageFeed);

router.route('/')
  .get(getSettings)
  .put(protect, updateSettings);

export default router;
