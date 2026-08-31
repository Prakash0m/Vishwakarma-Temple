// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please select image files to upload' });
  }

  const fileUrls = req.files.map(file => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    size: file.size
  }));

  res.status(200).json({
    success: true,
    message: `${req.files.length} images uploaded successfully`,
    files: fileUrls
  });
};
