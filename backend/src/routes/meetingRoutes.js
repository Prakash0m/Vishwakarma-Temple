import express from 'express';
import { getMeetings, updateMeeting } from '../controllers/meetingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getMeetings);
router.put('/:id', protect, updateMeeting);

export default router;
