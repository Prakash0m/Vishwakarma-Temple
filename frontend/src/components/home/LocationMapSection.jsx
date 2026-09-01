import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Navigation, Clock, ExternalLink, Eye, Globe, Compass, Layers } from 'lucide-react';

const LocationMapSection = ({ settings }) => {
  const { language, t } = useLanguage();
  const [viewMode, setViewMode] = useState('streetview'); // 'streetview' | 'satellite' | 'map'

  const templeAddress = language === 'ne'
    ? (settings?.addressNepali || 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला, मधेश प्रदेश, नेपाल')
    : (settings?.addressEnglish || 'Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District, Madhesh Province, Nepal');

  // Google Maps URLs
  const mapsUrl = settings?.googleMapsUrl || 'https://www.google.com/maps/place/Vishwakarma+Temple/@26.6052464,86.8144002,974m/';
  const streetViewDirectUrl = 'https://www.google.com/maps/@26.6052464,86.8144002,3a,75y,90t/data=!3m6!1e1!3m4!1s0x39ef0585fca58f8b:0xb3558fe3fa34b5c7!2e0!7i13312!8i6656';

  // Embed URLs for different visual modes
  const streetViewEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.298285514603!2d86.8144002!3d26.6052464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef0585fca58f8b%3A0xb3558fe3fa34b5c7!2sVishwakarma%20Temple!5e1!3m2!1sen!2snp!4v1709210000000!5m2!1sen!2snp';
  const satelliteEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.298285514603!2d86.8144002!3d26.6052464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef0585fca58f8b%3A0xb3558fe3fa34b5c7!2sVishwakarma%20Temple!5e1!3m2!1sen!2snp!4v1709210000000!5m2!1sen!2snp';
  const standardEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.298285514603!2d86.8144002!3d26.6052464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef0585fca58f8b%3A0xb3558fe3fa34b5c7!2sVishwakarma%20Temple!5e0!3m2!1sen!2snp!4v1709210000000!5m2!1sen!2snp';

  const currentEmbedUrl = viewMode === 'streetview' 
    ? streetViewEmbedUrl 
    : viewMode === 'satellite' 
      ? satelliteEmbedUrl 
      : standardEmbedUrl;

  return (
    <section id="location" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <MapPin size={16} />
            <span>{t('locationContact.locationEyebrow')}</span>
          </div>
          <h2 className="section-title">{t('locationContact.locationTitle')}</h2>
          <p className="section-subtitle" style={{ color: 'var(--color-primary-dark)', fontWeight: '600' }}>
            📍 {templeAddress}
          </p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪷</span>
          </div>
        </div>

        {/* View Mode Switcher Pill Tabs with App-like Chip Scroll */}
        <div className="chip-scroll-container" style={{
          justifyContent: 'center',
          marginBottom: '1.5rem',
          padding: '4px 2px 10px 2px'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('streetview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '6px 16px',
              minHeight: '38px',
              borderRadius: '30px',
              border: viewMode === 'streetview' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: viewMode === 'streetview' ? 'var(--color-primary)' : '#FFFFFF',
              color: viewMode === 'streetview' ? '#FFFFFF' : 'var(--text-brown)',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: viewMode === 'streetview' ? '0 6px 16px rgba(122, 18, 29, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Eye size={15} color={viewMode === 'streetview' ? '#FFD166' : 'var(--color-saffron)'} />
            <span>{language === 'ne' ? 'स्ट्रीट भ्यू ३६०°' : 'Street View 360°'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '6px 16px',
              minHeight: '38px',
              borderRadius: '30px',
              border: viewMode === 'satellite' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: viewMode === 'satellite' ? 'var(--color-primary)' : '#FFFFFF',
              color: viewMode === 'satellite' ? '#FFFFFF' : 'var(--text-brown)',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: viewMode === 'satellite' ? '0 6px 16px rgba(122, 18, 29, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Globe size={15} color={viewMode === 'satellite' ? '#FFD166' : '#2D6A4F'} />
            <span>{language === 'ne' ? 'स्याटेलाइट ३D' : 'Satellite 3D'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '6px 16px',
              minHeight: '38px',
              borderRadius: '30px',
              border: viewMode === 'map' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : '#FFFFFF',
              color: viewMode === 'map' ? '#FFFFFF' : 'var(--text-brown)',
              fontWeight: '700',
              fontSize: '0.84rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: viewMode === 'map' ? '0 6px 16px rgba(122, 18, 29, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Layers size={15} color={viewMode === 'map' ? '#FFD166' : 'var(--color-primary)'} />
            <span>{language === 'ne' ? 'मानचित्र (Map)' : 'Roadmap'}</span>
          </button>
        </div>

        {/* Map & Direction Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem',
          alignItems: 'stretch'
        }}>
          {/* Left: Map Frame with Street View Visual Header */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid var(--border-gold)',
            boxShadow: '0 12px 32px rgba(43, 30, 22, 0.15)',
            backgroundColor: '#1A1A1A',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: 'clamp(320px, 45vh, 420px)'
          }}>
            {/* Top Interactive Banner */}
            <div style={{
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              color: '#F4EFE6',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(197, 155, 39, 0.3)',
              fontSize: '0.8rem',
              zIndex: 2,
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 8px #22C55E',
                  flexShrink: 0
                }} />
                <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {viewMode === 'streetview' 
                    ? (language === 'ne' ? 'स्ट्रीट भ्यू • छापकी, सप्तरी' : 'Street View • Chhapki, Saptari')
                    : viewMode === 'satellite'
                      ? (language === 'ne' ? 'स्याटेलाइट • छापकी' : 'Satellite 3D • Chhapki')
                      : (language === 'ne' ? 'गुगल म्याप' : 'Google Map')}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.72rem', color: '#FFD166', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Compass size={12} /> 26.6052°N
                </span>
              </div>
            </div>

            {/* Embed Frame */}
            <div style={{ flex: 1, position: 'relative', minHeight: '260px' }}>
              <iframe
                title="Vishwakarma Temple Chhapki Saptari Street View Map"
                src={currentEmbedUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%'
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Quick Action Bar on Bottom */}
            <div style={{
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(197, 155, 39, 0.3)',
              fontSize: '0.78rem',
              color: '#F4EFE6',
              gap: '6px'
            }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {language === 'ne' ? 'छापकी-५, सप्तरी' : 'Chhapki-5, Saptari'}
              </span>
              <a
                href={streetViewDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#FFD166',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontWeight: '600',
                  flexShrink: 0
                }}
              >
                <span>{language === 'ne' ? 'पूर्ण ३६०°' : 'Full 360°'}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Right: Visitor Directions, Settlement Highlight & Timings Card */}
          <div className="temple-card" style={{ padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Navigation size={22} color="#7A121D" />
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--color-primary-dark)'
                }}>
                  {language === 'ne' ? 'मन्दिर दर्शन तथा दिशानिर्देश' : 'Temple Darshan & Directions'}
                </h3>
              </div>

              {/* Settlement Highlight Box */}
              <div style={{
                backgroundColor: 'rgba(217, 83, 30, 0.08)',
                border: '1.5px solid var(--color-gold)',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  marginBottom: '4px'
                }}>
                  ✨ {language === 'ne' ? 'विशेष अवस्थिति' : 'Key Settlement'}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.98rem',
                  color: 'var(--color-primary)',
                  marginBottom: '2px'
                }}>
                  {language === 'ne' ? 'छापकी (Chhapki) - वडा नं. ५' : 'Chhapki Settlement - Ward No. 5'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-brown)', lineHeight: 1.45, margin: 0 }}>
                  {language === 'ne'
                    ? 'अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला (मधेश प्रदेश, नेपाल)।'
                    : 'Agnisair Krishnasavaran Rural Municipality, Saptari District (Madhesh Province, Nepal).'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-cream)',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <MapPin size={18} color="#D9531E" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>
                      {language === 'ne' ? 'पूरा ठेगाना:' : 'Full Address:'}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      {templeAddress}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.65rem',
                  backgroundColor: 'var(--bg-cream)',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <Clock size={18} color="#2D6A4F" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>
                      {language === 'ne' ? 'दैनिक दर्शन समय:' : 'Darshan Hours:'}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      {language === 'ne' ? 'दैनिक बिहान ६:०० देखि साँझ ७:०० सम्म खुला।' : 'Open daily from 6:00 AM to 7:00 PM.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.4rem', justifyContent: 'center' }}
              >
                <Navigation size={16} />
                <span>{t('locationContact.viewGoogleMaps')}</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={streetViewDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ width: '100%', gap: '0.4rem', justifyContent: 'center', backgroundColor: '#FFFFFF' }}
              >
                <Eye size={16} />
                <span>{language === 'ne' ? 'गुगल ३६०° खोल्नुहोस्' : 'Open 360° Street View'}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMapSection;
