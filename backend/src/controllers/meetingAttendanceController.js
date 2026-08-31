import { MeetingAttendance } from '../models/MeetingAttendance.js';
import { ToleMeeting } from '../models/ToleMeeting.js';
import { House } from '../models/House.js';
import { Fine } from '../models/Fine.js';

// Auto-generate next Fine ID
const generateFineId = async () => {
  const last = await Fine.findOne().sort({ createdAt: -1 });
  if (!last || !last.fineId) {
    return 'FINE-2026-0001';
  }
  const match = last.fineId.match(/FINE-\d+-(\d+)/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    return `FINE-2026-${String(nextNum).padStart(4, '0')}`;
  }
  return `FINE-2026-${Date.now().toString().slice(-4)}`;
};

// @desc    Get attendance roster for a meeting (lists all houses with current status)
// @route   GET /api/tole/attendance/roster/:meetingId
// @access  Private/Admin
export const getMeetingRoster = async (req, res, next) => {
  try {
    const meeting = await ToleMeeting.findById(req.params.meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'बैठक फेला परेन' });
    }

    // Get all active houses
    const houses = await House.find({ status: { $in: ['Active', 'सक्रिय'] } }).sort({ houseNumber: 1 });

    // Get existing attendance records for this meeting
    const existingRecords = await MeetingAttendance.find({ meeting: meeting._id });
    const recordMap = new Map();
    existingRecords.forEach(r => recordMap.set(r.house.toString(), r));

    // Merge houses with their attendance status
    const roster = houses.map(house => {
      const existing = recordMap.get(house._id.toString());
      return {
        houseIdDb: house._id,
        houseId: house.houseId,
        houseNumber: house.houseNumber,
        representativeName: house.representativeName,
        representativePhone: house.representativePhone,
        familyType: house.familyType,
        totalMembers: house.totalMembers,
        status: existing ? existing.status : 'Present',
        attendeeName: existing ? existing.attendeeName || house.representativeName : house.representativeName,
        remarks: existing ? existing.remarks || '' : '',
        fineImposed: existing ? existing.fineImposed || false : false,
        fineAmount: existing ? existing.fineAmount || 0 : 0,
        attendanceRecordId: existing ? existing._id : null
      };
    });

    res.status(200).json({
      success: true,
      meeting: {
        _id: meeting._id,
        meetingId: meeting.meetingId,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        status: meeting.status
      },
      totalHouses: houses.length,
      roster
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save / submit batch attendance for a meeting
// @route   POST /api/tole/attendance/batch
// @access  Private/Admin
export const saveBatchAttendance = async (req, res, next) => {
  try {
    const { meetingId, records, imposeAbsenceFine, fineAmount = 100 } = req.body;

    if (!meetingId || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'बैठक ID र उपस्थिति विवरण अनिवार्य छ' });
    }

    const meeting = await ToleMeeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'बैठक फेला परेन' });
    }

    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;

    for (const item of records) {
      const { houseIdDb, houseId, houseNumber, representativeName, attendeeName, status, remarks } = item;

      if (status === 'Present' || status === 'उपस्थित') presentCount++;
      else if (status === 'Absent' || status === 'अनुपस्थित') absentCount++;
      else if (status === 'Excused' || status === 'बिदा / जानकारी') excusedCount++;

      const isAbsent = status === 'Absent' || status === 'अनुपस्थित';
      const shouldFine = Boolean(imposeAbsenceFine && isAbsent);

      const attendanceRecord = await MeetingAttendance.findOneAndUpdate(
        { meeting: meeting._id, house: houseIdDb },
        {
          meeting: meeting._id,
          house: houseIdDb,
          houseId,
          houseNumber,
          representativeName,
          attendeeName: attendeeName || representativeName,
          status,
          date: meeting.date,
          remarks: remarks || '',
          fineImposed: shouldFine,
          fineAmount: shouldFine ? fineAmount : 0,
          markedBy: req.user?.name || 'Admin'
        },
        { upsert: true, new: true }
      );

      // If fine is enabled for absent house and not already billed
      if (shouldFine) {
        const existingFine = await Fine.findOne({ meeting: meeting._id, house: houseIdDb });
        if (!existingFine) {
          const fineId = await generateFineId();
          await Fine.create({
            fineId,
            house: houseIdDb,
            houseId,
            personName: representativeName,
            meeting: meeting._id,
            fineType: 'Meeting Absence',
            amount: fineAmount,
            reason: `बैठक अनुपस्थिति जरिवाना (${meeting.title} - ${new Date(meeting.date).toLocaleDateString()})`,
            date: meeting.date,
            status: 'Pending',
            recordedBy: req.user?.name || 'Admin'
          });
        }
      }
    }

    const totalHouses = records.length;
    const attendancePercentage = totalHouses > 0 ? Number(((presentCount / totalHouses) * 100).toFixed(1)) : 0;

    // Update meeting summary metrics
    meeting.totalHouses = totalHouses;
    meeting.presentCount = presentCount;
    meeting.absentCount = absentCount;
    meeting.excusedCount = excusedCount;
    meeting.attendancePercentage = attendancePercentage;
    meeting.status = 'Completed';
    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'उपस्थिति सफलतापूर्वक सुरक्षित गरियो (Attendance saved successfully)',
      data: {
        totalHouses,
        presentCount,
        absentCount,
        excusedCount,
        attendancePercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global attendance statistics across all meetings
// @route   GET /api/tole/attendance/stats
// @access  Public / Admin
export const getAttendanceStats = async (req, res, next) => {
  try {
    const totalMeetings = await ToleMeeting.countDocuments();
    const completedMeetings = await ToleMeeting.find({ status: 'Completed' }).sort({ date: -1 });

    const totalHouses = await House.countDocuments({ status: { $in: ['Active', 'सक्रिय'] } });

    // Aggregate overall attendance rate
    let totalPresentSum = 0;
    let totalExpectedSum = 0;

    completedMeetings.forEach(m => {
      totalPresentSum += m.presentCount || 0;
      totalExpectedSum += m.totalHouses || 0;
    });

    const averageAttendanceRate = totalExpectedSum > 0 ? Number(((totalPresentSum / totalExpectedSum) * 100).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalMeetings,
        completedMeetingsCount: completedMeetings.length,
        totalHouses,
        averageAttendanceRate,
        recentMeetings: completedMeetings.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};
