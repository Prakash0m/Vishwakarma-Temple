import Pooja from '../models/Pooja.js';

// @desc    Get all poojas
// @route   GET /api/poojas
// @access  Public
export const getPoojas = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const query = includeInactive === 'true' ? {} : { isActive: true };

    const poojas = await Pooja.find(query).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: poojas.length, data: poojas });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pooja by ID
// @route   GET /api/poojas/:id
// @access  Public
export const getPoojaById = async (req, res, next) => {
  try {
    const pooja = await Pooja.findById(req.params.id);
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja service not found' });
    }
    res.status(200).json({ success: true, data: pooja });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pooja service
// @route   POST /api/poojas
// @access  Private
export const createPooja = async (req, res, next) => {
  try {
    const newPooja = await Pooja.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Pooja service created successfully',
      data: newPooja
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pooja service
// @route   PUT /api/poojas/:id
// @access  Private
export const updatePooja = async (req, res, next) => {
  try {
    const updated = await Pooja.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Pooja service not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Pooja service updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pooja service
// @route   DELETE /api/poojas/:id
// @access  Private
export const deletePooja = async (req, res, next) => {
  try {
    const deleted = await Pooja.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Pooja service not found' });
    }
    res.status(200).json({ success: true, message: 'Pooja service deleted successfully' });
  } catch (error) {
    next(error);
  }
};
