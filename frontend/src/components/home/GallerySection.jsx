import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ZoomIn } from 'lucide-react';
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

        {/* Category Filter Pills (App-like Smooth Horizontal Scroll) */}
        <div className="chip-scroll-container" style={{
          justifyContent: 'flex-start',
          marginBottom: '2rem',
          padding: '4px 2px 10px 2px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.84rem',
                fontWeight: '600',
                padding: '0.45rem 1rem',
                minHeight: '38px',
                borderRadius: 'var(--border-radius-full)',
                border: '1.5px solid',
                borderColor: activeCategory === cat.key ? 'var(--color-primary)' : 'var(--border-gold)',
                backgroundColor: activeCategory === cat.key ? 'var(--color-primary)' : '#FFFFFF',
                color: activeCategory === cat.key ? '#FFFFFF' : 'var(--text-brown)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 'clamp(0.75rem, 2vw, 1.5rem)'
        }}>
          {filteredGallery.length > 0 ? (
            filteredGallery.map((item) => {
              const title = getLocalized(item, 'title', 'titleEnglish');

              return (
                <div
                  key={item._id}
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-cream-alt)',
                    border: '1px solid var(--border-gold)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    height: 'clamp(180px, 28vw, 260px)'
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
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />

                  {/* Gradient Overlay & Hover Caption */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(88, 11, 20, 0.92) 0%, rgba(88, 11, 20, 0.3) 55%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '0.85rem',
                    color: '#FFFFFF'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px'
                    }}>
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <h4 style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.92rem',
                          fontWeight: '700',
                          color: '#FFD166',
                          lineHeight: 1.15,
                          marginBottom: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {title}
                        </h4>
                        <span style={{ fontSize: '0.7rem', opacity: 0.85, color: '#F4EFE6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {item.categoryNepali || item.category}
                        </span>
                      </div>
                      <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <ZoomIn size={14} />
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
