import Meeting from '../models/Meeting.js';

// @desc    Get virtual meeting & live darshan configs
// @route   GET /api/meetings
// @access  Public
export const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find();
    
    // Ensure default meeting and live darshan entries exist
    let virtualMeeting = meetings.find(m => m.type === 'VirtualMeeting');
    let liveDarshan = meetings.find(m => m.type === 'LiveDarshan');

    if (!virtualMeeting) {
      virtualMeeting = await Meeting.create({
        type: 'VirtualMeeting',
        title: 'विश्वकर्मा मन्दिर साप्ताहिक भर्चुअल सत्संग तथा बैठक',
        titleEnglish: 'Vishwakarma Temple Weekly Virtual Satsang & Meeting',
        platform: 'Google Meet',
        meetingUrl: 'https://meet.google.com/new',
        date: 'प्रत्येक शनिबार (Every Saturday)',
        time: 'साँझ ६:०० देखि ७:०० बजे सम्म',
        timeEnglish: '6:00 PM to 7:00 PM',
        description: 'विश्वकर्मा मन्दिर छापकी, सप्तरीको नियमित साप्ताहिक समीक्षा तथा आध्यात्मिक सत्संग। सम्पूर्ण भक्तजनहरू आमन्त्रित हुनुहुन्छ।',
        descriptionEnglish: 'Weekly spiritual discourse and temple development updates. All devotees worldwide are warmly invited.',
        isActive: true
      });
    }

    if (!liveDarshan) {
      liveDarshan = await Meeting.create({
        type: 'LiveDarshan',
        title: 'प्रत्यक्ष मन्दिर दर्शन (Live Darshan)',
        titleEnglish: 'Live Temple Darshan & Aarti',
        platform: 'YouTube Live',
        streamUrl: 'https://www.youtube.com',
        time: 'बिहान ७:०० र साँझ ६:३० आरती',
        timeEnglish: '7:00 AM & 6:30 PM Daily Aarti',
        description: 'भगवान विश्वकर्माको दैनिक प्रातः र सन्ध्या आरती प्रत्यक्ष प्रसारण।',
        descriptionEnglish: 'Daily Morning and Evening Mangal Aarti live from Chhapki sanctum.',
        isActive: true,
        isLiveNow: false
      });
    }

    res.status(200).json({
      success: true,
      data: {
        virtualMeeting,
        liveDarshan
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update virtual meeting or live darshan config
// @route   PUT /api/meetings/:id
// @access  Private
export const updateMeeting = async (req, res, next) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Meeting config not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Meeting / Live Darshan updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};
