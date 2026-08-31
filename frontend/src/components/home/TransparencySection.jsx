import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, BarChart3, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('donation.totalCollected')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: '800',
              color: 'var(--color-primary)'
            }}>
              रु. {totalDonation.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-maroon" style={{ marginTop: '8px' }}>आम्दानी विवरण</span>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('donation.totalExpense')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: '800',
              color: 'var(--color-saffron-dark)'
            }}>
              रु. {totalExpense.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-saffron" style={{ marginTop: '8px' }}>कुल खर्च</span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-green-subtle)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid rgba(45, 106, 79, 0.4)',
            boxShadow: '0 4px 14px rgba(45, 106, 79, 0.12)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--color-green-dark)', fontWeight: '700', marginBottom: '6px' }}>
              {t('donation.currentBalance')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: '800',
              color: 'var(--color-green-dark)'
            }}>
              रु. {balance.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-green" style={{ marginTop: '8px' }}>सुरक्षित मौज्दात</span>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t('admin.totalBudgetCard')}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.85rem',
              fontWeight: '800',
              color: 'var(--color-gold-dark)'
            }}>
              रु. {totalBudget.toLocaleString('ne-NP')}
            </div>
            <span className="badge badge-gold" style={{ marginTop: '8px' }}>वार्षिक बजेट योजना</span>
          </div>
        </div>

        {/* Budget Progress Bars Breakdown */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--border-radius-xl)',
          padding: '2rem',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                color: 'var(--color-primary-dark)'
              }}>
                {t('transparency.budgetTitle')}
              </h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                आर्थिक वर्ष २०८१/८२ (2026) शीर्षकगत विवरण
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }}></span>
                <span>{t('transparency.healthyBudget')} (&lt;८०%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>
                <span>{t('transparency.warningBudget')} (८०-९९%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
                <span>{t('transparency.exceededBudget')} (&gt;=१००%)</span>
              </div>
            </div>
          </div>

          {/* Budget items list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
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
                      padding: '1.2rem',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: 'var(--color-primary-dark)' }}>
                        {categoryName}
                      </strong>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: healthColor === 'red' ? 'var(--color-danger)' : healthColor === 'orange' ? 'var(--color-warning)' : 'var(--color-green)'
                      }}>
                        {percent}% खर्च
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-bar-bg" style={{ marginBottom: '10px' }}>
                      <div
                        className={`progress-bar-fill ${healthColor}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
