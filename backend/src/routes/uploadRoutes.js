import express from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultipleImages);

export default router;
