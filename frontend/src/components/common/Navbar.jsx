import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Menu, 
  X, 
  Heart, 
  Globe, 
  Shield, 
  Phone, 
  Clock, 
  MapPin, 
  Home, 
  Sparkles, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  ChevronRight, 
  Info,
  Compass
} from 'lucide-react';

const Navbar = ({ settings, meetingData, onOpenDonationModal, onOpenToleFundModal }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section on scroll
      const sections = ['hero', 'about', 'leadership', 'pooja', 'events', 'gallery', 'donation', 'transparency', 'location', 'contact'];
      const scrollPos = window.scrollY + 120;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'hero', label: t('nav.home'), icon: <Home size={19} color="#7A121D" />, href: '#hero' },
    { id: 'about', label: t('nav.about'), icon: <Info size={19} color="#D9531E" />, href: '#about' },
    { id: 'leadership', label: language === 'ne' ? 'टोल नेतृत्व' : 'Leadership', icon: <Users size={19} color="#C59B27" />, href: '#leadership' },
    { id: 'pooja', label: t('nav.pooja'), icon: <Sparkles size={19} color="#7A121D" />, href: '#pooja' },
    { id: 'events', label: t('nav.events'), icon: <Calendar size={19} color="#D9531E" />, href: '#events' },
    { id: 'gallery', label: t('nav.gallery'), icon: <ImageIcon size={19} color="#2D6A4F" />, href: '#gallery' },
    { id: 'transparency', label: t('nav.transparency'), icon: <FileText size={19} color="#2D6A4F" />, href: '#transparency' },
    { id: 'location', label: t('nav.location'), icon: <Compass size={19} color="#C59B27" />, href: '#location' },
    { id: 'contact', label: t('nav.contact'), icon: <Phone size={19} color="#580B14" />, href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const templeTitle = language === 'ne' 
    ? (settings?.templeNameNepali || 'विश्वकर्मा मन्दिर')
    : (settings?.templeNameEnglish || 'Vishwakarma Temple');

  const templeCity = language === 'ne'
    ? (settings?.templeLocationNepali || 'छापकी-५, सप्तरी (नेपाल)')
    : (settings?.templeLocationEnglish || 'Chhapki-5, Saptari, Nepal');

  return (
    <>
      {/* 1. Top Spiritual Mantra & Info Strip */}
      <div style={{
        backgroundColor: '#580B14',
        color: '#FAF7F2',
        fontSize: '0.8rem',
        borderBottom: '1px solid rgba(197, 155, 39, 0.35)',
        position: 'relative',
        zIndex: 910
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.35rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '0.75rem',
          overflow: 'hidden'
        }}>
          {/* Left: Mantra */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', whiteSpace: 'nowrap', minWidth: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
              <span className="diya-flame" style={{ color: '#FFB703', fontSize: '0.9rem', flexShrink: 0 }}>🪔</span>
              <span style={{ color: '#FDFBF7', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                {t('mantra')}
              </span>
            </div>
            <div className="top-timings-badge desktop-only-strip" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#E8D5B5', fontSize: '0.76rem' }}>
              <Clock size={12} color="#DFB847" />
              <span>बिहान ६:०० – साँझ ७:००</span>
            </div>
          </div>

          {/* Right: Phone, Location & Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <a
              href="tel:+97721523456"
              className="top-phone-link desktop-only-strip"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F4EFE6', textDecoration: 'none', fontSize: '0.78rem' }}
            >
              <Phone size={12} color="#DFB847" />
              <span>+९७७-२१-५२३४५६</span>
            </a>

            <div className="top-location-badge desktop-only-strip" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#DFB847', fontSize: '0.78rem' }}>
              <MapPin size={12} />
              <span>{templeCity}</span>
            </div>

            <Link
              to="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'rgba(197, 155, 39, 0.2)',
                color: '#F4EFE6',
                textDecoration: 'none',
                padding: '0.15rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid rgba(197, 155, 39, 0.4)',
                fontSize: '0.74rem',
                fontWeight: '600',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-gold)';
                e.currentTarget.style.color = '#580B14';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(197, 155, 39, 0.2)';
                e.currentTarget.style.color = '#F4EFE6';
              }}
            >
              <Shield size={11} />
              <span>{t('nav.adminPortal')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: isScrolled ? 'rgba(250, 247, 242, 0.98)' : 'var(--bg-cream)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(43, 30, 22, 0.08)' : '0 1px 0 var(--border-gold)',
        borderBottom: '1px solid var(--border-gold)',
        transition: 'all 0.25s ease'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: isScrolled ? '0.45rem 1.25rem' : '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem',
          transition: 'all 0.25s ease'
        }}>
          {/* Logo & Brand Name */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              flexShrink: 0,
              minWidth: 'max-content'
            }}
          >
            <div style={{
              width: isScrolled ? '38px' : '44px',
              height: isScrolled ? '38px' : '44px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(122, 18, 29, 0.2)',
              overflow: 'hidden',
              flexShrink: 0,
              transition: 'all 0.25s ease'
            }}>
              <img
                src="/assets/images/temple-logo.svg"
                alt="Temple Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isScrolled ? '1.1rem' : '1.22rem',
                fontWeight: '700',
                color: 'var(--color-primary-dark)',
                lineHeight: 1.15,
                whiteSpace: 'nowrap'
              }}>
                {templeTitle}
              </div>
              <div style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontWeight: '500',
                letterSpacing: '0.2px',
                whiteSpace: 'nowrap'
              }}>
                {templeCity}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (Visible on Large Screens >= 1200px) */}
          <nav className="desktop-navbar-nav" style={{ display: 'none', flexShrink: 1, overflow: 'hidden' }}>
            <ul style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.15rem',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.76rem, 0.86vw, 0.82rem)',
                        fontWeight: isActive ? '700' : '600',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-brown)',
                        backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                        padding: '0.28rem 0.38rem',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--color-primary)';
                          e.currentTarget.style.backgroundColor = 'rgba(122, 18, 29, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--text-brown)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                padding: '0.35rem 0.75rem',
                minHeight: '36px',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: 'var(--bg-cream-alt)',
                border: '1.5px solid var(--border-gold)',
                color: 'var(--color-primary-dark)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              title="Switch Language / भाषा परिवर्तन"
            >
              <Globe size={14} color="#C59B27" />
              <span>{language === 'ne' ? 'English' : 'नेपाली'}</span>
            </button>

            {/* Desktop Only: Pay Monthly Tole Fund Button */}
            <button
              onClick={onOpenToleFundModal}
              className="desktop-only-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.84rem',
                fontWeight: '700',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: '#FAF7F2',
                border: '1.5px solid var(--color-primary)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = '#FFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FAF7F2';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
            >
              <span style={{ fontWeight: '800', fontSize: '0.84rem' }}>{language === 'ne' ? 'रु.' : 'Rs.'}</span>
              <span>{language === 'ne' ? 'टोल कोष' : 'Tole Fund'}</span>
            </button>

            {/* Desktop Only: Donate CTA Button */}
            <button
              onClick={onOpenDonationModal}
              className="btn btn-sm btn-green desktop-only-btn"
              style={{
                boxShadow: '0 3px 12px rgba(45, 106, 79, 0.25)',
                padding: '0.45rem 0.95rem',
                fontSize: '0.84rem',
                fontWeight: '700',
                borderRadius: 'var(--border-radius-full)',
                whiteSpace: 'nowrap'
              }}
            >
              <Heart size={14} />
              <span>{t('nav.donateNow')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. SIMPLE DIGITAL MOBILE APP HUB (Clean, Modern, Native App Bottom Sheet) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 950,
          backgroundColor: 'rgba(20, 10, 8, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.22s ease-out'
        }}
        onClick={() => setMobileMenuOpen(false)}
        >
          {/* Bottom Sheet Modal Container */}
          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '24px 24px 0 0',
              maxHeight: '88vh',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.35)',
              borderTop: '2px solid var(--color-gold)',
              overflow: 'hidden',
              animation: 'slideUpSheet 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              paddingBottom: 'calc(68px + env(safe-area-inset-bottom, 0px))'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Clean Header */}
            <div style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid var(--border-gold)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {/* Handle Bar */}
              <div style={{
                width: '38px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'rgba(197, 155, 39, 0.5)',
                marginBottom: '0.6rem'
              }} />

              {/* Title & Close */}
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img src="/assets/images/temple-logo.svg" alt="Logo" style={{ width: '85%', height: '85%' }} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: 'var(--color-primary-dark)',
                      lineHeight: 1.15
                    }}>
                      {templeTitle}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {templeCity}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-cream-alt)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    cursor: 'pointer'
                  }}
                  aria-label="Close Menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Clean Segmented Language Bar */}
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-cream-alt)',
                borderRadius: '10px',
                padding: '3px',
                marginTop: '0.75rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <button
                  onClick={() => { if (language !== 'ne') toggleLanguage(); }}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: language === 'ne' ? '800' : '600',
                    backgroundColor: language === 'ne' ? 'var(--color-primary)' : 'transparent',
                    color: language === 'ne' ? '#FFFFFF' : 'var(--text-brown)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🇳🇵 नेपाली
                </button>
                <button
                  onClick={() => { if (language !== 'en') toggleLanguage(); }}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: language === 'en' ? '800' : '600',
                    backgroundColor: language === 'en' ? 'var(--color-primary)' : 'transparent',
                    color: language === 'en' ? '#FFFFFF' : 'var(--text-brown)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🌐 English
                </button>
              </div>
            </div>

            {/* Scrollable Clean App Hub Body */}
            <div style={{
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              
              {/* 2 Big Primary Digital Action Cards (Tole Fund & Donate) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.65rem'
              }}>
                {/* 1. Tole Fund Card */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenToleFundModal) onOpenToleFundModal();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #7A121D 0%, #580B14 100%)',
                    color: '#FFFFFF',
                    padding: '0.85rem 0.8rem',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(255, 215, 0, 0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(122, 18, 29, 0.2)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    color: '#FFE89E'
                  }}>
                    {language === 'ne' ? 'रु.' : 'Rs.'}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', lineHeight: 1.2 }}>
                    {language === 'ne' ? 'मासिक टोल कोष' : 'Monthly Tole Fund'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#FFE89E', opacity: 0.9 }}>
                    {language === 'ne' ? 'भुक्तानी गर्नुहोस् →' : 'Pay Online →'}
                  </div>
                </button>

                {/* 2. Donate Card */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDonationModal();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)',
                    color: '#FFFFFF',
                    padding: '0.85rem 0.8rem',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(82, 183, 136, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                    boxShadow: '0 4px 14px rgba(45, 106, 79, 0.2)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D8F3DC'
                  }}>
                    <Heart size={18} />
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', lineHeight: 1.2 }}>
                    {language === 'ne' ? 'दान तथा चन्दा' : 'Temple Donation'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#D8F3DC', opacity: 0.9 }}>
                    {language === 'ne' ? 'सेवा गर्नुहोस् →' : 'Donate Seva →'}
                  </div>
                </button>
              </div>

              {/* Clean Digital Navigation Links (2-Column Grid) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                {navLinks.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      style={{
                        backgroundColor: isActive ? 'var(--color-primary-subtle)' : '#FFFFFF',
                        borderRadius: '12px',
                        padding: '0.75rem 0.75rem',
                        textDecoration: 'none',
                        border: isActive ? '1.5px solid var(--color-primary)' : '1px solid var(--border-gold)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: isActive ? '#FFFFFF' : 'var(--bg-cream)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </div>

                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: isActive ? '800' : '700',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-brown)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.label}
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Clean Footer Utilities (Admin & Hotline) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                paddingTop: '0.2rem'
              }}>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-primary)',
                    border: '1.5px solid var(--border-gold)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    textDecoration: 'none',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <Shield size={16} color="#7A121D" />
                  <span>{t('nav.adminPortal')}</span>
                </Link>

                <a
                  href="tel:+97721523456"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-saffron-dark)',
                    border: '1.5px solid var(--border-gold)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    textDecoration: 'none',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <Phone size={16} color="#D9531E" />
                  <span>+९७७-२१-५२३४५६</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. Native-Feel Mobile App Bottom Bar (Single Primary Navigation) */}
      <div className="mobile-app-bottom-bar">
        <button
          className={`mobile-bottom-item ${activeSection === 'hero' && !mobileMenuOpen ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, '#hero')}
        >
          <Home size={20} />
          <span>{language === 'ne' ? 'गृह' : 'Home'}</span>
        </button>

        <button
          className={`mobile-bottom-item ${activeSection === 'pooja' && !mobileMenuOpen ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, '#pooja')}
        >
          <Sparkles size={20} />
          <span>{language === 'ne' ? 'पूजा' : 'Pooja'}</span>
        </button>

        <button
          className="mobile-bottom-item"
          onClick={() => {
            if (onOpenToleFundModal) onOpenToleFundModal();
          }}
          style={{ color: '#FFD166' }}
        >
          <span style={{ fontWeight: '800', fontSize: '1.05rem', lineHeight: '1' }}>{language === 'ne' ? 'रु.' : 'Rs.'}</span>
          <span>{language === 'ne' ? 'टोल कोष' : 'Tole Fund'}</span>
        </button>

        <button
          className="mobile-bottom-item donate-item"
          onClick={onOpenDonationModal}
        >
          <Heart size={20} />
          <span>{language === 'ne' ? 'दान' : 'Donate'}</span>
        </button>

        <button
          className={`mobile-bottom-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>{language === 'ne' ? 'मेनु' : 'Menu'}</span>
        </button>
      </div>

      {/* Responsive Media Queries */}
      <style>{`
        @media (min-width: 1200px) {
          .desktop-navbar-nav {
            display: block !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-only-btn {
            display: none !important;
          }
          .desktop-only-strip {
            display: none !important;
          }
        }
        @keyframes slideUpSheet {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
