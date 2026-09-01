import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

const ContactSection = ({ settings }) => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'सामान्य सोधपुछ',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const phone = settings?.phone || '+977-21-523456';
  const secondaryPhone = settings?.secondaryPhone || '+977 9852012345';
  const email = settings?.email || 'info@vishwakarmatemple.org.np';
  const address = language === 'ne'
    ? (settings?.addressNepali || 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला, मधेश प्रदेश, नेपाल')
    : (settings?.addressEnglish || 'Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District, Madhesh Province, Nepal');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      addToast('कृपया नाम, फोन नम्बर र सन्देश प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        addToast(t('locationContact.successMessage'), 'success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'सामान्य सोधपुछ',
          message: ''
        });
      }
    } catch (err) {
      addToast('सन्देश पठाउन सकिएन। कृपया केही समय पछि पुन: प्रयास गर्नुहोस्।', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <MessageSquare size={16} />
            <span>{t('locationContact.contactEyebrow')}</span>
          </div>
          <h2 className="section-title">{t('locationContact.contactTitle')}</h2>
          <p className="section-subtitle">{t('locationContact.contactSubtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪔</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          alignItems: 'start'
        }}>
          {/* Left: Contact Info Cards */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="temple-card" style={{ padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: 'var(--color-primary-subtle)',
                  padding: '10px',
                  borderRadius: '10px',
                  flexShrink: 0
                }}>
                  <Phone size={20} color="#7A121D" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>सम्पर्क टेलिफोन</div>
                  <a href={`tel:${phone}`} style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-primary-dark)', display: 'block' }}>{phone}</a>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-brown)' }}>{secondaryPhone}</div>
                </div>
              </div>

              <div className="temple-card" style={{ padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: 'var(--color-saffron-subtle)',
                  padding: '10px',
                  borderRadius: '10px',
                  flexShrink: 0
                }}>
                  <Mail size={20} color="#D9531E" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>इमेल ठेगाना</div>
                  <a href={`mailto:${email}`} style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--color-primary-dark)', display: 'block', wordBreak: 'break-all' }}>{email}</a>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-brown)' }}>२४ घण्टा भित्र जवाफ</div>
                </div>
              </div>

              <div className="temple-card" style={{ padding: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{
                  backgroundColor: 'var(--color-green-subtle)',
                  padding: '10px',
                  borderRadius: '10px',
                  flexShrink: 0
                }}>
                  <MapPin size={20} color="#2D6A4F" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>मन्दिर अवस्थिति</div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)', display: 'block' }}>{address}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="temple-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('locationContact.fullName')} *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="उदा. रमेश अधिकारी"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('locationContact.phone')} *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="९८५२०१२३४५"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('locationContact.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="ramesh@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('locationContact.message')} *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="तपाईंको जिज्ञासा, सुझाव वा सन्देश लेख्नुहोस्..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem', minHeight: '46px' }}
                disabled={loading}
              >
                <Send size={16} />
                <span>{loading ? 'पठाउँदै...' : t('locationContact.sendMessage')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
