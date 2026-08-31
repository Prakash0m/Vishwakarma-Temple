import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Sparkles, Video, ArrowDown, ChevronRight } from 'lucide-react';

const HeroSection = ({ settings, meetingData, onOpenDonationModal }) => {
  const { language, t } = useLanguage();

  const heroEyebrow = language === 'ne'
    ? (settings?.heroEyebrowNepali || 'ॐ श्री विश्वकर्मणे नमः')
    : (settings?.heroEyebrowEnglish || 'Om Shri Vishwakarmane Namah');

  const heroTitle = language === 'ne'
    ? (settings?.heroTitleNepali || 'विश्वकर्मा भगवानको शरणमा स्वागत छ')
    : (settings?.heroTitleEnglish || 'Welcome to the Divine Presence of Lord Vishwakarma');

  const heroSubtitle = language === 'ne'
    ? (settings?.heroSubtitleNepali || 'सृष्टि, वास्तुकला, विज्ञान र शिल्पकलाका अधिष्ठाता भगवान विश्वकर्माको पवित्र प्राङ्गणमा हार्दिक नमन गर्दछौं।')
    : (settings?.heroSubtitleEnglish || 'Devoted to the divine supreme architect, engineer, and creator of the universe. Experience peace, prayers, and community harmony.');

  const heroImage = settings?.heroImage || '/assets/images/deity-portrait.jpg';

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    const el = document.getElementById('pooja');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" style={{
      position: 'relative',
      paddingTop: '3.5rem',
      paddingBottom: '4.5rem',
      background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)',
      borderBottom: '1px solid var(--border-gold)',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Mandala / Glow Texture */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217, 83, 30, 0.08) 0%, rgba(197, 155, 39, 0.05) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3rem'
        }}>
          {/* Left Hero Content */}
          <div>
            {/* Spiritual Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: '#FDF3E7',
              border: '1px solid rgba(217, 83, 30, 0.3)',
              borderRadius: 'var(--border-radius-full)',
              padding: '0.4rem 1.1rem',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 8px rgba(217, 83, 30, 0.08)'
            }}>
              <span className="diya-flame" style={{ fontSize: '1.1rem' }}>🪔</span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.92rem',
                fontWeight: '700',
                color: 'var(--color-saffron-dark)',
                letterSpacing: '0.5px'
              }}>
                {heroEyebrow}
              </span>
            </div>

            {/* Main Heading */}
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-primary)',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
              fontWeight: '800'
            }}>
              {heroTitle}
            </h1>

            {/* Subtitle Description */}
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: 'var(--text-brown)',
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              {heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={scrollToAbout}
                className="btn btn-lg btn-primary"
                style={{
                  boxShadow: '0 6px 18px rgba(122, 18, 29, 0.3)'
                }}
              >
                <span>{t('hero.exploreBtn')}</span>
                <ChevronRight size={18} />
              </button>

              <button
                onClick={onOpenDonationModal}
                className="btn btn-lg btn-green"
                style={{
                  boxShadow: '0 6px 18px rgba(45, 106, 79, 0.3)'
                }}
              >
                <Heart size={18} />
                <span>{t('hero.donateBtn')}</span>
              </button>

              {meetingData?.virtualMeeting?.isActive && (
                <a
                  href={meetingData.virtualMeeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg btn-outline-gold"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#9A7718'
                  }}
                >
                  <Video size={18} />
                  <span>{t('hero.meetingBtn')}</span>
                </a>
              )}
            </div>

            {/* Quick Micro Trust Indicators */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.88rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#2D6A4F', fontWeight: 'bold' }}>✓</span>
                <span>दैनिक नित्य पूजा</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#2D6A4F', fontWeight: 'bold' }}>✓</span>
                <span>१००% पारदर्शी सेवा</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#2D6A4F', fontWeight: 'bold' }}>✓</span>
                <span>वैदिक अनुष्ठान</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Real Vishwakarma Bhagwan Deity Presentation */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="deity-halo-container" style={{ width: '100%', maxWidth: '440px' }}>
              {/* Outer Traditional Golden Border Frame */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                padding: '10px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #DFB847 0%, #C59B27 40%, #7A121D 100%)',
                boxShadow: '0 16px 40px rgba(43, 30, 22, 0.18)'
              }}>
                <div style={{
                  backgroundColor: '#FAF7F2',
                  borderRadius: '22px',
                  padding: '6px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Real Deity Image */}
                  <img
                    src={heroImage}
                    alt="Lord Vishwakarma Bhagwan Idol - Chhapki, Saptari, Nepal"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '480px',
                      objectFit: 'cover',
                      borderRadius: '18px',
                      display: 'block',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />

                  {/* Respectful Deity Caption Ribbon */}
                  <div style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    right: '14px',
                    backgroundColor: 'rgba(88, 11, 20, 0.92)',
                    backdropFilter: 'blur(6px)',
                    color: '#F4EFE6',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(197, 155, 39, 0.4)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', fontWeight: '700', color: '#FFD166' }}>
                        श्री विश्वकर्मा भगवान
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                        गर्भगृह दिव्य विग्रह दर्शन • छापकी, सप्तरी
                      </div>
                    </div>
                    <span className="diya-flame" style={{ fontSize: '1.2rem' }}>🪔</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
