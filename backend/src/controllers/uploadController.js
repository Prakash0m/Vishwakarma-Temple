import { put } from '@vercel/blob';
import path from 'path';

/**
 * @desc    Upload single image to Vercel Blob (or fallback to optimized data URI)
 * @route   POST /api/upload
 * @access  Private (Admin)
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'कृपया अपलोड गर्न तस्वीर छान्नुहोस् (Please select an image file)' });
    }

    const category = (req.body.category || 'general').toLowerCase().replace(/[^a-z0-9]/g, '');
    const ext = (path.extname(req.file.originalname) || '.webp').toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const pathname = `gallery/${category}/${uniqueSuffix}${ext}`;
    const contentType = req.file.mimetype || 'image/jpeg';

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (token) {
      // 1. Upload directly to Vercel Blob Object Storage
      const blob = await put(pathname, req.file.buffer, {
        access: 'public',
        contentType: contentType,
        token: token,
        addRandomSuffix: false
      });

      return res.status(200).json({
        success: true,
        message: 'तस्वीर Vercel Blob मा सफलतापूर्वक सुरक्षित भयो।',
        url: blob.url,
        blobPathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
        filename: req.file.originalname,
        size: req.file.size
      });
    } else {
      // 2. Fallback: Base64 Data URI (Self-contained in MongoDB, requires no cloud credentials)
      const base64Data = `data:${contentType};base64,${req.file.buffer.toString('base64')}`;

      return res.status(200).json({
        success: true,
        message: 'तस्वीर सफलतापूर्वक प्रोसेस भयो।',
        url: base64Data,
        blobPathname: pathname,
        filename: req.file.originalname,
        size: req.file.size
      });
    }
  } catch (error) {
    console.error('❌ Upload Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'तस्वीर अपलोड गर्न सकिएन: ' + error.message,
      error: error.message
    });
  }
};

/**
 * @desc    Upload multiple images to Vercel Blob
 * @route   POST /api/upload/multiple
 * @access  Private (Admin)
 */
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'कृपया कम्तीमा एउटा तस्वीर छान्नुहोस्' });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const uploadedResults = [];

    for (const file of req.files) {
      const category = (req.body.category || 'general').toLowerCase().replace(/[^a-z0-9]/g, '');
      const ext = (path.extname(file.originalname) || '.webp').toLowerCase();
      const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const pathname = `gallery/${category}/${uniqueSuffix}${ext}`;
      const contentType = file.mimetype || 'image/jpeg';

      if (token) {
        const blob = await put(pathname, file.buffer, {
          access: 'public',
          contentType: contentType,
          token: token,
          addRandomSuffix: false
        });
        uploadedResults.push({
          url: blob.url,
          blobPathname: blob.pathname,
          filename: file.originalname,
          size: file.size
        });
      } else {
        const base64Data = `data:${contentType};base64,${file.buffer.toString('base64')}`;
        uploadedResults.push({
          url: base64Data,
          blobPathname: pathname,
          filename: file.originalname,
          size: file.size
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${uploadedResults.length} तस्वीरहरू सफलतापूर्वक अपलोड भए`,
      files: uploadedResults
    });
  } catch (error) {
    console.error('❌ Multiple Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: 'तस्वीरहरू अपलोड गर्न सकिएन: ' + error.message
    });
  }
};
