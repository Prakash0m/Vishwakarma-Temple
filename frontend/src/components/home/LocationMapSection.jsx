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

        {/* View Mode Switcher Pill Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('streetview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '8px 20px',
              borderRadius: '30px',
              border: viewMode === 'streetview' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: viewMode === 'streetview' ? 'var(--color-primary)' : '#FFFFFF',
              color: viewMode === 'streetview' ? '#FFFFFF' : 'var(--text-brown)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'streetview' ? '0 6px 16px rgba(122, 18, 29, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Eye size={16} color={viewMode === 'streetview' ? '#FFD166' : 'var(--color-saffron)'} />
            <span>{language === 'ne' ? 'स्ट्रीट भ्यू ३६०° (Street View)' : 'Street View Visual 360°'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '8px 20px',
              borderRadius: '30px',
              border: viewMode === 'satellite' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: viewMode === 'satellite' ? 'var(--color-primary)' : '#FFFFFF',
              color: viewMode === 'satellite' ? '#FFFFFF' : 'var(--text-brown)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'satellite' ? '0 6px 16px rgba(122, 18, 29, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Globe size={16} color={viewMode === 'satellite' ? '#FFD166' : '#2D6A4F'} />
            <span>{language === 'ne' ? 'स्याटेलाइट दृश्य (Satellite 3D)' : 'Satellite 3D Visual'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '8px 20px',
              borderRadius: '30px',
              border: viewMode === 'map' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
              backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : '#FFFFFF',
              color: viewMode === 'map' ? '#FFFFFF' : 'var(--text-brown)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'map' ? '0 6px 16px rgba(122, 18, 29, 0.25)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <Layers size={16} color={viewMode === 'map' ? '#FFD166' : 'var(--color-primary)'} />
            <span>{language === 'ne' ? 'मानचित्र (Roadmap)' : 'Standard Roadmap'}</span>
          </button>
        </div>

        {/* Map & Direction Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {/* Left: Map Frame with Street View Visual Header */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            border: '2px solid var(--border-gold)',
            boxShadow: '0 12px 32px rgba(43, 30, 22, 0.15)',
            backgroundColor: '#1A1A1A',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '440px'
          }}>
            {/* Top Interactive Banner */}
            <div style={{
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              color: '#F4EFE6',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(197, 155, 39, 0.3)',
              fontSize: '0.85rem',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 8px #22C55E'
                }} />
                <strong>
                  {viewMode === 'streetview' 
                    ? (language === 'ne' ? 'इन्टर्याक्टिभ स्ट्रीट भ्यू • छापकी, सप्तरी' : 'Interactive Street View • Chhapki, Saptari')
                    : viewMode === 'satellite'
                      ? (language === 'ne' ? 'स्याटेलाइट त्रि-आयामिक दृश्य • छापकी' : 'Satellite 3D Surface • Chhapki')
                      : (language === 'ne' ? 'गुगल नेभिगेसन मानचित्र' : 'Google Navigation Map')}
                </strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: '#FFD166', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Compass size={14} /> 26.6052° N, 86.8144° E
                </span>
              </div>
            </div>

            {/* Embed Frame */}
            <div style={{ flex: 1, position: 'relative', minHeight: '380px' }}>
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
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(197, 155, 39, 0.3)',
              fontSize: '0.82rem',
              color: '#F4EFE6'
            }}>
              <span>{language === 'ne' ? 'छापकी (वडा नं. ५), सप्तरी' : 'Chhapki (Ward-5), Saptari, Nepal'}</span>
              <a
                href={streetViewDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#FFD166',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600'
                }}
              >
                <span>{language === 'ne' ? 'पूर्ण ३६०° दृश्य खोल्नुहोस्' : 'Open Full 360° View'}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Right: Visitor Directions, Settlement Highlight & Timings Card */}
          <div className="temple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <Navigation size={24} color="#7A121D" />
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  color: 'var(--color-primary-dark)'
                }}>
                  {language === 'ne' ? 'मन्दिर दर्शन तथा दिशानिर्देश' : 'Temple Darshan & Directions'}
                </h3>
              </div>

              {/* Settlement Highlight Box */}
              <div style={{
                backgroundColor: 'rgba(217, 83, 30, 0.08)',
                border: '2px solid var(--color-gold)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginBottom: '6px'
                }}>
                  ✨ {language === 'ne' ? 'विशेष अवस्थिति' : 'Key Settlement'}
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.05rem',
                  color: 'var(--color-primary)',
                  marginBottom: '4px'
                }}>
                  {language === 'ne' ? 'छापकी (Chhapki) - वडा नं. ५' : 'Chhapki Settlement - Ward No. 5'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-brown)', lineHeight: 1.5, margin: 0 }}>
                  {language === 'ne'
                    ? 'अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला (मधेश प्रदेश, नेपाल)।'
                    : 'Agnisair Krishnasavaran Rural Municipality, Saptari District (Madhesh Province, Nepal).'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-cream)',
                  padding: '0.9rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <MapPin size={20} color="#D9531E" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                      {language === 'ne' ? 'पूरा ठेगाना:' : 'Full Address:'}
                    </strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      {templeAddress}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-cream)',
                  padding: '0.9rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <Clock size={20} color="#2D6A4F" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>
                      {language === 'ne' ? 'दैनिक दर्शन समय:' : 'Darshan Hours:'}
                    </strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      {language === 'ne' ? 'दैनिक बिहान ६:०० देखि साँझ ७:०० सम्म खुला रहनेछ।' : 'Open daily from 6:00 AM to 7:00 PM.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}
              >
                <Navigation size={16} />
                <span>{t('locationContact.viewGoogleMaps')}</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={streetViewDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}
              >
                <Eye size={16} />
                <span>{language === 'ne' ? 'गुगल स्ट्रीट भ्यू ३६०° खोल्नुहोस्' : 'Open in Google Street View'}</span>
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
