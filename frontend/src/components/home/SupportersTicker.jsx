import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Sparkles, UserCheck } from 'lucide-react';

const SupportersTicker = ({ supporters }) => {
  const { language, t } = useLanguage();

  if (!supporters || supporters.length === 0) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--border-radius-lg)',
      border: '1px solid var(--border-gold)',
      padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(43, 30, 22, 0.05)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        paddingBottom: '1rem',
        borderBottom: '1.5px solid var(--border-gold)',
        marginBottom: '1rem'
      }}>
        <div style={{
          backgroundColor: 'var(--color-primary-subtle)',
          padding: '8px',
          borderRadius: '10px'
        }}>
          <Heart size={20} color="#7A121D" />
        </div>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            color: 'var(--color-primary-dark)',
            lineHeight: 1.2
          }}>
            {t('supporters.title')}
          </h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {t('supporters.subtitle')}
          </div>
        </div>
      </div>

      {/* Scrolling List Container */}
      <div style={{
        overflowY: 'auto',
        maxHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        paddingRight: '4px'
      }}>
        {supporters.map((item, index) => (
          <div
            key={item._id || index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-cream)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-cream-alt)';
              e.currentTarget.style.borderColor = 'var(--color-gold)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-cream)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.82rem',
                color: 'var(--color-primary)',
                fontWeight: '700'
              }}>
                {index + 1}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: 'var(--color-primary-dark)'
                }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.purpose || 'सामान्य मन्दिर कोष'}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: '800',
                color: 'var(--color-green)'
              }}>
                रु. {item.amount ? item.amount.toLocaleString('ne-NP') : '०'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {item.date ? new Date(item.date).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        ✨ सम्पूर्ण श्रद्धालु महानुभावहरू प्रति मन्दिर परिवार हार्दिक कृतज्ञता व्यक्त गर्दछ।
      </div>
    </div>
  );
};

export default SupportersTicker;
