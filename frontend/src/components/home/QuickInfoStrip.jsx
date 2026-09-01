import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Calendar, MapPin, Phone } from 'lucide-react';

const QuickInfoStrip = ({ settings }) => {
  const { language, t } = useLanguage();

  const dailyTime = language === 'ne'
    ? (settings?.dailyPoojaTimeNepali || 'बिहान ६:०० देखि साँझ ७:०० सम्म')
    : (settings?.dailyPoojaTimeEnglish || '6:00 AM to 7:00 PM Daily');

  const specialTime = language === 'ne'
    ? (settings?.specialPoojaTimeNepali || 'प्रत्येक शनिबार तथा संक्रान्ति')
    : (settings?.specialPoojaTimeEnglish || 'Every Saturday & Sankranti');

  const locationText = language === 'ne'
    ? (settings?.addressNepali || 'छापकी (वडा नं. ५), सप्तरी')
    : (settings?.addressEnglish || 'Chhapki (Ward No. 5), Saptari');

  const phoneText = settings?.phone || '+९७७-३१-५२०१२३ / ९८५२८९९९९९';

  const items = [
    {
      icon: <Clock size={22} color="#D9531E" />,
      title: t('quickInfo.dailyPoojaTitle'),
      desc: dailyTime,
      badge: 'नित्य सेवा'
    },
    {
      icon: <Calendar size={22} color="#C59B27" />,
      title: t('quickInfo.specialPoojaTitle'),
      desc: specialTime,
      badge: 'महाआरती'
    },
    {
      icon: <MapPin size={22} color="#2D6A4F" />,
      title: t('quickInfo.locationTitle'),
      desc: locationText,
      badge: 'छापकी (Chhapki)'
    },
    {
      icon: <Phone size={22} color="#7A121D" />,
      title: t('quickInfo.contactTitle'),
      desc: phoneText,
      badge: '२४/७ सेवा'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#FAF7F2',
      borderBottom: '1px solid var(--border-gold)',
      padding: '1rem 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem'
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--border-radius-md)',
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 2px 8px rgba(43, 30, 22, 0.04)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-gold)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                backgroundColor: 'var(--bg-cream)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: 'var(--color-primary-dark)',
                  lineHeight: 1.2
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickInfoStrip;
