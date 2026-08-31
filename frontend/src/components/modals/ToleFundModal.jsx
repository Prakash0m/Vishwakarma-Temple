import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Phone,
  Search,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Upload,
  ArrowRight,
  Home,
  User,
  DollarSign,
  ShieldCheck,
  QrCode
} from 'lucide-react';

const ToleFundModal = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '580px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-gold)'
      }}>
        {/* Close Button */}
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            padding: '0.25rem'
          }}
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #F0ECE4', paddingBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'var(--color-primary-subtle)',
            borderRadius: '20px',
            color: 'var(--color-primary)',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '0.4rem'
          }}>
            <ShieldCheck size={14} />
            <span>छापकी टोल मासिक कोष संकलन</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.45rem', margin: 0 }}>
            मासिक टोल कोष भुक्तानी फारम
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
            सजिलो मोबाइल नम्बर प्रमाणिकरण र अनलाइन भौचर पेश प्रणाली
          </p>
        </div>

        {/* STEP 1: Phone Verification */}
        {step === 1 && (
          <div>
            <form onSubmit={handlePhoneLookup}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>
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
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1.5px solid #D0C9BE',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#777', marginTop: '0.35rem' }}>
                  * टोल प्रणालीमा दर्ता भएको घरमुली वा परिवार सदस्यको नम्बर
                </div>
              </div>

              {lookupError && (
                <div style={{ backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '0.75rem', color: '#C62828', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} />
                  <span>{lookupError}</span>
                </div>
              )}

              {/* If already paid or pending */}
              {residentData && !residentData.canSubmit && (
                <div style={{ backgroundColor: '#FAF7F2', border: '1.5px solid var(--color-gold)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                  <CheckCircle size={32} color="#2E7D32" style={{ margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                    {residentData.representativeName} (घर नं. {residentData.houseNumber})
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#444', margin: '0 0 0.5rem 0' }}>
                    {residentData.paymentStatusMsg}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#777' }}>
                    सम्पर्क: टोल विकास समिति कोषाध्यक्ष (९८०४०१११११)
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={lookingUp}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(122, 18, 29, 0.25)'
                }}
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
              <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-gold)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  प्रमाणित घरधुरी विवरण
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div>घर नं: <strong>{residentData.houseNumber} ({residentData.houseId})</strong></div>
                  <div>घरमुली: <strong>{residentData.representativeName}</strong></div>
                  <div>परिवार प्रकार: <strong>{residentData.familyType}</strong></div>
                  <div>भुक्तानीकर्ता: <strong>{residentData.matchedPersonName}</strong></div>
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed #D0C9BE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>अभियान: {residentData.activeCampaign.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>महिना: {residentData.activeCampaign.month} {residentData.activeCampaign.year}</div>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                    रु. {residentData.activeCampaign.amountPerHouse}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                  भुक्तानी माध्यम छान्नुहोस् (Payment Method) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {['eSewa', 'Khalti', 'Fonepay', 'Bank Transfer'].map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      style={{
                        padding: '0.6rem 0.4rem',
                        borderRadius: '8px',
                        border: paymentMethod === m ? '2px solid var(--color-primary)' : '1px solid #D0C9BE',
                        backgroundColor: paymentMethod === m ? 'var(--color-primary-subtle)' : '#FFFFFF',
                        color: paymentMethod === m ? 'var(--color-primary-dark)' : '#444',
                        fontWeight: paymentMethod === m ? '700' : '500',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code / Instructions */}
              <div style={{ backgroundColor: '#F0ECE4', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: '#444', marginBottom: '1rem', lineHeight: 1.4 }}>
                <strong>भुक्तानी निर्देशन:</strong> {residentData.activeCampaign.paymentInstructions || 'eSewa / Khalti मार्फत ९८०४०१११११ मा रु. १००० पठाउनुहोस् वा तलको विवरण भर्नुहोस्।'}
              </div>

              {/* Transaction ID & Image URL */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  कारोबार कोड (Transaction ID / Reference)
                </label>
                <input
                  type="text"
                  placeholder="उदा: ESEWA-9928172 / VOUCHER-0192"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  भुक्तानी स्क्रिनसट / भौचर तस्बिर URL
                </label>
                <input
                  type="text"
                  placeholder="/assets/images/payment-proof.jpg"
                  value={receiptVoucherImage}
                  onChange={(e) => setReceiptVoucherImage(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  थप टिप्पणी (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="कुनै टिप्पणी..."
                  value={payerNotes}
                  onChange={(e) => setPayerNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
                >
                  पछाडि (Back)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFF',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(122, 18, 29, 0.25)'
                  }}
                >
                  {submitting ? 'पेश गरिँदैछ...' : 'भुक्तानी पेश गर्नुहोस् (Submit)'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Submission Success Confirmation */}
        {step === 3 && submitResult && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#2E7D32' }}>
              <CheckCircle size={36} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>
              भुक्तानी विवरण सफलतापूर्वक पेश भयो!
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              तपाईंको मासिक कोष भुक्तानी विवरण (ID: <strong>{submitResult.paymentId}</strong>) दर्ता भएको छ। समितिले प्रमाणीकरण गरेपछि आधिकारिक रसिद जारी हुनेछ।
            </p>

            <div style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-gold)', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>घर नम्बर:</span>
                <strong>{submitResult.houseNumber} ({submitResult.houseId})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>सदस्यको नाम:</span>
                <strong>{submitResult.memberName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>महिना:</span>
                <strong>{submitResult.campaignMonth} {submitResult.campaignYear}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span>रकम:</span>
                <strong style={{ color: '#2E7D32' }}>रु. {submitResult.amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>स्थिति:</span>
                <strong style={{ color: '#F57F17' }}>प्रतीक्षारत (PENDING APPROVAL)</strong>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              सम्पन्न गर्नुहोस् (Done)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToleFundModal;
