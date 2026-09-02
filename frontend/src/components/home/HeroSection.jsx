import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Sparkles, Video, ChevronRight, ChevronLeft, Eye, Play, Pause } from 'lucide-react';
import { getImageUrl } from '../../utils/imageOptimizer';

const DEFAULT_SLIDES = [
  {
    _id: 'default-1',
    title: 'भगवान श्री विश्वकर्माको मुख्य दिव्य विग्रह',
    subtitle: 'गर्भगृह दिव्य विग्रह दर्शन • छापकी, सप्तरी',
    imageUrl: '/assets/images/deity-portrait.jpg',
    categoryNepali: 'भगवान'
  },
  {
    _id: 'default-2',
    title: 'गर्भगृह पञ्चदीप प्रज्वलन तथा पूजा आराधना',
    subtitle: 'पाँच दियोहरूको पवित्र ज्योति एवं आरती स्वरूप',
    imageUrl: '/assets/images/deity-altar-lamps.jpg',
    categoryNepali: 'पूजा'
  },
  {
    _id: 'default-3',
    title: 'पवित्र मण्डप तथा पुष्प सज्जा दर्शन',
    subtitle: 'कमल, सयपत्री र गुलाफका मालाले सजिएको मण्डप',
    imageUrl: '/assets/images/deity-sanctum.jpg',
    categoryNepali: 'पूजा'
  },
  {
    _id: 'default-4',
    title: 'श्री विश्वकर्मा मन्दिर भवन तथा तुलसी मठ',
    subtitle: 'शिखर शैलीको मन्दिर भवन र खुला प्राङ्गण',
    imageUrl: '/assets/images/temple-structure.jpg',
    categoryNepali: 'मन्दिर'
  }
];

const HeroSection = ({ settings, gallery = [], meetingData, onOpenDonationModal }) => {
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

  // Extract slides from gallery (priority to featured, then all gallery items)
  const dynamicSlides = gallery && gallery.length > 0
    ? gallery.slice(0, 8).map(item => ({
        _id: item._id,
        title: item.title,
        subtitle: item.description || (item.categoryNepali ? `${item.categoryNepali} दर्शन • छापकी, सप्तरी` : 'पवित्र दर्शन'),
        imageUrl: item.imageUrl,
        categoryNepali: item.categoryNepali || item.category
      }))
    : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Autoplay Timer (4.5s interval)
  useEffect(() => {
    if (isPaused || dynamicSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dynamicSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, dynamicSlides.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? dynamicSlides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % dynamicSlides.length);
  };

  // Mobile Swipe Support
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) goToNext();
    if (diff < -50) goToPrev();
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSlide = dynamicSlides[currentIndex] || dynamicSlides[0];

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
        background: 'radial-gradient(circle, rgba(255, 183, 3, 0.12) 0%, rgba(217, 83, 30, 0.07) 40%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 2. Rotating Subtle Sacred Chakra Outline */}
      <div className="animate-spin-slow" style={{
        position: 'absolute',
        top: '5%',
        right: '4%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        border: '1px dashed rgba(197, 155, 39, 0.18)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          alignItems: 'center',
          gap: 'clamp(1.75rem, 4vw, 3rem)'
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

            {/* Quick Micro Trust Indicators */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'clamp(0.75rem, 2vw, 1.5rem)',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: 'clamp(0.8rem, 2vw, 0.88rem)',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span className="live-pulse-dot" />
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

          {/* Right Hero: DYNAMIC GALLERY IMAGE SLIDER (PART 18) */}
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Floating Spiritual Golden Sparks */}
            <div className="floating-sparkle-1" style={{ top: '6%', right: '12%' }}>
              <span style={{ fontSize: '1.2rem', color: '#FFD166', filter: 'drop-shadow(0 0 8px #FFAA00)' }}>✨</span>
            </div>
            <div className="floating-sparkle-2" style={{ bottom: '22%', left: '4%' }}>
              <span style={{ fontSize: '1.1rem', color: '#FFB703', filter: 'drop-shadow(0 0 6px #D9531E)' }}>🌸</span>
            </div>

            <div className="deity-halo-container" style={{ width: '100%', maxWidth: '440px' }}>
              {/* Animated Golden Shimmer Border Frame */}
              <div className="gold-shimmer-border" style={{
                position: 'relative',
                zIndex: 1,
                padding: '8px',
                borderRadius: '24px',
                boxShadow: '0 16px 40px rgba(43, 30, 22, 0.18)'
              }}>
                <div style={{
                  backgroundColor: '#FAF7F2',
                  borderRadius: '18px',
                  padding: '4px',
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '4 / 4.8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Real Dynamic Slider Image with Smooth Fade Transition */}
                  <img
                    key={currentSlide._id || currentIndex}
                    src={getImageUrl(currentSlide.imageUrl)}
                    alt={currentSlide.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 22%',
                      borderRadius: '14px',
                      display: 'block',
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/deity-portrait.jpg';
                    }}
                  />

                  {/* Previous Slide Button */}
                  {dynamicSlides.length > 1 && (
                    <button
                      onClick={goToPrev}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--color-primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 3,
                        transition: 'all 0.2s ease'
                      }}
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}

                  {/* Next Slide Button */}
                  {dynamicSlides.length > 1 && (
                    <button
                      onClick={goToNext}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--color-primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 3,
                        transition: 'all 0.2s ease'
                      }}
                      aria-label="Next Slide"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}

                  {/* Slide Category & Counter Top Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(10, 6, 4, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFD166',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{currentSlide.categoryNepali || 'दर्शन'}</span>
                    <span>•</span>
                    <span>{currentIndex + 1}/{dynamicSlides.length}</span>
                  </div>

                  {/* Respectful Deity Caption Ribbon */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(88, 11, 20, 0.94)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    color: '#F4EFE6',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    border: '1px solid rgba(197, 155, 39, 0.4)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 2
                  }}>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: '700', color: '#FFD166', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSlide.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSlide.subtitle}
                      </div>
                    </div>
                    <span className="diya-flame" style={{ fontSize: '1.1rem', flexShrink: 0 }}>🪔</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Dots Indicator & Thumbnail Navigation (PART 18) */}
            {dynamicSlides.length > 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '12px', zIndex: 2 }}>
                {/* Dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {dynamicSlides.map((slide, idx) => (
                    <button
                      key={slide._id || idx}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        width: currentIndex === idx ? '22px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: currentIndex === idx ? 'var(--color-primary)' : 'rgba(122, 18, 29, 0.25)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.3s ease'
                      }}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Mini Thumbnails */}
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '320px', padding: '2px' }}>
                  {dynamicSlides.map((slide, idx) => (
                    <button
                      key={'thumb-' + (slide._id || idx)}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        padding: 0,
                        border: currentIndex === idx ? '2px solid var(--color-primary)' : '1px solid var(--border-gold)',
                        opacity: currentIndex === idx ? 1 : 0.6,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                        backgroundColor: '#FAF7F2'
                      }}
                    >
                      <img
                        src={getImageUrl(slide.imageUrl)}
                        alt={`Thumb ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/temple-structure.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
