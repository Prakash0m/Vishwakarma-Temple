import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  MapPin,
  Video,
  Sparkles
} from 'lucide-react';

const EventsView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    description: '',
    descriptionEnglish: '',
    date: new Date().toISOString().split('T')[0],
    time: 'बिहान ९:०० बजे',
    timeEnglish: '9:00 AM onwards',
    location: 'विश्वकर्मा मन्दिर परिसर, छापकी, सप्तरी',
    locationEnglish: 'Vishwakarma Temple Premises, Chhapki, Saptari',
    bannerImage: '/assets/images/temple-structure.jpg',
    meetingUrl: '',
    category: 'उत्सव',
    categoryEnglish: 'Festival',
    isFeatured: false,
    isPublished: true
  });

  const categories = ['उत्सव', 'विशेष पूजा', 'सामूहिक भजन', 'हवन तथा यज्ञ', 'समुदाय कार्यक्रम', 'बैठक'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?isPublished=all');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      addToast('कार्यक्रम विवरण लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      titleEnglish: '',
      description: '',
      descriptionEnglish: '',
      date: new Date().toISOString().split('T')[0],
      time: 'बिहान ९:०० बजे',
      timeEnglish: '9:00 AM onwards',
      location: 'विश्वकर्मा मन्दिर परिसर, छापकी, सप्तरी',
      locationEnglish: 'Vishwakarma Temple Premises, Chhapki, Saptari',
      bannerImage: '/assets/images/temple-structure.jpg',
      meetingUrl: '',
      category: 'उत्सव',
      categoryEnglish: 'Festival',
      isFeatured: false,
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      titleEnglish: event.titleEnglish || '',
      description: event.description,
      descriptionEnglish: event.descriptionEnglish || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time || 'बिहान ९:०० बजे',
      timeEnglish: event.timeEnglish || '9:00 AM',
      location: event.location || 'विश्वकर्मा मन्दिर परिसर, छापकी, सप्तरी',
      locationEnglish: event.locationEnglish || '',
      bannerImage: event.bannerImage || '/assets/images/temple-structure.jpg',
      meetingUrl: event.meetingUrl || '',
      category: event.category || 'उत्सव',
      categoryEnglish: event.categoryEnglish || '',
      isFeatured: event.isFeatured || false,
      isPublished: event.isPublished !== undefined ? event.isPublished : true
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.description) {
      addToast('कृपया कार्यक्रम शीर्षक, मिति र विवरण प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    try {
      if (editingEvent) {
        const res = await api.put(`/events/${editingEvent._id}`, formData);
        if (res.data.success) {
          addToast('कार्यक्रम सफलतापूर्वक अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchEvents();
        }
      } else {
        const res = await api.post('/events', formData);
        if (res.data.success) {
          addToast('नयाँ कार्यक्रम सफलतापूर्वक सिर्जना भयो।', 'success');
          setIsModalOpen(false);
          fetchEvents();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'कार्यक्रम सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('के तपाईं यो कार्यक्रम मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/events/${id}`);
        if (res.data.success) {
          addToast('कार्यक्रम हटाइयो।', 'success');
          fetchEvents();
        }
      } catch (err) {
        addToast('कार्यक्रम हटाउन सकिएन।', 'error');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            कार्यक्रम तथा पर्व व्यवस्थापन (Events & Festivals)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>नयाँ कार्यक्रम थप्नुहोस् (Add Event)</span>
        </button>
      </div>

      {/* Events Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>कार्यक्रमहरू लोड हुँदैछन्...</div>
        ) : events.length > 0 ? (
          events.map((ev) => (
            <div
              key={ev._id}
              className="temple-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img
                  src={ev.bannerImage || '/assets/images/temple-structure.jpg'}
                  alt={ev.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {new Date(ev.date).toLocaleDateString()}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-primary-dark)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {ev.category}
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  {ev.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flex: 1 }}>
                  {ev.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-brown)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>⏱ समय: {ev.time}</div>
                  <div>📍 स्थान: {ev.location}</div>
                  {ev.meetingUrl && <div>📹 भर्चुअल लिङ्क: <a href={ev.meetingUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>उपलब्ध छ</a></div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <span className={`badge ${ev.isPublished ? 'badge-green' : 'badge-maroon'}`}>
                    {ev.isPublished ? 'प्रकाशित (Published)' : 'अप्रकाशित (Draft)'}
                  </span>

                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button onClick={() => handleOpenEditModal(ev)} className="btn btn-sm btn-outline">
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev._id)}
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        border: '1px solid #F87171',
                        borderRadius: '6px',
                        padding: '5px 8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            कुनै कार्यक्रम फेला परेन।
          </div>
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingEvent ? 'कार्यक्रम सम्पादन (Edit Event)' : 'नयाँ कार्यक्रम सिर्जना (Add Event)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">कार्यक्रमको नाम (Nepali Title) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-control"
                    placeholder="उदा. श्री विश्वकर्मा जयन्ती महामहोत्सव"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Title (English)</label>
                  <input
                    type="text"
                    value={formData.titleEnglish}
                    onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Shri Vishwakarma Jayanti Grand Mahotsav"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">मिति (Date) *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">समय (Time)</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="form-control"
                      placeholder="बिहान ९:०० बजे"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">वर्ग (Category)</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-control"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">स्थान (Location)</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="form-control"
                      placeholder="विश्वकर्मा मन्दिर परिसर, छापकी, सप्तरी"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">भर्चुअल बैठक लिङ्क / Meeting URL (वैकल्पिक)</label>
                  <input
                    type="url"
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    className="form-control"
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ब्यानर तस्बिर (Banner Image Asset)</label>
                  <select
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="form-control"
                  >
                    <option value="/assets/images/temple-structure.jpg">मन्दिर भवन तथा प्राङ्गण (Temple Campus)</option>
                    <option value="/assets/images/deity-altar-lamps.jpg">पञ्चदीप मण्डप (Altar Lamps)</option>
                    <option value="/assets/images/deity-sanctum.jpg">गर्भगृह पुष्प सज्जा (Sanctum Drapes)</option>
                    <option value="/assets/images/deity-portrait.jpg">भगवान विश्वकर्मा विग्रह (Lord Vishwakarma)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">विस्तृत विवरण (Description) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    placeholder="कार्यक्रमको विस्तृत कार्यतालिका र सन्देश..."
                    rows={3}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <span>वेबसाइटमा प्रकाशित गर्ने (Published)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span>विशेष कार्यक्रम (Featured)</span>
                  </label>
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingEvent ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'कार्यक्रम सिर्जना गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsView;
