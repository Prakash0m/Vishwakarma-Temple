import Setting from '../models/Setting.js';

// @desc    Get website settings & CMS content
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
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

    res.status(200).json({
      success: true,
      message: 'Website settings and content updated successfully',
      data: settings
    });
  } catch (error) {
    next(error);
  }
};
