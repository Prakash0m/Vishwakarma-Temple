import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, MapPin, Video, Sparkles } from 'lucide-react';
import { getImageUrl } from '../../utils/imageOptimizer';

const EventsSection = ({ events }) => {
  const { language, t, getLocalized } = useLanguage();

  return (
    <section id="events" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span className="diya-flame">🚩</span>
            <span>{t('events.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('events.title')}</h2>
          <p className="section-subtitle">{t('events.subtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪷</span>
          </div>
        </div>

        {/* Events Grid with Interactive Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {events && events.length > 0 ? (
            events.map((event) => {
              const title = getLocalized(event, 'title', 'titleEnglish');
              const description = getLocalized(event, 'description', 'descriptionEnglish');
              const time = getLocalized(event, 'time', 'timeEnglish');
              const location = getLocalized(event, 'location', 'locationEnglish');
              const eventDate = new Date(event.date);

              return (
                <div
                  key={event._id}
                  className="temple-card card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Event Banner */}
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={getImageUrl(event.bannerImage)}
                      alt={title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/temple-structure.jpg';
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    
                    {/* Date Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      border: '1px solid var(--color-gold)'
                    }}>
                      <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
                        {eventDate.toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', lineHeight: 1 }}>
                        {eventDate.getDate()}
                      </div>
                    </div>

                    {/* Category Pill with Soft Animation */}
                    <div className="animate-float" style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(250, 247, 242, 0.95)',
                      color: 'var(--color-primary-dark)',
                      padding: '3px 9px',
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid var(--border-gold)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                      {event.category || 'उत्सव'}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
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
                      marginBottom: '1rem',
                      flex: 1
                    }}>
                      {description}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-brown)',
                      backgroundColor: 'var(--bg-cream-alt)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} color="#D9531E" />
                        <span>{time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={14} color="#2D6A4F" />
                        <span>{location}</span>
                      </div>
                    </div>

                    {event.meetingUrl ? (
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-shimmer"
                        style={{ width: '100%', gap: '0.5rem', minHeight: '44px' }}
                      >
                        <Video size={16} />
                        <span>{t('events.joinVirtualBtn')}</span>
                      </a>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        fontSize: '0.82rem',
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        padding: '0.5rem',
                        border: '1px dashed var(--border-maroon)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(122, 18, 29, 0.02)'
                      }}>
                        <Sparkles size={13} color="#D4AF37" />
                        <span>सबै भक्तजनहरू सादर आमन्त्रित हुनुहुन्छ</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              कार्यक्रमहरू लोड हुँदैछन्...
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
