import Gallery from '../models/Gallery.js';

// @desc    Get all gallery images (with category filter)
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gallery image record
// @route   POST /api/gallery
// @access  Private
export const createGalleryItem = async (req, res, next) => {
  try {
    const newItem = await Gallery.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Photo added to gallery successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery image record
// @route   PUT /api/gallery/:id
// @access  Private
export const updateGalleryItem = async (req, res, next) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    next(error);
  }
};
