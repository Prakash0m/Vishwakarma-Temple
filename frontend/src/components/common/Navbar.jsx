import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Menu, X, Video, Heart, Globe, Shield, Phone, Clock, MapPin, DollarSign, Award } from 'lucide-react';

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
    ? (settings?.templeLocationNepali || 'छापकी-५, सप्तरी (मधेश प्रदेश)')
    : (settings?.templeLocationEnglish || 'Chhapki-5, Saptari (Madhesh Province)');

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
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.35rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '1rem'
        }}>
          {/* Left: Mantra & Timings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
              <span className="diya-flame" style={{ color: '#FFB703', fontSize: '0.9rem' }}>🪔</span>
              <span style={{ color: '#FDFBF7', letterSpacing: '0.3px' }}>{t('mantra')}</span>
            </div>
            <div className="top-timings-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#E8D5B5', fontSize: '0.76rem' }}>
              <Clock size={12} color="#DFB847" />
              <span>बिहान ६:०० – साँझ ७:००</span>
            </div>
          </div>

          {/* Right: Phone, Location & Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', whiteSpace: 'nowrap' }}>
            <a
              href="tel:+97721523456"
              className="top-phone-link"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F4EFE6', textDecoration: 'none', fontSize: '0.78rem' }}
            >
              <Phone size={12} color="#DFB847" />
              <span>+९७७-२१-५२३४५६</span>
            </a>

            <div className="top-location-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#DFB847', fontSize: '0.78rem' }}>
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
          maxWidth: '1360px',
          margin: '0 auto',
          padding: isScrolled ? '0.55rem 1.25rem' : '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
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
              flexShrink: 0
            }}
          >
            <div style={{
              width: isScrolled ? '40px' : '46px',
              height: isScrolled ? '40px' : '46px',
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

            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: isScrolled ? '1.15rem' : '1.25rem',
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
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap'
              }}>
                {templeCity}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-navbar-nav" style={{ display: 'none' }}>
            <ul style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
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
                        fontSize: '0.85rem',
                        fontWeight: isActive ? '700' : '600',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-brown)',
                        backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                        padding: '0.35rem 0.55rem',
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
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--border-radius-full)',
                backgroundColor: 'var(--bg-cream-alt)',
                border: '1.5px solid var(--border-gold)',
                color: 'var(--color-primary-dark)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              title="Switch Language / भाषा परिवर्तन"
            >
              <Globe size={13} color="#C59B27" />
              <span>{language === 'ne' ? 'English' : 'नेपाली'}</span>
            </button>

            {/* Pay Monthly Tole Fund Button */}
            <button
              onClick={onOpenToleFundModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.85rem',
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

            {/* Donate CTA Button (Green) */}
            <button
              onClick={onOpenDonationModal}
              className="btn btn-sm btn-green"
              style={{
                boxShadow: '0 3px 12px rgba(45, 106, 79, 0.25)',
                padding: '0.45rem 0.95rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                borderRadius: 'var(--border-radius-full)',
                whiteSpace: 'nowrap'
              }}
            >
              <Heart size={14} />
              <span>{t('nav.donateNow')}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
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
          top: isScrolled ? '60px' : '68px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(250, 247, 242, 0.98)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 890,
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}>
          <div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0, padding: 0 }}>
              {navLinks.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-primary-dark)',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      {item.label}
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
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
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
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            >
              <Heart size={18} />
              <span>{t('nav.donateNow')}</span>
            </button>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline-gold"
              style={{ width: '100%', justifyContent: 'center', backgroundColor: '#FFFFFF' }}
            >
              <Shield size={16} />
              <span>{t('nav.adminPortal')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Responsive Media Queries */}
      <style>{`
        @media (min-width: 1080px) {
          .desktop-navbar-nav {
            display: block !important;
          }
          .mobile-hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
