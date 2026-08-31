import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Video,
  Radio,
  Save,
  Clock,
  Calendar,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

const MeetingLiveView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [savingLive, setSavingLive] = useState(false);

  const [virtualMeeting, setVirtualMeeting] = useState({
    _id: '',
    title: '',
    titleEnglish: '',
    platform: 'Google Meet',
    meetingUrl: '',
    date: 'प्रत्येक शनिबार (Every Saturday)',
    time: 'साँझ ६:०० देखि ७:०० सम्म',
    timeEnglish: '6:00 PM to 7:00 PM',
    description: '',
    descriptionEnglish: '',
    isActive: true
  });

  const [liveDarshan, setLiveDarshan] = useState({
    _id: '',
    title: '',
    titleEnglish: '',
    platform: 'YouTube Live',
    streamUrl: '',
    time: 'बिहान ७:०० र साँझ ६:३० आरती',
    timeEnglish: '7:00 AM & 6:30 PM Daily Aarti',
    description: '',
    descriptionEnglish: '',
    isActive: true,
    isLiveNow: false
  });

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/meetings');
      if (res.data.success) {
        if (res.data.data.virtualMeeting) {
          setVirtualMeeting(res.data.data.virtualMeeting);
        }
        if (res.data.data.liveDarshan) {
          setLiveDarshan(res.data.data.liveDarshan);
        }
      }
    } catch (err) {
      addToast('भर्चुअल बैठक तथा लाइभ सेटिङ लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSaveVirtualMeeting = async (e) => {
    e.preventDefault();
    setSavingMeeting(true);
    try {
      const res = await api.put(`/meetings/${virtualMeeting._id}`, virtualMeeting);
      if (res.data.success) {
        addToast('भर्चुअल बैठक सेटिङ सफलतापूर्वक सुरक्षित गरियो।', 'success');
      }
    } catch (err) {
      addToast('सेटिङ सुरक्षित गर्न सकिएन।', 'error');
    } finally {
      setSavingMeeting(false);
    }
  };

  const handleSaveLiveDarshan = async (e) => {
    e.preventDefault();
    setSavingLive(true);
    try {
      const res = await api.put(`/meetings/${liveDarshan._id}`, liveDarshan);
      if (res.data.success) {
        addToast('लाइभ दर्शन सेटिङ सफलतापूर्वक सुरक्षित गरियो।', 'success');
      }
    } catch (err) {
      addToast('सेटिङ सुरक्षित गर्न सकिएन।', 'error');
    } finally {
      setSavingLive(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>लोड हुँदैछ...</div>;
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
          भर्चुअल बैठक तथा लाइभ दर्शन व्यवस्थापन (Virtual Meetings & Live Darshan)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          होमपेजमा देखिने प्रत्यक्ष प्रसारण लिङ्क तथा जुम / गुगल मिट बैठकको नियन्त्रण
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Card 1: Virtual Meeting Form */}
        <div className="temple-card" style={{ padding: '1.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1.5px solid var(--border-gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Video size={22} color="#D9531E" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                भर्चुअल बैठक (Virtual Meeting)
              </h3>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={virtualMeeting.isActive}
                onChange={(e) => setVirtualMeeting({ ...virtualMeeting, isActive: e.target.checked })}
              />
              <strong>सक्रिय (Active)</strong>
            </label>
          </div>

          <form onSubmit={handleSaveVirtualMeeting}>
            <div className="form-group">
              <label className="form-label">प्लेटफर्म (Platform)</label>
              <select
                value={virtualMeeting.platform}
                onChange={(e) => setVirtualMeeting({ ...virtualMeeting, platform: e.target.value })}
                className="form-control"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Custom Stream">अन्य (Custom Link)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">बैठक लिङ्क / Meeting URL *</label>
              <input
                type="url"
                value={virtualMeeting.meetingUrl}
                onChange={(e) => setVirtualMeeting({ ...virtualMeeting, meetingUrl: e.target.value })}
                className="form-control"
                placeholder="https://meet.google.com/..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">बैठकको शीर्षक (Title) *</label>
              <input
                type="text"
                value={virtualMeeting.title}
                onChange={(e) => setVirtualMeeting({ ...virtualMeeting, title: e.target.value })}
                className="form-control"
                placeholder="उदा. विश्वकर्मा मन्दिर साप्ताहिक सत्संग"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">मिति / बार (Date/Day)</label>
                <input
                  type="text"
                  value={virtualMeeting.date}
                  onChange={(e) => setVirtualMeeting({ ...virtualMeeting, date: e.target.value })}
                  className="form-control"
                  placeholder="प्रत्येक शनिबार"
                />
              </div>

              <div className="form-group">
                <label className="form-label">समय (Time)</label>
                <input
                  type="text"
                  value={virtualMeeting.time}
                  onChange={(e) => setVirtualMeeting({ ...virtualMeeting, time: e.target.value })}
                  className="form-control"
                  placeholder="साँझ ६:०० देखि ७:०० सम्म"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">विवरण तथा एजेन्डा (Description)</label>
              <textarea
                value={virtualMeeting.description}
                onChange={(e) => setVirtualMeeting({ ...virtualMeeting, description: e.target.value })}
                className="form-control"
                placeholder="बैठकको उद्देश्य र छलफलका विषयहरू..."
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-saffron" style={{ width: '100%', gap: '6px' }} disabled={savingMeeting}>
              <Save size={16} />
              <span>{savingMeeting ? 'सुरक्षित गर्दै...' : 'बैठक सेटिङ सुरक्षित गर्नुहोस्'}</span>
            </button>
          </form>
        </div>

        {/* Card 2: Live Darshan Form */}
        <div className="temple-card" style={{ padding: '1.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1.5px solid var(--border-gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Radio size={22} color="#7A121D" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                लाइभ दर्शन (Live Darshan)
              </h3>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={liveDarshan.isActive}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, isActive: e.target.checked })}
              />
              <strong>सक्रिय (Active)</strong>
            </label>
          </div>

          <form onSubmit={handleSaveLiveDarshan}>
            <div style={{
              backgroundColor: liveDarshan.isLiveNow ? '#FEF2F2' : 'var(--bg-cream-alt)',
              border: '1px solid',
              borderColor: liveDarshan.isLiveNow ? '#EF4444' : 'var(--border-gold)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <strong style={{ color: liveDarshan.isLiveNow ? '#B91C1C' : 'var(--color-primary-dark)', fontSize: '0.92rem' }}>
                  {liveDarshan.isLiveNow ? '🔴 अहिले प्रत्यक्ष प्रसारण चालु छ (LIVE NOW)' : '⚪ प्रत्यक्ष प्रसारण बन्द छ (Offline)'}
                </strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  होमपेजमा 'LIVE' ब्याड्ज देखाउन यो अन गर्नुहोस्
                </div>
              </div>

              <input
                type="checkbox"
                checked={liveDarshan.isLiveNow}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, isLiveNow: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">स्ट्रिम प्लेटफर्म (Stream Platform)</label>
              <select
                value={liveDarshan.platform}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, platform: e.target.value })}
                className="form-control"
              >
                <option value="YouTube Live">YouTube Live</option>
                <option value="Facebook Live">Facebook Live</option>
                <option value="Custom Stream">Custom Stream URL</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">लाइभ स्ट्रिम URL / Embed Link *</label>
              <input
                type="url"
                value={liveDarshan.streamUrl}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, streamUrl: e.target.value })}
                className="form-control"
                placeholder="https://youtube.com/live/..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">दर्शन शीर्षक (Title) *</label>
              <input
                type="text"
                value={liveDarshan.title}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, title: e.target.value })}
                className="form-control"
                placeholder="प्रत्यक्ष मन्दिर दर्शन तथा आरती"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">नियमित आरती समय (Aarti Timings)</label>
              <input
                type="text"
                value={liveDarshan.time}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, time: e.target.value })}
                className="form-control"
                placeholder="बिहान ७:०० र साँझ ६:३० आरती"
              />
            </div>

            <div className="form-group">
              <label className="form-label">विवरण (Description)</label>
              <textarea
                value={liveDarshan.description}
                onChange={(e) => setLiveDarshan({ ...liveDarshan, description: e.target.value })}
                className="form-control"
                placeholder="भगवान विश्वकर्माको गर्भगृहबाट प्रत्यक्ष प्रसारण..."
                rows={2}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '6px' }} disabled={savingLive}>
              <Save size={16} />
              <span>{savingLive ? 'सुरक्षित गर्दै...' : 'लाइभ दर्शन सेटिङ सुरक्षित गर्नुहोस्'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingLiveView;
