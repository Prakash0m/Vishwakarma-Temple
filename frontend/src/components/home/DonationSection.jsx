import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Landmark, QrCode, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import SupportersTicker from './SupportersTicker';

const DonationSection = ({ summary, settings, supporters, onOpenDonationModal }) => {
  const { language, t } = useLanguage();

  const totalDonation = summary?.totalDonation || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = totalDonation - totalExpense;
  const totalMembers = summary?.totalMembers || 0;
  const totalDonors = summary?.totalDonors || 0;

  const bankDetails = settings?.bankDetails || {
    bankName: 'Nepal Bank Limited, Saptari',
    accountName: 'Shri Vishwakarma Mandir Samiti, Chhapki',
    accountNumber: '01200100234567000001',
    branch: 'Kanchanpur / Rupani Branch, Saptari',
    fonepayNumber: '9852899999',
    esewaId: '9852899999',
    khaltiId: '9852899999'
  };

  return (
    <section id="donation" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>🙏</span>
            <span>{t('donation.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('donation.title')}</h2>
          <p className="section-subtitle">{t('donation.subtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪔</span>
          </div>
        </div>

        {/* Top 4 Financial Counter KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* Card 1: Total Donation */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              {t('donation.totalCollected')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: '800',
              color: 'var(--color-primary)'
            }}>
              रु. {totalDonation.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-green)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>✓ १००% पारदर्शी संकलन</span>
            </div>
          </div>

          {/* Card 2: Total Expense */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              {t('donation.totalExpense')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: '800',
              color: 'var(--color-saffron-dark)'
            }}>
              रु. {totalExpense.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              पूजा, मर्मत तथा सेवा खर्च
            </div>
          </div>

          {/* Card 3: Current Net Balance (Mandatory Green Color) */}
          <div style={{
            backgroundColor: 'var(--color-green-subtle)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.25rem 1.5rem',
            border: '1.5px solid rgba(45, 106, 79, 0.4)',
            boxShadow: '0 4px 12px rgba(45, 106, 79, 0.1)'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-green-dark)', fontWeight: '700', marginBottom: '4px' }}>
              {t('donation.currentBalance')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: '800',
              color: 'var(--color-green-dark)'
            }}>
              रु. {balance.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-green-dark)', marginTop: '4px', fontWeight: '600' }}>
              मन्दिर मौज्दात कोष (सुरक्षित)
            </div>
          </div>

          {/* Card 4: Total Members / Donors */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-lg)',
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>
              {t('donation.totalMembers')} / {t('donation.totalDonors')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: '800',
              color: 'var(--color-primary-dark)'
            }}>
              {totalMembers} / {totalDonors}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              दर्ता सदस्य तथा श्रद्धालुहरू
            </div>
          </div>
        </div>

        {/* Main Content: Left Bank/QR Info, Right Live Supporters Ticker */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Bank Details & Digital QR Instructions */}
          <div className="temple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Landmark size={22} color="#7A121D" />
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  color: 'var(--color-primary)'
                }}>
                  {t('donation.bankDetailsTitle')}
                </h3>
              </div>

              {/* Bank Info Table */}
              <div style={{
                backgroundColor: 'var(--bg-cream-alt)',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid var(--border-gold)',
                marginBottom: '1.5rem',
                fontSize: '0.92rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.bankName')}</span>
                  <strong style={{ color: 'var(--color-primary-dark)' }}>{bankDetails.bankName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.accountName')}</span>
                  <strong>{bankDetails.accountName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.accountNumber')}</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#1B4332', backgroundColor: '#E8F5EE', padding: '2px 8px', borderRadius: '4px' }}>
                    {bankDetails.accountNumber}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.branch')}</span>
                  <span>{bankDetails.branch}</span>
                </div>
              </div>

              {/* Digital Wallets Strip (eSewa, Khalti, Fonepay) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#60BB46' }}>eSewa ID</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-brown)', marginTop: '2px' }}>
                    {bankDetails.esewaId || '9852012345'}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#5C2D91' }}>Khalti ID</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-brown)', marginTop: '2px' }}>
                    {bankDetails.khaltiId || '9852012345'}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#C0392B' }}>Fonepay</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-brown)', marginTop: '2px' }}>
                    {bankDetails.fonepayNumber || '9852012345'}
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Action Button */}
            <button
              onClick={onOpenDonationModal}
              className="btn btn-lg btn-green"
              style={{ width: '100%', gap: '0.6rem' }}
            >
              <Heart size={18} />
              <span>{t('donation.submitReceiptBtn')}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Column: Live Supporters Ticker Sidebar */}
          <div>
            <SupportersTicker supporters={supporters} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
