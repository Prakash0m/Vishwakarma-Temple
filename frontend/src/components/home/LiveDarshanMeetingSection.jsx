import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Video, Radio, Calendar, Clock, ExternalLink, Sparkles, Users } from 'lucide-react';

const LiveDarshanMeetingSection = ({ meetingData }) => {
  const { language, t, getLocalized } = useLanguage();

  const virtualMeeting = meetingData?.virtualMeeting;
  const liveDarshan = meetingData?.liveDarshan;

  if (!virtualMeeting?.isActive && !liveDarshan?.isActive) {
    return null;
  }

  const meetingTitle = virtualMeeting ? getLocalized(virtualMeeting, 'title', 'titleEnglish') : '';
  const meetingDesc = virtualMeeting ? getLocalized(virtualMeeting, 'description', 'descriptionEnglish') : '';
  const meetingTime = virtualMeeting ? getLocalized(virtualMeeting, 'time', 'timeEnglish') : '';

  const liveTitle = liveDarshan ? getLocalized(liveDarshan, 'title', 'titleEnglish') : '';
  const liveDesc = liveDarshan ? getLocalized(liveDarshan, 'description', 'descriptionEnglish') : '';
  const liveTime = liveDarshan ? getLocalized(liveDarshan, 'time', 'timeEnglish') : '';

  return (
    <section id="meeting" className="section" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <span>📹</span>
            <span>{t('meetingLive.eyebrow')}</span>
          </div>
          <h2 className="section-title">
            {language === 'ne' ? 'प्रत्यक्ष दर्शन तथा भर्चुअल मञ्च' : 'Live Darshan & Virtual Gathering'}
          </h2>
          <p className="section-subtitle">
            {language === 'ne'
              ? 'विश्वभर रहेका सम्पूर्ण श्रद्धालुहरूका लागि मन्दिरको प्रत्यक्ष दर्शन तथा नियमित भर्चुअल सत्संग।'
              : 'Connect directly to the sacred sanctum and participate in spiritual discussions from anywhere.'}
          </p>
          <div className="gold-divider">
            <span className="gold-divider-icon">🪔</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Card 1: Live Darshan */}
          {liveDarshan?.isActive && (
            <div className="temple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary-dark)',
                    padding: '0.35rem 0.9rem',
                    borderRadius: 'var(--border-radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}>
                    <Radio size={15} color="#7A121D" />
                    <span>{liveDarshan.platform || 'YouTube Live'}</span>
                  </div>

                  {liveDarshan.isLiveNow ? (
                    <span className="badge" style={{ backgroundColor: '#EF4444', color: '#FFFFFF', animation: 'pulse 2s infinite' }}>
                      ● {t('meetingLive.liveStatus')}
                    </span>
                  ) : (
                    <span className="badge badge-gold">
                      🕒 {t('meetingLive.offlineStatus')}
                    </span>
                  )}
                </div>

                <h3 style={{
                  fontSize: '1.4rem',
                  color: 'var(--color-primary)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.3
                }}>
                  {liveTitle}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {liveDesc}
                </p>

                {/* Sanctum Preview Thumbnail */}
                <div style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-gold)'
                }}>
                  <img
                    src="/assets/images/deity-sanctum.jpg"
                    alt="Live Darshan Stream Preview"
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(122, 18, 29, 0.9)',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: 'var(--border-radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      border: '1px solid var(--color-gold)'
                    }}>
                      <Radio size={16} />
                      <span>गर्भगृह प्रत्यक्ष आरती दर्शन</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  color: 'var(--text-brown)',
                  marginBottom: '1.5rem'
                }}>
                  <Clock size={16} color="#D9531E" />
                  <strong>आरती समय:</strong> <span>{liveTime}</span>
                </div>
              </div>

              <a
                href={liveDarshan.streamUrl || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <Radio size={16} />
                <span>{t('meetingLive.watchLiveBtn')}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Card 2: Virtual Meeting */}
          {virtualMeeting?.isActive && (
            <div className="temple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--color-gold-subtle)',
                    color: 'var(--color-gold-dark)',
                    padding: '0.35rem 0.9rem',
                    borderRadius: 'var(--border-radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}>
                    <Video size={15} />
                    <span>{virtualMeeting.platform || 'Google Meet'}</span>
                  </div>

                  <span className="badge badge-green">
                    👥 {t('meetingLive.todayMeeting')}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.4rem',
                  color: 'var(--color-primary-dark)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.3
                }}>
                  {meetingTitle}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {meetingDesc}
                </p>

                {/* Meeting Timing Strip */}
                <div style={{
                  backgroundColor: 'var(--bg-cream-alt)',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  border: '1px solid var(--border-gold)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <Calendar size={16} color="#7A121D" />
                    <strong>{virtualMeeting.date || 'प्रत्येक शनिबार'}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem' }}>
                    <Clock size={16} color="#D9531E" />
                    <span>{meetingTime || 'साँझ ६:०० देखि ७:०० सम्म'}</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Users size={16} color="#2D6A4F" />
                  <span>देश-विदेशका सम्पूर्ण भक्तजनहरू निःशुल्क सहभागी हुन सक्नुहुन्छ।</span>
                </div>
              </div>

              <a
                href={virtualMeeting.meetingUrl || 'https://meet.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-saffron"
                style={{ width: '100%' }}
              >
                <Video size={16} />
                <span>{t('meetingLive.joinMeetingBtn')}</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveDarshanMeetingSection;
