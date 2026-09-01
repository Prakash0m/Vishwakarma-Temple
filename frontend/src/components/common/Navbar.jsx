import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X, Heart, Globe, Shield, Phone, Clock, MapPin, DollarSign, Home, Sparkles } from 'lucide-react';

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

  const navLinks = [
    { id: 'hero', label: t('nav.home'), href: '#hero' },
    { id: 'about', label: t('nav.about'), href: '#about' },
    { id: 'leadership', label: language === 'ne' ? 'टोल नेतृत्व' : 'Leadership', href: '#leadership' },
    { id: 'pooja', label: t('nav.pooja'), href: '#pooja' },
    { id: 'events', label: t('nav.events'), href: '#events' },
    { id: 'gallery', label: t('nav.gallery'), href: '#gallery' },
    { id: 'donation', label: t('nav.donation'), href: '#donation' },
    { id: 'transparency', label: t('nav.transparency'), href: '#transparency' },
    { id: 'location', label: t('nav.location'), href: '#location' },
    { id: 'contact', label: t('nav.contact'), href: '#contact' },
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
          {/* Logo & Brand Name (Zero Truncation Guaranteed) */}
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
              <DollarSign size={14} />
              <span>{language === 'ne' ? 'मासिक टोल कोष' : 'Tole Fund'}</span>
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

            {/* Hamburger Toggle (Visible when desktop nav is hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '1.5px solid var(--border-gold)',
                borderRadius: '8px',
                padding: '6px',
                minHeight: '40px',
                minWidth: '40px',
                color: 'var(--color-primary)',
                cursor: 'pointer'
              }}
              className="mobile-hamburger-btn"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: isScrolled ? '56px' : '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(250, 247, 242, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 915,
          padding: '1.25rem 1.25rem calc(70px + env(safe-area-inset-bottom, 0px)) 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: 'var(--color-saffron-dark)',
              letterSpacing: '0.8px',
              marginBottom: '0.75rem',
              paddingLeft: '0.5rem'
            }}>
              {language === 'ne' ? 'नेभिगेसन मेनु' : 'Navigation Menu'}
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem', margin: 0, padding: 0 }}>
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-brown)',
                        padding: '0.75rem 0.85rem',
                        borderRadius: '10px',
                        backgroundColor: isActive ? 'var(--color-primary-subtle)' : '#FFFFFF',
                        border: isActive ? '1px solid rgba(122, 18, 29, 0.2)' : '1px solid var(--border-subtle)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <span>{item.label}</span>
                      {isActive && <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>●</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-gold)' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenToleFundModal) onOpenToleFundModal();
              }}
              style={{
                width: '100%',
                padding: '0.85rem',
                minHeight: '46px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
                fontWeight: '700',
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(122, 18, 29, 0.25)'
              }}
            >
              <DollarSign size={18} />
              <span>{language === 'ne' ? 'मासिक टोल कोष बुझाउनुहोस्' : 'Pay Monthly Tole Fund'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonationModal();
              }}
              className="btn btn-green"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', minHeight: '46px', fontSize: '0.95rem' }}
            >
              <Heart size={18} />
              <span>{t('nav.donateNow')}</span>
            </button>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline-gold"
              style={{ width: '100%', justifyContent: 'center', backgroundColor: '#FFFFFF', minHeight: '44px', fontSize: '0.9rem' }}
            >
              <Shield size={16} />
              <span>{t('nav.adminPortal')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Native-Feel Mobile App Bottom Bar */}
      <div className="mobile-app-bottom-bar">
        <button
          className={`mobile-bottom-item ${activeSection === 'hero' ? 'active' : ''}`}
          onClick={(e) => handleNavClick(e, '#hero')}
        >
          <Home size={20} />
          <span>{language === 'ne' ? 'गृह' : 'Home'}</span>
        </button>

        <button
          className={`mobile-bottom-item ${activeSection === 'pooja' ? 'active' : ''}`}
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
          <DollarSign size={21} />
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
          .mobile-hamburger-btn {
            display: none !important;
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
      `}</style>
    </>
  );
};

export default Navbar;
