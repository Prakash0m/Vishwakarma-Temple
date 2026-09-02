import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Users, CalendarCheck, Sparkles, HeartHandshake } from 'lucide-react';
import { getImageUrl } from '../../utils/imageOptimizer';

const AboutSection = ({ settings }) => {
  const { language, t } = useLanguage();

  const aboutTitle = language === 'ne'
    ? (settings?.aboutTitleNepali || 'हाम्रो मन्दिरको बारेमा')
    : (settings?.aboutTitleEnglish || 'About Vishwakarma Temple');

  const aboutDesc = language === 'ne'
    ? (settings?.aboutDescriptionNepali || 'सप्तरी जिल्लाको अग्निसाइर कृष्णासवरण गाउँपालिका वडा नं. ५, छापकीको पवित्र भूमिमा अवस्थित श्री विश्वकर्मा मन्दिर शिल्पकार, श्रमिक, प्राविधिक तथा सम्पूर्ण श्रद्धालु भक्तजनहरूको आस्थाको धरोहर हो। मन्दिरले सनातन धर्म, संस्कृति संरक्षण, दैनिक पूजा-आराधना र सामाजिक सेवाका विभिन्न कार्यहरू निरन्तर सञ्चालन गर्दै आएको छ।')
    : (settings?.aboutDescriptionEnglish || 'Located in the sacred settlement of Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District (Madhesh Province, Nepal), the Vishwakarma Temple serves as a sanctum of spiritual devotion, cultural heritage, and community empowerment. We conduct daily morning and evening aartis, Vedic pujas, and charitable outreach programs.');

  const aboutImage = settings?.aboutImage || '/assets/images/temple-structure.jpg';

  // Clear un-truncated stat labels and numbers
  const stats = [
    {
      icon: <Sparkles size={20} color="#C59B27" />,
      number: language === 'ne' ? '२०५५ (१९९८)' : '1998 AD (2055)',
      label: language === 'ne' ? 'स्थापना वर्ष' : 'Established Year'
    },
    {
      icon: <Users size={20} color="#D9531E" />,
      number: language === 'ne' ? '१०,०००+' : '10,000+',
      label: language === 'ne' ? 'वार्षिक भक्तजन' : 'Annual Devotees'
    },
    {
      icon: <CalendarCheck size={20} color="#7A121D" />,
      number: language === 'ne' ? '२४+' : '24+',
      label: language === 'ne' ? 'वार्षिक उत्सव' : 'Annual Events'
    },
    {
      icon: <ShieldCheck size={20} color="#2D6A4F" />,
      number: language === 'ne' ? '१००% पारदर्शी' : '100% Transparent',
      label: language === 'ne' ? 'समुदाय सेवा' : 'Community Seva'
    }
  ];

  return (
    <section id="about" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(2rem, 4vw, 3.5rem)',
          alignItems: 'center'
        }}>
          {/* Left Side: Real Temple Photograph with Animated Golden Shimmer Frame */}
          <div>
            <div className="gold-shimmer-border" style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '6px',
              boxShadow: '0 14px 36px rgba(43, 30, 22, 0.12)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#FAF7F2',
                aspectRatio: '16 / 11',
                width: '100%',
                position: 'relative'
              }}>
                <img
                  src={getImageUrl(aboutImage)}
                  alt="Vishwakarma Temple Structure - Chhapki, Saptari, Nepal"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 40%',
                    display: 'block',
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/temple-structure.jpg';
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>

              {/* Floating Real Temple Badge with Smooth Float Animation */}
              <div className="animate-float" style={{
                position: 'absolute',
                top: '-12px',
                left: '16px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '5px 14px',
                borderRadius: 'var(--border-radius-full)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.82rem',
                fontWeight: '700',
                boxShadow: '0 6px 16px rgba(122, 18, 29, 0.35)',
                border: '1.5px solid var(--color-gold)'
              }}>
                🏛️ श्री विश्वकर्मा मन्दिर परिसर
              </div>

              {/* Bottom Caption Pill */}
              <div style={{
                position: 'absolute',
                bottom: '14px',
                left: '14px',
                right: '14px',
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
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 छापकी (सप्तरी) • शिखर शैली</span>
                <span style={{ color: '#2D6A4F', fontWeight: 'bold', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
                  प्रमाणित तीर्थ
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Narrative, Mission & Animated Stat Counters */}
          <div>
            <div className="section-eyebrow">
              <span className="diya-flame">🪷</span>
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
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              transition: 'transform 0.25s ease'
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

            {/* Statistics Counters with Spring-like Micro-Bounce on Hover */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem'
            }}>
              {stats.map((st, index) => (
                <div
                  key={index}
                  className="stat-card-animated"
                  style={{
                    backgroundColor: 'var(--bg-cream-alt)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '0.85rem 0.95rem',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div
                    className="stat-icon-wrapper"
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '8px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      flexShrink: 0
                    }}
                  >
                    {st.icon}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: 'var(--color-primary-dark)',
                      lineHeight: 1.15,
                      marginBottom: '2px'
                    }}>
                      {st.number}
                    </div>
                    <div style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      fontWeight: '600',
                      lineHeight: 1.2
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
