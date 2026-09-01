import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck } from 'lucide-react';

const TransparencySection = ({ summary, budgets, settings }) => {
  const { language, t, getLocalized } = useLanguage();

  const totalDonation = summary?.totalDonation || 0;
  const totalExpense = summary?.totalExpense || 0;
  const balance = totalDonation - totalExpense;
  const totalBudget = summary?.totalBudget || 0;

  const noticeText = language === 'ne'
    ? (settings?.transparencyNoticeNepali || 'मन्दिरका आर्थिक गतिविधिहरू पारदर्शी र व्यवस्थित रूपमा व्यवस्थापन गरिन्छ।')
    : (settings?.transparencyNoticeEnglish || 'All financial offerings, donations, and expenditures are recorded transparently with full accountability.');

  return (
    <section id="transparency" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <ShieldCheck size={16} />
            <span>{t('transparency.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('transparency.title')}</h2>
          <p className="section-subtitle">{noticeText}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">ॐ</span>
          </div>
        </div>

        {/* 4 Large Clean Visual Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.85rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '1rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {t('donation.totalCollected')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.65rem)',
              fontWeight: '800',
              color: 'var(--color-primary)'
            }}>
              रु. {totalDonation.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-maroon" style={{ marginTop: '6px' }}>आम्दानी</span>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '1rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {t('donation.totalExpense')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.65rem)',
              fontWeight: '800',
              color: 'var(--color-saffron-dark)'
            }}>
              रु. {totalExpense.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-saffron" style={{ marginTop: '6px' }}>खर्च</span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-green-subtle)',
            borderRadius: '14px',
            padding: '1rem',
            border: '1.5px solid rgba(45, 106, 79, 0.4)',
            boxShadow: '0 4px 14px rgba(45, 106, 79, 0.12)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-green-dark)', fontWeight: '700', marginBottom: '4px' }}>
              {t('donation.currentBalance')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.65rem)',
              fontWeight: '800',
              color: 'var(--color-green-dark)'
            }}>
              रु. {balance.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-green" style={{ marginTop: '6px' }}>मौज्दात</span>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '1rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {t('admin.totalBudgetCard')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.65rem)',
              fontWeight: '800',
              color: 'var(--color-gold-dark)'
            }}>
              रु. {totalBudget.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-gold" style={{ marginTop: '6px' }}>वार्षिक बजेट</span>
          </div>
        </div>

        {/* Budget Progress Bars Breakdown */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--border-radius-xl)',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                color: 'var(--color-primary-dark)',
                margin: '0 0 2px 0'
              }}>
                {t('transparency.budgetTitle')}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                आर्थिक वर्ष २०८१/८२ (2026) शीर्षकगत विवरण
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem', fontSize: '0.76rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }}></span>
                <span>{t('transparency.healthyBudget')} (&lt;८०%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>
                <span>{t('transparency.warningBudget')} (८०-९९%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
                <span>{t('transparency.exceededBudget')} (&gt;=१००%)</span>
              </div>
            </div>
          </div>

          {/* Budget items list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {budgets && budgets.length > 0 ? (
              budgets.map((b) => {
                const categoryName = getLocalized(b, 'category', 'categoryEnglish');
                const percent = b.percentageUsed || 0;
                const healthColor = b.statusColor || 'green';

                return (
                  <div
                    key={b._id}
                    style={{
                      backgroundColor: 'var(--bg-cream)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', color: 'var(--color-primary-dark)' }}>
                        {categoryName}
                      </strong>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: healthColor === 'red' ? 'var(--color-danger)' : healthColor === 'orange' ? 'var(--color-warning)' : 'var(--color-green)'
                      }}>
                        {percent}% खर्च
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-bg" style={{ marginBottom: '8px' }}>
                      <div
                        className={`progress-bar-fill ${healthColor}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>बजेट: रु. {b.allocatedAmount ? b.allocatedAmount.toLocaleString('ne-NP') : '०'}</span>
                      <span>खर्च: रु. {b.spent ? b.spent.toLocaleString('ne-NP') : '०'}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                बजेट विवरण उपलब्ध छ।
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
