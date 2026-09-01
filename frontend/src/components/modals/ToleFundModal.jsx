import React, { useState } from 'react';
import api from '../../services/api';
import {
  X,
  Phone,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const ToleFundModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Lookup Phone, 2: Payment & Proof, 3: Success Confirmation
  const [phone, setPhone] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [residentData, setResidentData] = useState(null);

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState('eSewa');
  const [transactionId, setTransactionId] = useState('');
  const [receiptVoucherImage, setReceiptVoucherImage] = useState('');
  const [payerNotes, setPayerNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  if (!isOpen) return null;

  const handlePhoneLookup = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 6) {
      setLookupError('कृपया मान्य मोबाइल नम्बर प्रविष्ट गर्नुहोस् (Please enter valid mobile number)');
      return;
    }

    try {
      setLookingUp(true);
      setLookupError(null);
      const res = await api.get('/tole/fund-payments/lookup', {
        params: { phone: phone.trim() }
      });

      if (res.data.success) {
        setResidentData(res.data.data);
        if (res.data.data.canSubmit) {
          setStep(2);
        }
      }
    } catch (err) {
      setLookupError(err.response?.data?.message || 'यो मोबाइल नम्बर टोल प्रणालीमा फेला परेन। कृपया टोल समितिसँग सम्पर्क गर्नुहोस्।');
    } finally {
      setLookingUp(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        houseIdDb: residentData.houseIdDb,
        campaignId: residentData.activeCampaign._id,
        memberName: residentData.matchedPersonName || residentData.representativeName,
        phone: phone.trim(),
        amount: residentData.activeCampaign.amountPerHouse,
        paymentMethod,
        transactionId,
        receiptVoucherImage,
        payerNotes
      };

      const res = await api.post('/tole/fund-payments/submit', payload);
      if (res.data.success) {
        setSubmitResult(res.data.data);
        setStep(3);
      }
    } catch (err) {
      alert('भुक्तानी पेश गर्दा त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPhone('');
    setResidentData(null);
    setLookupError(null);
    setTransactionId('');
    setReceiptVoucherImage('');
    setPayerNotes('');
    setSubmitResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleReset}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', width: '100%' }}>
        {/* Close Button */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={18} color="var(--color-primary)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.15rem', margin: 0 }}>
              मासिक टोल कोष भुक्तानी
            </h3>
          </div>
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* STEP 1: Phone Verification */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--color-primary-subtle)',
                  borderRadius: '20px',
                  color: 'var(--color-primary)',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '0.35rem'
                }}>
                  <ShieldCheck size={13} />
                  <span>छापकी टोल मासिक कोष</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#666', margin: 0 }}>
                  सजिलो मोबाइल नम्बर प्रमाणिकरण र अनलाइन भौचर पेश प्रणाली
                </p>
              </div>

              <form onSubmit={handlePhoneLookup}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
                    तपाईंको दर्ता भएको मोबाइल नम्बर प्रविष्ट गर्नुहोस्:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input
                      type="tel"
                      required
                      placeholder="98520XXXXX (उदा: 9852011111)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.5rem', fontWeight: '600' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '0.35rem' }}>
                    * टोल प्रणालीमा दर्ता भएको घरमुली वा परिवार सदस्यको नम्बर
                  </div>
                </div>

                {lookupError && (
                  <div style={{ backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '0.75rem', color: '#C62828', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{lookupError}</span>
                  </div>
                )}

                {/* If already paid or pending */}
                {residentData && !residentData.canSubmit && (
                  <div style={{ backgroundColor: '#FAF7F2', border: '1.5px solid var(--color-gold)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                    <CheckCircle size={28} color="#2E7D32" style={{ margin: '0 auto 0.4rem auto' }} />
                    <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '1rem', marginBottom: '0.2rem' }}>
                      {residentData.representativeName} (घर नं. {residentData.houseNumber})
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#444', margin: '0 0 0.4rem 0' }}>
                      {residentData.paymentStatusMsg}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: '#777' }}>
                      सम्पर्क: टोल विकास समिति कोषाध्यक्ष (९८०४०१११११)
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={lookingUp}
                  className="btn btn-primary"
                  style={{ width: '100%', minHeight: '46px', gap: '0.4rem' }}
                >
                  {lookingUp ? 'प्रमाणिकरण गरिँदैछ...' : 'अगाडि बढ्नुहोस् (Continue)'}
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Verified Resident Info & Payment Proof Submission */}
          {step === 2 && residentData && (
            <div>
              <form onSubmit={handlePaymentSubmit}>
                {/* Resident Verified Card */}
                <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--border-gold)', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    प्रमाणित घरधुरी विवरण
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <div>घर नं: <strong>{residentData.houseNumber} ({residentData.houseId})</strong></div>
                    <div>घरमुली: <strong>{residentData.representativeName}</strong></div>
                    <div>परिवार प्रकार: <strong>{residentData.familyType}</strong></div>
                    <div>भुक्तानीकर्ता: <strong>{residentData.matchedPersonName}</strong></div>
                  </div>

                  <div style={{ marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px dashed #D0C9BE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>अभियान: {residentData.activeCampaign.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>महिना: {residentData.activeCampaign.month} {residentData.activeCampaign.year}</div>
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                      रु. {residentData.activeCampaign.amountPerHouse}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    भुक्तानी माध्यम छान्नुहोस् (Payment Method) *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '0.4rem' }}>
                    {['eSewa', 'Khalti', 'Fonepay', 'Bank Transfer'].map(m => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        style={{
                          padding: '0.55rem 0.35rem',
                          minHeight: '40px',
                          borderRadius: '8px',
                          border: paymentMethod === m ? '2px solid var(--color-primary)' : '1px solid #D0C9BE',
                          backgroundColor: paymentMethod === m ? 'var(--color-primary-subtle)' : '#FFFFFF',
                          color: paymentMethod === m ? 'var(--color-primary-dark)' : '#444',
                          fontWeight: paymentMethod === m ? '700' : '500',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div style={{ backgroundColor: '#F0ECE4', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#444', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  <strong>भुक्तानी निर्देशन:</strong> {residentData.activeCampaign.paymentInstructions || 'eSewa / Khalti मार्फत ९८०४०१११११ मा रु. १००० पठाउनुहोस् वा तलको विवरण भर्नुहोस्।'}
                </div>

                {/* Transaction ID & Image URL */}
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    कारोबार कोड (Transaction ID / Reference)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: ESEWA-9928172 / VOUCHER-0192"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    भुक्तानी स्क्रिनसट / भौचर तस्बिर URL
                  </label>
                  <input
                    type="text"
                    placeholder="/assets/images/payment-proof.jpg"
                    value={receiptVoucherImage}
                    onChange={(e) => setReceiptVoucherImage(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    थप टिप्पणी (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    placeholder="कुनै टिप्पणी..."
                    value={payerNotes}
                    onChange={(e) => setPayerNotes(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-outline"
                    style={{ flex: 1, minHeight: '44px' }}
                  >
                    पछाडि (Back)
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ flex: 2, minHeight: '44px' }}
                  >
                    {submitting ? 'पेश गरिँदैछ...' : 'भुक्तानी पेश गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Submission Success Confirmation */}
          {step === 3 && submitResult && (
            <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', color: '#2E7D32' }}>
                <CheckCircle size={32} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.25rem', margin: '0 0 0.4rem 0' }}>
                भुक्तानी विवरण सफलतापूर्वक पेश भयो!
              </h3>

              <p style={{ fontSize: '0.84rem', color: '#555', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                तपाईंको मासिक कोष भुक्तानी विवरण (ID: <strong>{submitResult.paymentId}</strong>) दर्ता भएको छ।
              </p>

              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '0.85rem', border: '1px solid var(--border-gold)', textAlign: 'left', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>घर नम्बर:</span>
                  <strong>{submitResult.houseNumber} ({submitResult.houseId})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>सदस्यको नाम:</span>
                  <strong>{submitResult.memberName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>महिना:</span>
                  <strong>{submitResult.campaignMonth} {submitResult.campaignYear}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>रकम:</span>
                  <strong style={{ color: '#2E7D32' }}>रु. {submitResult.amount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>स्थिति:</span>
                  <strong style={{ color: '#F57F17' }}>प्रतीक्षारत (PENDING)</strong>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="btn btn-primary"
                style={{ width: '100%', minHeight: '44px' }}
              >
                सम्पन्न गर्नुहोस् (Done)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToleFundModal;
