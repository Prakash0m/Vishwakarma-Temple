import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, ChevronRight, Video } from 'lucide-react';
import { getImageUrl } from '../../utils/imageOptimizer';

// Outer 24-Ray Sacred Surya Chakra & Lotus Spoke Wheel
const OuterChakraSVG = () => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="outerChakraGold" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFE89E" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#D9531E" stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <circle cx="200" cy="200" r="192" stroke="url(#outerChakraGold)" strokeWidth="1.5" strokeDasharray="6 6" />
    <circle cx="200" cy="200" r="174" stroke="url(#outerChakraGold)" strokeWidth="2" />
    <circle cx="200" cy="200" r="150" stroke="url(#outerChakraGold)" strokeWidth="1" strokeDasharray="4 4" />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24;
      return (
        <g key={i} transform={`rotate(${angle} 200 200)`}>
          <path d="M 200 8 L 206 28 L 200 36 L 194 28 Z" fill="url(#outerChakraGold)" opacity="0.9" />
          <line x1="200" y1="36" x2="200" y2="174" stroke="url(#outerChakraGold)" strokeWidth="1" opacity="0.35" />
          <circle cx="200" cy="16" r="2.5" fill="#FFE89E" />
        </g>
      );
    })}
  </svg>
);

// Inner Concentric Sacred Mandala Geometry
const InnerMandalaSVG = () => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="innerMandalaGold" x1="300" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF2A3" stopOpacity="0.9" />
        <stop offset="60%" stopColor="#C59B27" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#B23D10" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <circle cx="150" cy="150" r="136" stroke="url(#innerMandalaGold)" strokeWidth="1.5" />
    <circle cx="150" cy="150" r="116" stroke="url(#innerMandalaGold)" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="150" cy="150" r="92" stroke="url(#innerMandalaGold)" strokeWidth="1.8" />
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 360) / 12;
      return (
        <g key={i} transform={`rotate(${angle} 150 150)`}>
          <path d="M 150 22 C 160 52 160 82 150 116 C 140 82 140 52 150 22 Z" stroke="url(#innerMandalaGold)" strokeWidth="1.2" fill="none" opacity="0.65" />
          <circle cx="150" cy="22" r="3" fill="#FFE89E" />
          <polygon points="150,34 154,44 146,44" fill="url(#innerMandalaGold)" />
        </g>
      );
    })}
  </svg>
);

const HeroSection = ({ settings, gallery = [], meetingData, onOpenDonationModal, onOpenToleFundModal }) => {
  const { language, t } = useLanguage();

  const heroEyebrow = language === 'ne'
    ? (settings?.heroEyebrowNepali || 'ॐ श्री विश्वकर्मणे नमः')
    : (settings?.heroEyebrowEnglish || 'Om Shri Vishwakarmane Namah');

  const heroTitle = language === 'ne'
    ? (settings?.heroTitleNepali || 'विश्वकर्मा भगवानको शरणमा स्वागत छ')
    : (settings?.heroTitleEnglish || 'Welcome to the Divine Presence of Lord Vishwakarma');

  const heroSubtitle = language === 'ne'
    ? (settings?.heroSubtitleNepali || 'सृष्टि, वास्तुकला, विज्ञान र शिल्पकलाका अधिष्ठाता भगवान विश्वकर्माको पवित्र प्राङ्गणमा हार्दिक नमन गर्दछौं।')
    : (settings?.heroSubtitleEnglish || 'Devoted to the divine supreme architect, engineer, and cosmic creator. Experience peace, prayers, and community harmony.');

  // High-Definition transparent PNG deity cutout seamlessly blending without any square box
  const fixedDeityImage = (settings?.heroImage && !settings.heroImage.includes('deity-portrait.jpg') && !settings.heroImage.includes('deity-cream-blend.jpg'))
    ? settings.heroImage
    : '/assets/images/deity-hd-transparent.png';

  const captionTitle = language === 'ne'
    ? 'गर्भगृह पञ्चदीप प्रज्वलन तथा पूजा आराधना'
    : 'Sanctum Panchadeep & Sacred Puja Darshan';

  const captionSubtitle = language === 'ne'
    ? 'पाँच दियोहरूको पवित्र ज्योति, नैवेद्य, फलफूल तथा कलश सहितको आरती स्वरूप।'
    : 'Divine Aarti with five sacred lamps, naivedya offerings, fruits & kalash.';


  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" style={{
      position: 'relative',
      paddingTop: 'clamp(2rem, 5vw, 3.5rem)',
      paddingBottom: 'clamp(2.5rem, 6vw, 4.5rem)',
      background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)',
      borderBottom: '1px solid var(--border-gold)',
      overflow: 'hidden'
    }}>
      {/* 1. Subtle Animated Sacred Background Radial Light */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: 'clamp(320px, 45vw, 600px)',
        height: 'clamp(320px, 45vw, 600px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 183, 3, 0.16) 0%, rgba(217, 83, 30, 0.08) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          alignItems: 'center',
          gap: 'clamp(2rem, 4vw, 3.5rem)'
        }}>
          {/* Left Hero Content */}
          <div>
            {/* Spiritual Eyebrow with Floating Levitation */}
            <div className="animate-float" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FDF3E7',
              border: '1px solid rgba(217, 83, 30, 0.35)',
              borderRadius: 'var(--border-radius-full)',
              padding: '0.35rem 0.95rem',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(217, 83, 30, 0.12)'
            }}>
              <span className="diya-flame" style={{ fontSize: '1.05rem' }}>🪔</span>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.8rem, 2vw, 0.92rem)',
                fontWeight: '700',
                color: 'var(--color-saffron-dark)',
                letterSpacing: '0.4px'
              }}>
                {heroEyebrow}
              </span>
            </div>

            {/* Main Heading */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-primary)',
              lineHeight: 1.2,
              marginBottom: '1rem',
              fontWeight: '800'
            }}>
              {heroTitle}
            </h1>

            {/* Subtitle Description */}
            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              lineHeight: 1.7,
              color: 'var(--text-brown)',
              marginBottom: '1.75rem',
              maxWidth: '560px'
            }}>
              {heroSubtitle}
            </p>

            {/* Action Buttons with Shimmer Waves */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <button
                onClick={scrollToAbout}
                className="btn btn-lg btn-primary btn-mobile-full btn-shimmer"
                style={{
                  boxShadow: '0 6px 18px rgba(122, 18, 29, 0.3)'
                }}
              >
                <span>{t('hero.exploreBtn')}</span>
                <ChevronRight size={18} />
              </button>

              <button
                onClick={onOpenDonationModal}
                className="btn btn-lg btn-green btn-mobile-full btn-shimmer"
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
                  className="btn btn-lg btn-outline-gold btn-mobile-full"
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

            {/* Quick Micro Trust Indicators Glassmorphic Bar */}
            <div style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'clamp(0.6rem, 1.8vw, 1.25rem)',
              marginTop: '1.75rem',
              padding: '0.6rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid var(--border-gold)',
              borderRadius: '12px',
              fontSize: 'clamp(0.78rem, 1.8vw, 0.85rem)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span className="live-pulse-dot" style={{ width: '7px', height: '7px', backgroundColor: '#2D6A4F', flexShrink: 0 }} />
                <span style={{ fontWeight: '600', color: 'var(--text-brown)' }}>
                  {language === 'ne' ? 'दैनिक नित्य पूजा' : 'Daily Vedic Puja'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: '#2D6A4F', fontWeight: '800', fontSize: '0.88rem' }}>✓</span>
                <span style={{ fontWeight: '600', color: 'var(--text-brown)' }}>
                  {language === 'ne' ? '१००% पारदर्शी सेवा' : '100% Transparent Seva'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ color: '#2D6A4F', fontWeight: '800', fontSize: '0.88rem' }}>✓</span>
                <span style={{ fontWeight: '600', color: 'var(--text-brown)' }}>
                  {language === 'ne' ? 'वैदिक अनुष्ठान' : 'Vedic Rituals'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero: SEAMLESS TRANSPARENT PNG DEITY CUTOUT (NO BOX) WITH ROTATING CHAKRA & PUSHPA VARSHA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
            
            <div className="divine-cutout-wrapper" style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              
              {/* 1. SACRED ROTATING SURYA CHAKRA MANDALA (Behind Deity) */}
              <div className="sacred-chakra-container" style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '520px',
                height: '520px',
                maxWidth: 'min(520px, 94vw)',
                maxHeight: 'min(520px, 94vw)',
                pointerEvents: 'none',
                zIndex: 0
              }}>
                {/* Breathing Golden Halo Glow Core */}
                <div className="chakra-glow-core" />
                {/* Outer 24-Spoke Surya Chakra (Clockwise Spin) */}
                <div className="chakra-spin-outer">
                  <OuterChakraSVG />
                </div>
                {/* Inner Sacred Mandala Wheel (Counter-Clockwise Spin) */}
                <div className="chakra-spin-inner">
                  <InnerMandalaSVG />
                </div>
              </div>

              {/* 2. PUSHPA VARSHA (Sacred Flower Petal Shower) */}
              <div className="flower-shower-viewport" style={{ position: 'absolute', inset: '-30px', pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
                {/* Petal 1: Golden Marigold */}
                <div className="sacred-petal petal-cascade-1 petal-marigold" style={{ top: '-10px', left: '12%', fontSize: '1.65rem', animationDelay: '0s' }}>
                  🌼
                </div>
                {/* Petal 2: Sacred Pink Lotus */}
                <div className="sacred-petal petal-cascade-2 petal-lotus" style={{ top: '-15px', left: '78%', fontSize: '1.75rem', animationDelay: '1.8s' }}>
                  🪷
                </div>
                {/* Petal 3: Fragrant Jasmine Petal */}
                <div className="sacred-petal petal-cascade-3 petal-jasmine" style={{ top: '-10px', left: '42%', fontSize: '1.35rem', animationDelay: '3.2s' }}>
                  🌸
                </div>
                {/* Petal 4: Red Hibiscus Petal */}
                <div className="sacred-petal petal-cascade-1 petal-lotus" style={{ top: '-20px', left: '88%', fontSize: '1.5rem', animationDelay: '4.5s' }}>
                  🌺
                </div>
                {/* Petal 5: Golden Marigold Petal */}
                <div className="sacred-petal petal-cascade-2 petal-marigold" style={{ top: '-10px', left: '8%', fontSize: '1.45rem', animationDelay: '2.4s' }}>
                  🌼
                </div>
                {/* Petal 6: Golden Divine Sparkle */}
                <div className="sacred-petal petal-cascade-3 petal-sparkle" style={{ top: '-10px', left: '62%', fontSize: '1.3rem', color: '#FFD166', animationDelay: '0.8s' }}>
                  ✨
                </div>
                {/* Petal 7: Scented Pink Petal */}
                <div className="sacred-petal petal-cascade-1 petal-jasmine" style={{ top: '-15px', left: '26%', fontSize: '1.4rem', animationDelay: '5.6s' }}>
                  🌸
                </div>
                {/* Petal 8: Sacred Lotus Blossom */}
                <div className="sacred-petal petal-cascade-2 petal-lotus" style={{ top: '-10px', left: '50%', fontSize: '1.6rem', animationDelay: '6.2s' }}>
                  🪷
                </div>
                {/* Petal 9: Divine Celestial Sparkle */}
                <div className="sacred-petal petal-cascade-3 petal-sparkle" style={{ top: '-10px', left: '18%', fontSize: '1.25rem', color: '#FFE082', animationDelay: '3.8s' }}>
                  ✨
                </div>
                {/* Petal 10: Red Hibiscus Blossom */}
                <div className="sacred-petal petal-cascade-2 petal-lotus" style={{ top: '-15px', left: '70%', fontSize: '1.5rem', animationDelay: '7.2s' }}>
                  🌺
                </div>

                {/* Ambient Corner Blooms */}
                <div className="sacred-petal petal-ambient petal-marigold" style={{ top: '6%', left: '-8px', fontSize: '1.4rem' }}>
                  🌼
                </div>
                <div className="sacred-petal petal-ambient petal-lotus" style={{ bottom: '22%', right: '-8px', fontSize: '1.5rem', animationDelay: '2.5s' }}>
                  🪷
                </div>
              </div>


              {/* 4. SEAMLESS PNG DEITY CUTOUT (NO BOX, NO FRAME) */}
              <div className="divine-deity-hero-image" style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                filter: 'drop-shadow(0 14px 28px rgba(43, 30, 22, 0.16)) drop-shadow(0 0 24px rgba(255, 183, 3, 0.22))'
              }}>
                <img
                  src={getImageUrl(fixedDeityImage)}
                  alt="भगवान श्री विश्वकर्मा गर्भगृह पञ्चदीप पूजा - छापकी, सप्तरी"
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.025)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/deity-hd-transparent.png';
                  }}
                />
              </div>

              {/* 5. Respectful Floating Deity Caption Ribbon */}
              <div style={{
                marginTop: '8px',
                width: '100%',
                maxWidth: '440px',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: 'var(--text-brown)',
                padding: '10px 16px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                border: '1.5px solid var(--border-gold)',
                boxShadow: '0 8px 24px rgba(43, 30, 22, 0.08)',
                zIndex: 4
              }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {captionTitle}
                  </div>
                  <div style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px'
                  }}>
                    {captionSubtitle}
                  </div>
                </div>
                <span className="diya-flame" style={{ fontSize: '1.25rem', flexShrink: 0 }}>🪔</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
