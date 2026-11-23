import Setting from '../models/Setting.js';

// Fast In-Memory Cache for ultra-fast response
let cachedSettings = null;
let lastSettingsFetch = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds memory cache

// @desc    Get website settings & CMS content
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedSettings && (now - lastSettingsFetch) < CACHE_TTL_MS) {
      res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      return res.status(200).json({ success: true, data: cachedSettings });
    }

    let settings = await Setting.findOne().lean();
    if (!settings) {
      const created = await Setting.create({});
      settings = created.toObject();
    }

    cachedSettings = settings;
    lastSettingsFetch = now;

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings & CMS content
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    // Invalidate and update memory cache
    cachedSettings = settings ? settings.toObject() : null;
    lastSettingsFetch = Date.now();

    res.status(200).json({
      success: true,
      message: 'Website settings and content updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};
