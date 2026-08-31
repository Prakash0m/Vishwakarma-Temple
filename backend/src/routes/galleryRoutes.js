import express from 'express';
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, createGalleryItem);

router.route('/:id')
  .put(protect, updateGalleryItem)
  .delete(protect, deleteGalleryItem);

export default router;
