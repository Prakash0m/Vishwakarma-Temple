import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Mail, MapPin, Heart, Shield } from 'lucide-react';

const Footer = ({ settings, onOpenDonationModal }) => {
  const { language, t } = useLanguage();

  const templeTitle = language === 'ne'
    ? (settings?.templeNameNepali || 'विश्वकर्मा मन्दिर')
    : (settings?.templeNameEnglish || 'Vishwakarma Temple');

  const templeCity = language === 'ne'
    ? (settings?.templeLocationNepali || 'छापकी (वडा नं. ५), सप्तरी, नेपाल')
    : (settings?.templeLocationEnglish || 'Chhapki (Ward No. 5), Saptari, Nepal');

  const address = language === 'ne'
    ? (settings?.addressNepali || 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला, मधेश प्रदेश, नेपाल')
    : (settings?.addressEnglish || 'Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District, Madhesh Province, Nepal');

  const phone = settings?.phone || '+977-21-523456';
  const email = settings?.email || 'info@vishwakarmatemple.org.np';

  const socialLinks = settings?.socialLinks || {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com'
  };

  return (
    <footer style={{
      backgroundColor: '#38060D',
      color: '#F4EFE6',
      borderTop: '3px solid var(--color-gold)',
      paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
      paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Column 1: Temple Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <img
                src="/assets/images/temple-logo.svg"
                alt="Temple Logo"
                style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  color: '#FFD166',
                  lineHeight: 1.15,
                  margin: 0
                }}>
                  {templeTitle}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#DFB847' }}>{templeCity}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(244, 239, 230, 0.8)', marginBottom: '1.25rem' }}>
              सृष्टिकर्ता तथा शिल्पकलाका अधिष्ठाता भगवान विश्वकर्माको पवित्र मन्दिर। सनातन धर्म, वैदिक पूजा र जनसेवामा समर्पित।
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 209, 102, 0.1)',
              border: '1px solid rgba(255, 209, 102, 0.3)',
              padding: '0.3rem 0.8rem',
              borderRadius: 'var(--border-radius-full)',
              fontSize: '0.8rem',
              color: '#FFD166'
            }}>
              <span>🪔</span>
              <span>{t('footer.blessing')}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              color: '#FFD166',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(197, 155, 39, 0.3)',
              paddingBottom: '0.4rem'
            }}>
              {t('footer.quickLinks')}
            </h4>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <li>
                <a href="#about" style={{ color: 'rgba(244, 239, 230, 0.85)', display: 'block', padding: '2px 0' }}>
                  • {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="#pooja" style={{ color: 'rgba(244, 239, 230, 0.85)', display: 'block', padding: '2px 0' }}>
                  • {t('nav.pooja')}
                </a>
              </li>
              <li>
                <a href="#events" style={{ color: 'rgba(244, 239, 230, 0.85)', display: 'block', padding: '2px 0' }}>
                  • {t('nav.events')}
                </a>
              </li>
              <li>
                <a href="#gallery" style={{ color: 'rgba(244, 239, 230, 0.85)', display: 'block', padding: '2px 0' }}>
                  • {t('nav.gallery')}
                </a>
              </li>
              <li>
                <a href="#donation" style={{ color: 'rgba(244, 239, 230, 0.85)', display: 'block', padding: '2px 0' }}>
                  • {t('nav.donation')}
                </a>
              </li>
              <li>
                <a href="#transparency" style={{ color: 'rgba(244, 239, 230, 0.85)', display: 'block', padding: '2px 0' }}>
                  • {t('nav.transparency')}
                </a>
              </li>
              <li>
                <Link to="/admin" style={{ color: '#DFB847', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 0' }}>
                  <Shield size={13} />
                  <span>प्रशासक पोर्टल (Admin)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Temple Timings & Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              color: '#FFD166',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(197, 155, 39, 0.3)',
              paddingBottom: '0.4rem'
            }}>
              {t('footer.timings')} & {t('nav.contact')}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'rgba(244, 239, 230, 0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={15} color="#DFB847" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{address}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#DFB847" style={{ flexShrink: 0 }} />
                <a href={`tel:${phone}`} style={{ color: 'inherit' }}>{phone}</a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={15} color="#DFB847" style={{ flexShrink: 0 }} />
                <a href={`mailto:${email}`} style={{ color: 'inherit', wordBreak: 'break-all' }}>{email}</a>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                marginTop: '0.35rem',
                borderLeft: '3px solid #DFB847',
                fontSize: '0.8rem'
              }}>
                <strong>दर्शन समय:</strong> {t('footer.dailyTime')}
              </div>
            </div>
          </div>

          {/* Column 4: Social Media & Action */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              color: '#FFD166',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(197, 155, 39, 0.3)',
              paddingBottom: '0.4rem'
            }}>
              सामाजिक सञ्जाल (Social)
            </h4>

            <p style={{ fontSize: '0.84rem', color: 'rgba(244, 239, 230, 0.8)', marginBottom: '0.85rem' }}>
              मन्दिरका दैनिक आरती, प्रत्यक्ष दर्शन तथा आगामी कार्यक्रमहरूको जानकारी पाउन हामीसँग जोडिनुहोस्।
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'background 0.2s',
                    fontWeight: '700'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  f
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C0392B'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  ▶
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D9531E'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  📸
                </a>
              )}
            </div>

            <button
              onClick={onOpenDonationModal}
              className="btn btn-green btn-sm"
              style={{ width: '100%', gap: '0.4rem', minHeight: '42px', fontWeight: '700' }}
            >
              <Heart size={15} />
              <span>{t('nav.donateNow')}</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div style={{
          borderTop: '1px solid rgba(197, 155, 39, 0.25)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: 'rgba(244, 239, 230, 0.7)'
        }}>
          <div>{t('footer.copyright')}</div>
          <div style={{ color: '#FFD166', fontWeight: '600' }}>{t('footer.blessing')}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
