import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Landmark, ArrowRight } from 'lucide-react';
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
            <span className="diya-flame">🙏</span>
            <span>{t('donation.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('donation.title')}</h2>
          <p className="section-subtitle">{t('donation.subtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪔</span>
          </div>
        </div>

        {/* Top 4 Financial Counter KPI Cards with Micro-Bounce */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.85rem',
          marginBottom: '2rem'
        }}>
          {/* Card 1: Total Donation */}
          <div className="stat-card-animated" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem 1.15rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>
              {t('donation.totalCollected')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              fontWeight: '800',
              color: 'var(--color-primary)'
            }}>
              रु. {totalDonation.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-green)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
              <span>१००% पारदर्शी</span>
            </div>
          </div>

          {/* Card 2: Total Expense */}
          <div className="stat-card-animated" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem 1.15rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>
              {t('donation.totalExpense')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              fontWeight: '800',
              color: 'var(--color-saffron-dark)'
            }}>
              रु. {totalExpense.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              पूजा, मर्मत तथा सेवा
            </div>
          </div>

          {/* Card 3: Current Net Balance (Green) */}
          <div className="stat-card-animated" style={{
            backgroundColor: 'var(--color-green-subtle)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem 1.15rem',
            border: '1.5px solid rgba(45, 106, 79, 0.4)',
            boxShadow: '0 4px 12px rgba(45, 106, 79, 0.1)'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-green-dark)', fontWeight: '700', marginBottom: '2px' }}>
              {t('donation.currentBalance')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              fontWeight: '800',
              color: 'var(--color-green-dark)'
            }}>
              रु. {balance.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-green-dark)', marginTop: '2px', fontWeight: '600' }}>
              मन्दिर मौज्दात कोष
            </div>
          </div>

          {/* Card 4: Total Members / Donors */}
          <div className="stat-card-animated" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem 1.15rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>
              {t('donation.totalMembers')} / {t('donation.totalDonors')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              fontWeight: '800',
              color: 'var(--color-primary-dark)'
            }}>
              {totalMembers} / {totalDonors}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              दर्ता सदस्य / श्रद्धालु
            </div>
          </div>
        </div>

        {/* Main Content: Left Bank/QR Info, Right Live Supporters Ticker */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Bank Details & Digital QR Instructions */}
          <div className="temple-card card-interactive" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Landmark size={20} color="#7A121D" />
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  color: 'var(--color-primary)'
                }}>
                  {t('donation.bankDetailsTitle')}
                </h3>
              </div>

              {/* Bank Info Table */}
              <div style={{
                backgroundColor: 'var(--bg-cream-alt)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border-gold)',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.bankName')}</span>
                  <strong style={{ color: 'var(--color-primary-dark)' }}>{bankDetails.bankName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.accountName')}</span>
                  <strong>{bankDetails.accountName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.accountNumber')}</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#1B4332', backgroundColor: '#E8F5EE', padding: '2px 6px', borderRadius: '4px', wordBreak: 'break-all' }}>
                    {bankDetails.accountNumber}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('donation.branch')}</span>
                  <span>{bankDetails.branch}</span>
                </div>
              </div>

              {/* Digital Wallets Strip (eSewa, Khalti, Fonepay) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                textAlign: 'center'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '8px 6px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#60BB46' }}>eSewa ID</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-brown)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {bankDetails.esewaId || '9852012345'}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '8px 6px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#5C2D91' }}>Khalti ID</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-brown)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {bankDetails.khaltiId || '9852012345'}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '8px 6px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#C0392B' }}>Fonepay</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-brown)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {bankDetails.fonepayNumber || '9852012345'}
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Action Button with Shimmer Sweep */}
            <button
              onClick={onOpenDonationModal}
              className="btn btn-lg btn-green btn-shimmer"
              style={{ width: '100%', gap: '0.5rem', boxShadow: '0 6px 18px rgba(45, 106, 79, 0.3)' }}
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
