import Gallery from '../models/Gallery.js';
import { del } from '@vercel/blob';

// Category mapping helper
const CATEGORY_MAP = {
  Temple: 'मन्दिर',
  Bhagwan: 'भगवान',
  Pooja: 'पूजा',
  Events: 'कार्यक्रम',
  Bhajan: 'भजन',
  Devotees: 'भक्तजन',
  Donation: 'दान तथा सेवा',
  Festival: 'उत्सव',
  Other: 'अन्य'
};

/**
 * @desc    Get all gallery images (with optional category filter)
 * @route   GET /api/gallery
 * @access  Public
 */
export const getGallery = async (req, res, next) => {
  try {
    const { category, isFeatured } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create new gallery image record
 * @route   POST /api/gallery
 * @access  Private (Admin)
 */
export const createGalleryItem = async (req, res, next) => {
  try {
    const {
      title,
      titleEnglish,
      description,
      category = 'Temple',
      imageUrl,
      blobPathname,
      altText,
      isFeatured = false,
      order = 0
    } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'कृपया तस्वीरको शीर्षक र तस्वीर URL प्रविष्ट गर्नुहोस्।'
      });
    }

    const categoryNepali = CATEGORY_MAP[category] || 'मन्दिर';

    const newItem = await Gallery.create({
      title: title.trim(),
      titleEnglish: titleEnglish ? titleEnglish.trim() : '',
      description: description ? description.trim() : '',
      category,
      categoryNepali,
      imageUrl: imageUrl.trim(),
      blobPathname: blobPathname || '',
      altText: altText ? altText.trim() : title.trim(),
      isFeatured: Boolean(isFeatured),
      order: Number(order) || 0
    });

    res.status(201).json({
      success: true,
      message: 'नयाँ तस्वीर ग्यालरीमा सफलतापूर्वक थपियो।',
      data: newItem
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update gallery image record
 * @route   PUT /api/gallery/:id
 * @access  Private (Admin)
 */
export const updateGalleryItem = async (req, res, next) => {
  try {
    const existing = await Gallery.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'तस्वीर फेला परेन।' });
    }

    const {
      title,
      titleEnglish,
      description,
      category,
      imageUrl,
      blobPathname,
      altText,
      isFeatured,
      order
    } = req.body;

    // If image URL changed and old was on Vercel Blob, clean up old blob
    if (
      imageUrl &&
      existing.imageUrl &&
      existing.imageUrl !== imageUrl &&
      existing.imageUrl.includes('blob.vercel-storage.com') &&
      process.env.BLOB_READ_WRITE_TOKEN
    ) {
      try {
        await del(existing.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (blobErr) {
        console.warn('Old blob cleanup note:', blobErr.message);
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (titleEnglish !== undefined) updateData.titleEnglish = titleEnglish.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) {
      updateData.category = category;
      updateData.categoryNepali = CATEGORY_MAP[category] || 'मन्दिर';
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (blobPathname !== undefined) updateData.blobPathname = blobPathname;
    if (altText !== undefined) updateData.altText = altText.trim();
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (order !== undefined) updateData.order = Number(order);

    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'तस्वीर विवरण सफलतापूर्वक अद्यावधिक गरियो।',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete gallery image (removes DB record and cleans up Vercel Blob storage)
 * @route   DELETE /api/gallery/:id
 * @access  Private (Admin)
 */
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'तस्वीर फेला परेन।' });
    }

    // Clean up Vercel Blob if stored in Blob
    if (
      deleted.imageUrl &&
      deleted.imageUrl.includes('blob.vercel-storage.com') &&
      process.env.BLOB_READ_WRITE_TOKEN
    ) {
      try {
        await del(deleted.imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (blobErr) {
        console.warn('Vercel Blob deletion note:', blobErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'तस्वीर ग्यालरीबाट सफलतापूर्वक हटाइयो।'
    });
  } catch (err) {
    next(err);
  }
};
