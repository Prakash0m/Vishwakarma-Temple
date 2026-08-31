import { ToleMeeting } from '../models/ToleMeeting.js';
import { MeetingAttendance } from '../models/MeetingAttendance.js';
import { House } from '../models/House.js';
import { Fine } from '../models/Fine.js';

// Auto-generate next Meeting ID
const generateMeetingId = async () => {
  const last = await ToleMeeting.findOne().sort({ createdAt: -1 });
  if (!last || !last.meetingId) {
    return 'MTG-2026-0001';
  }
  const match = last.meetingId.match(/MTG-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `MTG-2026-${String(nextNum).padStart(4, '0')}`;
  }
  return `MTG-2026-${Date.now().toString().slice(-4)}`;
};

// @desc    Get all tole meetings
// @route   GET /api/tole/meetings
// @access  Public / Admin
export const getMeetings = async (req, res, next) => {
  try {
    const { status, meetingType, search, year, month } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (meetingType && meetingType !== 'all') {
      query.meetingType = meetingType;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { meetingId: searchRegex },
        { title: searchRegex },
        { titleEnglish: searchRegex },
        { location: searchRegex },
        { agenda: searchRegex }
      ];
    }

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    }

    const meetings = await ToleMeeting.find(query).sort({ date: -1 });

    const totalHousesCount = await House.countDocuments({ status: { $in: ['Active', 'सक्रिय'] } });
    const upcomingMeetings = await ToleMeeting.find({ date: { $gte: new Date() }, status: 'Scheduled' }).sort({ date: 1 }).limit(3);

    res.status(200).json({
      success: true,
      count: meetings.length,
      summary: {
        totalMeetings: meetings.length,
        scheduledMeetings: meetings.filter(m => m.status === 'Scheduled').length,
        completedMeetings: meetings.filter(m => m.status === 'Completed').length,
        activeHousesInTole: totalHousesCount
      },
      upcomingMeetings,
      data: meetings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meeting by ID with attendance details & photo gallery
// @route   GET /api/tole/meetings/:id
// @access  Public / Admin
export const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await ToleMeeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'बैठक विवरण फेला परेन (Meeting not found)' });
    }

    const attendanceRecords = await MeetingAttendance.find({ meeting: meeting._id })
      .populate('house', 'houseId houseNumber representativeName representativePhone familyType totalMembers')
      .sort({ houseNumber: 1 });

    res.status(200).json({
      success: true,
      data: {
        meeting,
        attendance: attendanceRecords
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tole meeting
// @route   POST /api/tole/meetings
// @access  Private/Admin
export const createMeeting = async (req, res, next) => {
  try {
    const { title, titleEnglish, date, time, timeEnglish, location, meetingType, agenda, description, notes, images, documents } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'बैठकको शीर्षक र मिति अनिवार्य छ' });
    }

    const meetingId = await generateMeetingId();
    const totalHouses = await House.countDocuments({ status: { $in: ['Active', 'सक्रिय'] } });

    const meeting = await ToleMeeting.create({
      meetingId,
      title,
      titleEnglish,
      date: new Date(date),
      time: time || 'बिहान ८:०० बजे',
      timeEnglish: timeEnglish || '8:00 AM',
      location: location || 'श्री विश्वकर्मा मन्दिर सामुदायिक भवन, छापकी',
      meetingType: meetingType || 'Regular Meeting',
      agenda,
      description,
      notes,
      images: images || [],
      documents: documents || [],
      totalHouses,
      status: 'Scheduled',
      createdBy: req.user?.name || 'Admin'
    });

    res.status(201).json({
      success: true,
      message: 'नयाँ बैठक तय गरियो (Meeting scheduled successfully)',
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tole meeting
// @route   PUT /api/tole/meetings/:id
// @access  Private/Admin
export const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await ToleMeeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'बैठक फेला परेन' });
    }

    res.status(200).json({
      success: true,
      message: 'बैठक विवरण अद्यावधिक भयो',
      data: meeting
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tole meeting
// @route   DELETE /api/tole/meetings/:id
// @access  Private/Admin
export const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await ToleMeeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'बैठक फेला परेन' });
    }

    // Delete associated attendance records
    await MeetingAttendance.deleteMany({ meeting: meeting._id });
    await ToleMeeting.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'बैठक र उपस्थिति विवरण सफलतापूर्वक मेटाइयो'
    });
  } catch (error) {
    next(error);
  }
};
