import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Clock, MapPin, Video, Sparkles } from 'lucide-react';

const EventsSection = ({ events }) => {
  const { language, t, getLocalized } = useLanguage();

  return (
    <section id="events" className="section section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>🚩</span>
            <span>{t('events.eyebrow')}</span>
          </div>
          <h2 className="section-title">{t('events.title')}</h2>
          <p className="section-subtitle">{t('events.subtitle')}</p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪷</span>
          </div>
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
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
                  className="temple-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Event Banner */}
                  <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                    <img
                      src={event.bannerImage || '/assets/images/temple-structure.jpg'}
                      alt={title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Date Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                      border: '1px solid var(--color-gold)'
                    }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                        {eventDate.toLocaleString('default', { month: 'short' })}
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', lineHeight: 1 }}>
                        {eventDate.getDate()}
                      </div>
                    </div>

                    {/* Category Pill */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      backgroundColor: 'rgba(250, 247, 242, 0.95)',
                      color: 'var(--color-primary-dark)',
                      padding: '4px 10px',
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      border: '1px solid var(--border-gold)'
                    }}>
                      {event.category || 'उत्सव'}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      color: 'var(--color-primary-dark)',
                      marginBottom: '0.75rem',
                      lineHeight: 1.3
                    }}>
                      {title}
                    </h3>

                    <p style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                      flex: 1
                    }}>
                      {description}
                    </p>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-brown)',
                      backgroundColor: 'var(--bg-cream-alt)',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={15} color="#D9531E" />
                        <span>{time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} color="#2D6A4F" />
                        <span>{location}</span>
                      </div>
                    </div>

                    {event.meetingUrl ? (
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ width: '100%', gap: '0.5rem' }}
                      >
                        <Video size={16} />
                        <span>{t('events.joinVirtualBtn')}</span>
                      </a>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.88rem',
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        padding: '0.5rem',
                        border: '1px dashed var(--border-maroon)',
                        borderRadius: '8px'
                      }}>
                        <Sparkles size={14} color="#D4AF37" />
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
