import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, Sparkles } from 'lucide-react';

const PoojaBookingModal = ({ isOpen, onClose, selectedPooja, poojas }) => {
  const { language, t, getLocalized } = useLanguage();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    devoteeName: '',
    devoteePhone: '',
    devoteeEmail: '',
    poojaId: selectedPooja ? selectedPooja._id : (poojas && poojas[0]?._id) || '',
    requestedDate: '',
    requestedTime: 'बिहान ८:०० बजे',
    gotra: '',
    sankalpaNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Sync selectedPooja when opened
  React.useEffect(() => {
    if (selectedPooja) {
      setFormData((prev) => ({ ...prev, poojaId: selectedPooja._id }));
    }
  }, [selectedPooja]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.devoteeName || !formData.devoteePhone || !formData.poojaId || !formData.requestedDate) {
      addToast('कृपया सबै आवश्यक विवरणहरू भर्नुहोस्। (Please fill in required fields)', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/pooja-bookings', formData);
      if (res.data.success) {
        setSubmitted(true);
        setBookingResult(res.data.data);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        addToast(t('pooja.successMessage'), 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'पूजा अनुरोध पठाउन सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentPooja = poojas?.find(p => p._id === formData.poojaId) || selectedPooja;
  const poojaTitle = currentPooja ? getLocalized(currentPooja, 'title', 'titleEnglish') : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🪔</span>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--color-primary)'
            }}>
              {t('pooja.requestTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-green-subtle)',
                color: 'var(--color-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                color: 'var(--color-primary-dark)',
                marginBottom: '0.5rem'
              }}>
                पूजा अनुरोध स्वीकृत भयो 🙏
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                {t('pooja.successMessage')}
              </p>

              {bookingResult && (
                <div style={{
                  backgroundColor: 'var(--bg-cream-alt)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid var(--border-gold)',
                  textAlign: 'left',
                  fontSize: '0.88rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>अनुरोध नम्बर:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{bookingResult.bookingNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>पूजा:</span>
                    <strong>{bookingResult.poojaName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>श्रद्धालु:</span>
                    <strong>{bookingResult.devoteeName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>मिति:</span>
                    <strong>{new Date(bookingResult.requestedDate).toLocaleDateString()}</strong>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                बन्द गर्नुहोस् (Close)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Pooja Selection Dropdown */}
              <div className="form-group">
                <label className="form-label">{t('pooja.selectPooja')} *</label>
                <select
                  name="poojaId"
                  value={formData.poojaId}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  {poojas?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {getLocalized(p, 'title', 'titleEnglish')} (रु. {p.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Devotee Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('pooja.nameLabel')} *</label>
                  <input
                    type="text"
                    name="devoteeName"
                    value={formData.devoteeName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="उदा. राम प्रसाद शर्मा"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('pooja.phoneLabel')} *</label>
                  <input
                    type="tel"
                    name="devoteePhone"
                    value={formData.devoteePhone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="९८५२०१२३४५"
                    required
                  />
                </div>
              </div>

              {/* Email & Desired Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('pooja.emailLabel')}</label>
                  <input
                    type="email"
                    name="devoteeEmail"
                    value={formData.devoteeEmail}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="sharma@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('pooja.dateLabel')} *</label>
                  <input
                    type="date"
                    name="requestedDate"
                    value={formData.requestedDate}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Gotra & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('pooja.gotraLabel')}</label>
                  <input
                    type="text"
                    name="gotra"
                    value={formData.gotra}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="उदा. कश्यप, भारद्वाज"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">समय छनौट</label>
                  <select
                    name="requestedTime"
                    value={formData.requestedTime}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="बिहान ६:०० - ८:००">प्रातः समय (६:०० - ८:०० AM)</option>
                    <option value="बिहान ८:०० - १०:००">बिहान (८:०० - १०:०० AM)</option>
                    <option value="दिउँसो १:०० - ३:००">दिउँसो (१:०० - ३:०० PM)</option>
                    <option value="साँझ ५:३० - ७:००">सन्ध्या आरती (५:३० - ७:०० PM)</option>
                  </select>
                </div>
              </div>

              {/* Sankalpa / Special Notes */}
              <div className="form-group">
                <label className="form-label">{t('pooja.notesLabel')}</label>
                <textarea
                  name="sankalpaNotes"
                  value={formData.sankalpaNotes}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="पारिवारिक शान्ति, नयाँ व्यवसाय, गृहप्रवेश वा विशेष संकल्प..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'पठाउँदै...' : t('pooja.submitRequest')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoojaBookingModal;
