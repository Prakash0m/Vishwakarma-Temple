import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckSquare,
  FileText,
  X,
  Eye,
  Camera
} from 'lucide-react';

const MeetingsView = () => {
  const { t } = useLanguage();
  const [meetings, setMeetings] = useState([]);
  const [summary, setSummary] = useState({
    totalMeetings: 0,
    scheduledMeetings: 0,
    completedMeetings: 0,
    activeHousesInTole: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Attendance Roster State
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [imposeFine, setImposeFine] = useState(true);
  const [fineAmount, setFineAmount] = useState(100);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    date: new Date().toISOString().split('T')[0],
    time: 'बिहान ८:०० बजे',
    timeEnglish: '8:00 AM',
    location: 'श्री विश्वकर्मा मन्दिर सामुदायिक भवन, छापकी',
    meetingType: 'Regular Meeting',
    agenda: '',
    description: '',
    images: []
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, [statusFilter]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/meetings', {
        params: { status: statusFilter }
      });
      if (res.data.success) {
        setMeetings(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAttendanceModal = async (meeting) => {
    try {
      setSelectedMeeting(meeting);
      setRosterLoading(true);
      setShowAttendanceModal(true);
      const res = await api.get(`/tole/attendance/roster/${meeting._id}`);
      if (res.data.success) {
        setRoster(res.data.roster);
      }
    } catch (err) {
      console.error('Error fetching roster:', err);
      alert('उपस्थिति विवरण लोड गर्न सकिएन');
    } finally {
      setRosterLoading(false);
    }
  };

  const handleStatusChange = (index, newStatus) => {
    const updated = [...roster];
    updated[index].status = newStatus;
    setRoster(updated);
  };

  const handleAttendeeNameChange = (index, name) => {
    const updated = [...roster];
    updated[index].attendeeName = name;
    setRoster(updated);
  };

  const handleRemarksChange = (index, remarks) => {
    const updated = [...roster];
    updated[index].remarks = remarks;
    setRoster(updated);
  };

  const markAllStatus = (targetStatus) => {
    const updated = roster.map(item => ({ ...item, status: targetStatus }));
    setRoster(updated);
  };

  const handleSaveAttendance = async () => {
    try {
      setSavingAttendance(true);
      const payload = {
        meetingId: selectedMeeting._id,
        records: roster,
        imposeAbsenceFine: imposeFine,
        fineAmount: Number(fineAmount)
      };

      const res = await api.post('/tole/attendance/batch', payload);
      if (res.data.success) {
        alert('उपस्थिति सफलतापूर्वक सुरक्षित गरियो!');
        setShowAttendanceModal(false);
        fetchMeetings();
      }
    } catch (err) {
      alert('उपस्थिति सुरक्षित गर्दा त्रुटि भयो: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMeeting(null);
    setFormData({
      title: '',
      titleEnglish: '',
      date: new Date().toISOString().split('T')[0],
      time: 'बिहान ८:०० बजे',
      timeEnglish: '8:00 AM',
      location: 'श्री विश्वकर्मा मन्दिर सामुदायिक भवन, छापकी',
      meetingType: 'Regular Meeting',
      agenda: '',
      description: '',
      images: []
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMeeting(m);
    setFormData({
      title: m.title,
      titleEnglish: m.titleEnglish || '',
      date: new Date(m.date).toISOString().split('T')[0],
      time: m.time || 'बिहान ८:०० बजे',
      timeEnglish: m.timeEnglish || '8:00 AM',
      location: m.location,
      meetingType: m.meetingType,
      agenda: m.agenda || '',
      description: m.description || '',
      images: m.images || []
    });
    setShowAddModal(true);
  };

  const handleSubmitMeeting = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingMeeting) {
        await api.put(`/tole/meetings/${editingMeeting._id}`, formData);
      } else {
        await api.post('/tole/meetings', formData);
      }
      setShowAddModal(false);
      fetchMeetings();
    } catch (err) {
      alert('त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeeting = async (id, title) => {
    if (window.confirm(`के तपाईं "${title}" बैठक मेटाउन निश्चित हुनुहुन्छ?`)) {
      try {
        await api.delete(`/tole/meetings/${id}`);
        fetchMeetings();
      } catch (err) {
        alert('मेटाउन सकिएन: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            टोल बैठक तथा घरधुरी उपस्थिति व्यवस्थापन
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            छापकी टोल • नियमित/विशेष बैठकहरू, घर-वार उपस्थिति दर्ता र अनुपस्थिति जरिवाना प्रणाली
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(122, 18, 29, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>नयाँ बैठक तय गर्नुहोस्</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल बैठकहरू (Total Meetings)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
            {summary.totalMeetings}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>सम्पन्न बैठकहरू (Completed)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2E7D32', marginTop: '0.25rem' }}>
            {summary.completedMeetings}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>आगामी तय बैठक (Scheduled)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#D9531E', marginTop: '0.25rem' }}>
            {summary.scheduledMeetings}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>टोलमा सक्रिय घरधुरी</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3A2E39', marginTop: '0.25rem' }}>
            {summary.activeHousesInTole} घर
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>स्थिति अनुसार फिल्टर:</span>
        {['all', 'Scheduled', 'Completed', 'Cancelled'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              border: statusFilter === st ? '1px solid var(--color-primary)' : '1px solid #D0C9BE',
              backgroundColor: statusFilter === st ? 'var(--color-primary-subtle)' : '#FFFFFF',
              color: statusFilter === st ? 'var(--color-primary-dark)' : '#555',
              fontWeight: statusFilter === st ? '700' : '500',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {st === 'all' ? 'सबै बैठक' : st === 'Scheduled' ? 'तय गरिएको (Scheduled)' : st === 'Completed' ? 'सम्पन्न (Completed)' : 'रद्द (Cancelled)'}
          </button>
        ))}
      </div>

      {/* Meetings List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', backgroundColor: '#FFF', borderRadius: '12px' }}>
            बैठक विवरण लोड हुँदैछ...
          </div>
        ) : meetings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', backgroundColor: '#FFF', borderRadius: '12px' }}>
            कुनै बैठक फेला परेन।
          </div>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E8E2D9',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    {meeting.meetingId}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#F0ECE4', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#555' }}>
                    {meeting.meetingType}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      backgroundColor: meeting.status === 'Completed' ? '#E8F5E9' : meeting.status === 'Scheduled' ? '#FFF8E1' : '#FFEBEE',
                      color: meeting.status === 'Completed' ? '#2E7D32' : meeting.status === 'Scheduled' ? '#F57F17' : '#C62828'
                    }}
                  >
                    {meeting.status === 'Completed' ? 'सम्पन्न' : meeting.status === 'Scheduled' ? 'आगामी बैठक' : 'रद्द'}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#111', margin: '0 0 0.4rem 0' }}>
                  {meeting.title}
                </h3>

                <div style={{ display: 'flex', gap: '1.25rem', color: '#666', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={15} color="var(--color-primary)" />
                    <span>{new Date(meeting.date).toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' })} ({new Date(meeting.date).toLocaleDateString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={15} color="var(--color-primary)" />
                    <span>{meeting.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} color="var(--color-primary)" />
                    <span>{meeting.location}</span>
                  </div>
                </div>

                {meeting.agenda && (
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#444', backgroundColor: '#FAF7F2', padding: '0.5rem 0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--color-gold)' }}>
                    <strong>कार्यसूची (Agenda):</strong> {meeting.agenda}
                  </p>
                )}
              </div>

              {/* Attendance Stats Badge & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                {meeting.status === 'Completed' ? (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2E7D32' }}>
                      {meeting.attendancePercentage}% उपस्थिति
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      उपस्थित: {meeting.presentCount || 0} / अनुपस्थित: {meeting.absentCount || 0}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#F57F17', fontWeight: '600' }}>
                    उपस्थिति लिन बाँकी
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openAttendanceModal(meeting)}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckSquare size={16} />
                    <span>घरधुरी उपस्थिति लिनुहोस्</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(meeting)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D0C9BE',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      color: '#555',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteMeeting(meeting._id, meeting.title)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FFCDD2',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      color: '#C62828',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* House-Wise Batch Attendance Roster Modal */}
      {showAttendanceModal && selectedMeeting && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '950px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button
              onClick={() => setShowAttendanceModal(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={24} />
            </button>

            <div style={{ borderBottom: '1px solid #E8E2D9', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                {selectedMeeting.meetingId}
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', margin: '0.3rem 0 0.15rem 0' }}>
                घरधुरी उपस्थिति दर्ता (House-Wise Attendance Roster)
              </h2>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                {selectedMeeting.title} • मिति: {new Date(selectedMeeting.date).toLocaleDateString()}
              </p>
            </div>

            {/* Quick Actions & Fine Automation Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF7F2', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-gold)', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => markAllStatus('Present')}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #C8E6C9', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  ✓ सबै उपस्थित (Mark All Present)
                </button>
                <button
                  type="button"
                  onClick={() => markAllStatus('Absent')}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #FFCDD2', backgroundColor: '#FFEBEE', color: '#C62828', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  ✕ सबै अनुपस्थित (Mark All Absent)
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', color: '#333' }}>
                  <input
                    type="checkbox"
                    checked={imposeFine}
                    onChange={(e) => setImposeFine(e.target.checked)}
                  />
                  <span>अनुपस्थित घरलाई जरिवाना लगाउने</span>
                </label>
                {imposeFine && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                    <span>रकम: रु.</span>
                    <input
                      type="number"
                      value={fineAmount}
                      onChange={(e) => setFineAmount(e.target.value)}
                      style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Roster Table */}
            {rosterLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                घरधुरी सूची लोड हुँदैछ...
              </div>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                      <th style={{ padding: '0.75rem 0.85rem', textAlign: 'left' }}>घर नं.</th>
                      <th style={{ padding: '0.75rem 0.85rem', textAlign: 'left' }}>मुख्य अभिभावक</th>
                      <th style={{ padding: '0.75rem 0.85rem', textAlign: 'left' }}>बैठकमा उपस्थित व्यक्ति</th>
                      <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>उपस्थिति स्थिति</th>
                      <th style={{ padding: '0.75rem 0.85rem', textAlign: 'left' }}>कैफियत (Remarks)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F0ECE4' }}>
                        <td style={{ padding: '0.75rem 0.85rem', fontWeight: '700' }}>
                          {row.houseNumber} ({row.houseId})
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <div style={{ fontWeight: '600' }}>{row.representativeName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#777' }}>{row.familyType}</div>
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <input
                            type="text"
                            value={row.attendeeName || row.representativeName}
                            onChange={(e) => handleAttendeeNameChange(idx, e.target.value)}
                            style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid #D0C9BE' }}>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(idx, 'Present')}
                              style={{
                                padding: '0.35rem 0.75rem',
                                border: 'none',
                                backgroundColor: row.status === 'Present' || row.status === 'उपस्थित' ? '#2E7D32' : '#FFF',
                                color: row.status === 'Present' || row.status === 'उपस्थित' ? '#FFF' : '#333',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              ✓ उपस्थित
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(idx, 'Absent')}
                              style={{
                                padding: '0.35rem 0.75rem',
                                border: 'none',
                                borderLeft: '1px solid #D0C9BE',
                                borderRight: '1px solid #D0C9BE',
                                backgroundColor: row.status === 'Absent' || row.status === 'अनुपस्थित' ? '#C62828' : '#FFF',
                                color: row.status === 'Absent' || row.status === 'अनुपस्थित' ? '#FFF' : '#333',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              ✕ अनुपस्थित
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(idx, 'Excused')}
                              style={{
                                padding: '0.35rem 0.75rem',
                                border: 'none',
                                backgroundColor: row.status === 'Excused' || row.status === 'बिदा / जानकारी' ? '#F57F17' : '#FFF',
                                color: row.status === 'Excused' || row.status === 'बिदा / जानकारी' ? '#FFF' : '#333',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                              }}
                            >
                              बिदा
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <input
                            type="text"
                            placeholder="कैफियत..."
                            value={row.remarks || ''}
                            onChange={(e) => handleRemarksChange(idx, e.target.value)}
                            style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #E8E2D9', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowAttendanceModal(false)}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
              >
                बन्द गर्नुहोस्
              </button>
              <button
                type="button"
                disabled={savingAttendance}
                onClick={handleSaveAttendance}
                style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}
              >
                {savingAttendance ? 'सुरक्षित हुँदैछ...' : 'उपस्थिति सुरक्षित गर्नुहोस्'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Meeting Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>
              {editingMeeting ? 'बैठक सम्पादन गर्नुहोस्' : 'नयाँ बैठक तय गर्नुहोस्'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              छापकी टोल विकास समिति बैठक कार्यतालिका
            </p>

            <form onSubmit={handleSubmitMeeting}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>बैठक शीर्षक (Meeting Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: मासिक टोल सरसफाइ तथा विकास बैठक"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>बैठक मिति (Date) *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>बैठक समय (Time)</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>बैठक प्रकार (Meeting Type)</label>
                  <select
                    value={formData.meetingType}
                    onChange={(e) => setFormData(prev => ({ ...prev, meetingType: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    <option value="Regular Meeting">नियमित बैठक (Regular)</option>
                    <option value="Emergency Meeting">आपतकालीन बैठक (Emergency)</option>
                    <option value="General Meeting">साधारण सभा (General)</option>
                    <option value="Committee Meeting">कार्यसमिति बैठक (Committee)</option>
                    <option value="Special Meeting">विशेष बैठक (Special)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>स्थान (Location)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>कार्यसूची (Agenda)</label>
                <textarea
                  rows="2"
                  placeholder="छलफलका मुख्य बुँदाहरू..."
                  value={formData.agenda}
                  onChange={(e) => setFormData(prev => ({ ...prev, agenda: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}
                >
                  {saving ? 'सुरक्षित हुँदैछ...' : 'बैठक तय गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsView;
