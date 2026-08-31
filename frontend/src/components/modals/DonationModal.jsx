import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import { X, Heart, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

const DonationModal = ({ isOpen, onClose, onDonationSuccess }) => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    donorAddress: '',
    amount: '',
    purpose: 'सामान्य मन्दिर कोष',
    paymentMethod: 'eSewa',
    transactionId: '',
    privacy: 'public',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amount || Number(formData.amount) <= 0) {
      addToast('कृपया दाताको नाम र वैध सहयोग रकम प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/donations', formData);
      if (res.data.success) {
        setSubmitted(true);
        setReceiptData(res.data.data);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        addToast(t('donation.successDonation'), 'success');
        if (onDonationSuccess) {
          onDonationSuccess();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'चन्दा विवरण दर्ता गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} color="#7A121D" />
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              color: 'var(--color-primary)'
            }}>
              {t('donation.submitReceiptBtn')}
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

        {/* Modal Body */}
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
                चन्दा सहयोग सफलतापूर्वक दर्ता भयो 🙏
              </h4>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                {t('donation.successDonation')}
              </p>

              {receiptData && (
                <div style={{
                  backgroundColor: 'var(--bg-cream-alt)',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  border: '1px solid var(--border-gold)',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>रसिद नम्बर:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{receiptData.receiptNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>दाता:</span>
                    <strong>{receiptData.donorName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>सहयोग रकम:</span>
                    <strong style={{ color: 'var(--color-green)' }}>रु. {receiptData.amount?.toLocaleString('ne-NP')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>माध्यम:</span>
                    <span>{receiptData.paymentMethod}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>उद्देश्य:</span>
                    <span>{receiptData.purpose}</span>
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
                सम्पन्न (Done)
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('donation.donorName')} *</label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="उदा. सीता देवी"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('donation.amount')} *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="उदा. ५०००"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('donation.donorPhone')}</label>
                  <input
                    type="tel"
                    name="donorPhone"
                    value={formData.donorPhone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="९८५२०१२३४५"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ठेगाना (Address)</label>
                  <input
                    type="text"
                    name="donorAddress"
                    value={formData.donorAddress}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="छापकी-५, सप्तरी"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('donation.paymentMethod')}</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                    <option value="Fonepay">Fonepay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash (नगद)</option>
                    <option value="Other">अन्य</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('donation.transactionId')}</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="उदा. ESW-889127"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('donation.purpose')}</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="सामान्य मन्दिर कोष">सामान्य मन्दिर कोष</option>
                  <option value="मन्दिर मर्मत तथा रंगरोगन">मन्दिर मर्मत तथा रंगरोगन</option>
                  <option value="अन्नपूर्णा महाप्रसाद कोष">अन्नपूर्णा महाप्रसाद कोष</option>
                  <option value="दैनिक पूजा तथा दीप प्रज्वलन">दैनिक पूजा तथा दीप प्रज्वलन</option>
                  <option value="विश्वकर्मा जयन्ती महामहोत्सव">विश्वकर्मा जयन्ती महामहोत्सव</option>
                  <option value="सामाजिक तथा स्वास्थ्य सेवा">सामाजिक तथा स्वास्थ्य सेवा</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('donation.privacyOption')}</label>
                <select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="public">{t('donation.privacyPublic')}</option>
                  <option value="initials">{t('donation.privacyInitials')}</option>
                  <option value="anonymous">{t('donation.privacyAnon')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('donation.notes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="शुभकामना, संकल्प वा विशेष सन्देश..."
                  rows={2}
                />
              </div>

              <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" className="btn btn-green" disabled={loading}>
                  {loading ? 'दर्ता गर्दै...' : t('donation.submitDonation')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
