import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Users, CalendarCheck, Sparkles, HeartHandshake } from 'lucide-react';

const AboutSection = ({ settings }) => {
  const { language, t } = useLanguage();

  const aboutTitle = language === 'ne'
    ? (settings?.aboutTitleNepali || 'हाम्रो मन्दिरको बारेमा')
    : (settings?.aboutTitleEnglish || 'About Vishwakarma Temple');

  const aboutDesc = language === 'ne'
    ? (settings?.aboutDescriptionNepali || 'सप्तरी जिल्लाको अग्निसाइर कृष्णासवरण गाउँपालिका वडा नं. ५, छापकीको पवित्र भूमिमा अवस्थित श्री विश्वकर्मा मन्दिर शिल्पकार, श्रमिक, प्राविधिक तथा सम्पूर्ण श्रद्धालु भक्तजनहरूको आस्थाको धरोहर हो। मन्दिरले सनातन धर्म, संस्कृति संरक्षण, दैनिक पूजा-आराधना र सामाजिक सेवाका विभिन्न कार्यहरू निरन्तर सञ्चालन गर्दै आएको छ।')
    : (settings?.aboutDescriptionEnglish || 'Located in the sacred settlement of Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District (Madhesh Province, Nepal), the Vishwakarma Temple serves as a sanctum of spiritual devotion, cultural heritage, and community empowerment. We conduct daily morning and evening aartis, Vedic pujas, and charitable outreach programs.');

  const aboutImage = settings?.aboutImage || '/assets/images/temple-structure.jpg';

  const stats = [
    {
      icon: <Sparkles size={20} color="#C59B27" />,
      number: settings?.establishedYear || '२०५५',
      label: t('about.statsEstablished')
    },
    {
      icon: <Users size={20} color="#D9531E" />,
      number: settings?.devoteesCount || '१०,०००+',
      label: t('about.statsDevotees')
    },
    {
      icon: <CalendarCheck size={20} color="#7A121D" />,
      number: settings?.annualEventsCount || '२४+',
      label: t('about.statsEvents')
    },
    {
      icon: <ShieldCheck size={20} color="#2D6A4F" />,
      number: settings?.communityProjectsCount || '१००% पारदर्शी',
      label: t('about.statsTransparency')
    }
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'center'
        }}>
          {/* Left Side: Real Temple Photograph with Elevation Frame */}
          <div>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '6px',
              background: 'linear-gradient(135deg, #C59B27 0%, rgba(122, 18, 29, 0.2) 100%)',
              boxShadow: '0 14px 36px rgba(43, 30, 22, 0.12)'
            }}>
              <img
                src={aboutImage}
                alt="Vishwakarma Temple Structure - Chhapki, Saptari, Nepal"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '420px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  display: 'block'
                }}
              />

              {/* Floating Real Temple Badge */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '16px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: 'var(--border-radius-full)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(122, 18, 29, 0.3)',
                border: '1px solid var(--color-gold)'
              }}>
                🏛️ श्री विश्वकर्मा मन्दिर परिसर
              </div>

              {/* Bottom Caption Pill */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(250, 247, 242, 0.95)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid var(--border-gold)',
                fontSize: '0.78rem',
                color: 'var(--text-brown)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '4px'
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 छापकी (सप्तरी) • शिखर शैली</span>
                <span style={{ color: '#2D6A4F', fontWeight: 'bold', flexShrink: 0 }}>✓ प्रमाणित तीर्थ</span>
              </div>
            </div>
          </div>

          {/* Right Side: Narrative & Mission */}
          <div>
            <div className="section-eyebrow">
              <span>🪷</span>
              <span>{t('about.eyebrow')}</span>
            </div>

            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              {aboutTitle}
            </h2>

            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              lineHeight: 1.8,
              color: 'var(--text-brown)',
              marginBottom: '1.25rem'
            }}>
              {aboutDesc}
            </p>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderLeft: '4px solid var(--color-gold)',
              padding: '1rem 1.25rem',
              borderRadius: '0 12px 12px 0',
              marginBottom: '1.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                fontSize: '0.95rem',
                color: 'var(--color-primary)',
                marginBottom: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <HeartHandshake size={18} color="#D9531E" />
                <span>{t('about.missionTitle')}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {t('about.missionDesc')}
              </p>
            </div>

            {/* Statistics Counters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem'
            }}>
              {stats.map((st, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'var(--bg-cream-alt)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '0.75rem 0.85rem',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    flexShrink: 0
                  }}>
                    {st.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.05rem',
                      fontWeight: '800',
                      color: 'var(--color-primary-dark)',
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {st.number}
                    </div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {st.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
