import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ZoomIn, Sparkles } from 'lucide-react';
import ImageLightbox from '../modals/ImageLightbox';

const GallerySection = ({ gallery }) => {
  const { language, t, getLocalized } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = [
    { key: 'All', label: t('gallery.all') },
    { key: 'Temple', label: t('gallery.temple') },
    { key: 'Bhagwan', label: t('gallery.bhagwan') },
    { key: 'Pooja', label: t('gallery.pooja') },
    { key: 'Events', label: t('gallery.events') },
    { key: 'Devotees', label: t('gallery.devotees') },
    { key: 'Donation', label: t('gallery.donation') },
    { key: 'Festival', label: t('gallery.festival') },
  ];

  const filteredGallery = gallery?.filter((img) => {
    if (activeCategory === 'All') return true;
    return img.category === activeCategory;
  }) || [];

  return (
    <section id="gallery" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>📷</span>
            <span>{t('gallery.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('gallery.title')}</h2>
          <p className="section-subtitle">{t('gallery.subtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪔</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          marginBottom: '2.5rem'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: '600',
                padding: '0.45rem 1.1rem',
                borderRadius: 'var(--border-radius-full)',
                border: '1.5px solid',
                borderColor: activeCategory === cat.key ? 'var(--color-primary)' : 'var(--border-gold)',
                backgroundColor: activeCategory === cat.key ? 'var(--color-primary)' : '#FFFFFF',
                color: activeCategory === cat.key ? '#FFFFFF' : 'var(--text-brown)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: activeCategory === cat.key ? '0 4px 12px rgba(122, 18, 29, 0.2)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredGallery.length > 0 ? (
            filteredGallery.map((item) => {
              const title = getLocalized(item, 'title', 'titleEnglish');

              return (
                <div
                  key={item._id}
                  style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-cream-alt)',
                    border: '1px solid var(--border-gold)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    height: '260px',
                    group: 'true'
                  }}
                  onClick={() => setLightboxImage(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />

                  {/* Gradient Overlay & Hover Caption */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(88, 11, 20, 0.9) 0%, rgba(88, 11, 20, 0.3) 50%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.25rem',
                    color: '#FFFFFF'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <h4 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.05rem',
                          fontWeight: '700',
                          color: '#FFD166',
                          lineHeight: 1.2,
                          marginBottom: '4px'
                        }}>
                          {title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', opacity: 0.85, color: '#F4EFE6' }}>
                          {item.categoryNepali || item.category}
                        </span>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '50%',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ZoomIn size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              यस वर्गमा कुनै तस्बिर उपलब्ध छैन।
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Component */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
};

export default GallerySection;
