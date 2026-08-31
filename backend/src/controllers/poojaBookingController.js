import PoojaBooking from '../models/PoojaBooking.js';
import Pooja from '../models/Pooja.js';

// @desc    Get all pooja bookings (search, filter by status, pagination)
// @route   GET /api/pooja-bookings
// @access  Private
export const getPoojaBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { devoteeName: { $regex: search, $options: 'i' } },
        { devoteePhone: { $regex: search, $options: 'i' } },
        { bookingNumber: { $regex: search, $options: 'i' } },
        { poojaName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await PoojaBooking.countDocuments(query);
    const bookings = await PoojaBooking.find(query)
      .populate('pooja')
      .sort({ requestedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit online pooja request from public website
// @route   POST /api/pooja-bookings
// @access  Public
export const createPoojaBooking = async (req, res, next) => {
  try {
    const { devoteeName, devoteePhone, devoteeEmail, poojaId, requestedDate, requestedTime, gotra, sankalpaNotes } = req.body;

    if (!devoteeName || !devoteePhone || !poojaId || !requestedDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide devotee name, phone, pooja selection, and requested date'
      });
    }

    const pooja = await Pooja.findById(poojaId);
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Selected Pooja service not found' });
    }

    const count = await PoojaBooking.countDocuments();
    const currentYear = new Date().getFullYear();
    const bookingNumber = `BKG-${currentYear}-${String(count + 1).padStart(4, '0')}`;

    const newBooking = await PoojaBooking.create({
      bookingNumber,
      devoteeName,
      devoteePhone,
      devoteeEmail: devoteeEmail || '',
      pooja: pooja._id,
      poojaName: pooja.title,
      requestedDate,
      requestedTime: requestedTime || 'बिहान ८:०० बजे',
      gotra: gotra || '',
      sankalpaNotes: sankalpaNotes || '',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'पूजा अनुरोध सफलतापूर्वक पठाइयो। मन्दिर समितिले छिट्टै सम्पर्क गर्नेछ। (Pooja booking request submitted successfully!)',
      data: newBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pooja booking status & admin notes
// @route   PUT /api/pooja-bookings/:id
// @access  Private
export const updatePoojaBooking = async (req, res, next) => {
  try {
    const updated = await PoojaBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('pooja');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pooja booking
// @route   DELETE /api/pooja-bookings/:id
// @access  Private
export const deletePoojaBooking = async (req, res, next) => {
  try {
    const deleted = await PoojaBooking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};
