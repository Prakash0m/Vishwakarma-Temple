import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, Sparkles, Send } from 'lucide-react';
import { getImageUrl } from '../../utils/imageOptimizer';

const PoojaServicesSection = ({ poojas, onSelectPooja }) => {
  const { language, t, getLocalized } = useLanguage();

  return (
    <section id="pooja" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span className="diya-flame">🪔</span>
            <span>{t('pooja.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('pooja.title')}</h2>
          <p className="section-subtitle">{t('pooja.subtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">ॐ</span>
          </div>
        </div>

        {/* Pooja Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {poojas && poojas.length > 0 ? (
            poojas.map((item) => {
              const title = getLocalized(item, 'title', 'titleEnglish');
              const description = getLocalized(item, 'description', 'descriptionEnglish');
              const duration = getLocalized(item, 'duration', 'durationEnglish') || '४५ मिनेट';
              const image = item.image || '/assets/images/deity-altar-lamps.jpg';

              return (
                <div
                  key={item._id}
                  className="temple-card card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  {/* Card Image Banner */}
                  <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                    <img
                      src={getImageUrl(image)}
                      alt={title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/deity-altar-lamps.jpg';
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    
                    {/* Price Tag Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: 'var(--border-radius-full)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.88rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                      border: '1px solid var(--color-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>रु.</span>
                      <span>{item.price ? item.price.toLocaleString('ne-NP') : '५००'}</span>
                    </div>

                    {item.featured && (
                      <div className="animate-float" style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#FFB703',
                        color: '#1F1510',
                        padding: '4px 10px',
                        borderRadius: 'var(--border-radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(255, 183, 3, 0.4)'
                      }}>
                        <Sparkles size={12} />
                        <span>विशेष सेवा</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-saffron)',
                      fontWeight: '600',
                      marginBottom: '0.4rem'
                    }}>
                      <Clock size={13} />
                      <span>{t('pooja.durationLabel')} {duration}</span>
                    </div>

                    <h3 style={{
                      fontSize: '1.18rem',
                      color: 'var(--color-primary-dark)',
                      marginBottom: '0.5rem',
                      lineHeight: 1.25
                    }}>
                      {title}
                    </h3>

                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      marginBottom: '1.25rem',
                      flex: 1
                    }}>
                      {description}
                    </p>

                    {/* Booking Action Button with Hover Shimmer */}
                    <button
                      onClick={() => onSelectPooja(item)}
                      className="btn btn-outline btn-shimmer"
                      style={{
                        width: '100%',
                        backgroundColor: '#FFFFFF',
                        borderColor: 'var(--color-primary)',
                        gap: '0.5rem',
                        fontWeight: '600',
                        minHeight: '44px'
                      }}
                    >
                      <Send size={15} />
                      <span>{t('pooja.bookBtn')}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              पूजा सेवाहरू लोड हुँदैछन्...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PoojaServicesSection;
