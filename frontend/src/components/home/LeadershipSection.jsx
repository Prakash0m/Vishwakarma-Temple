import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, ShieldCheck } from 'lucide-react';

const LeadershipSection = () => {
  const { language } = useLanguage();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveLeadership();
  }, []);

  const fetchActiveLeadership = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/leadership');
      if (res.data.success) {
        setCandidates(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching leadership:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && candidates.length === 0) {
    return null;
  }

  return (
    <section id="leadership" style={{ padding: 'clamp(2.5rem, 5vw, 4.5rem) 0', backgroundColor: '#FAF7F2', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="animate-float" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.95rem',
            backgroundColor: 'var(--color-primary-subtle)',
            borderRadius: '20px',
            color: 'var(--color-primary)',
            fontSize: '0.82rem',
            fontWeight: '700',
            marginBottom: '0.65rem',
            border: '1px solid rgba(122, 18, 29, 0.2)',
            boxShadow: '0 4px 12px rgba(122, 18, 29, 0.08)'
          }}>
            <ShieldCheck size={15} />
            <span>टोल नेतृत्व तथा कार्यसमिति</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.65rem, 4vw, 2.25rem)',
            color: 'var(--color-primary-dark)',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.2
          }}>
            {language === 'ne' ? 'छापकी टोल विकास समिति नेतृत्व' : 'Chhapki Tole Leadership Committee'}
          </h2>

          <p style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            {language === 'ne'
              ? 'टोलको चौतर्फी विकास, सामाजिक सद्भाव, मन्दिर संरक्षण र आर्थिक पारदर्शिताका लागि समर्पित ५ सदस्यीय नेतृत्व'
              : 'Dedicated 5-member leadership team committed to community development, temple preservation, and total transparency.'}
          </p>
        </div>

        {/* 5 Candidates Cards Grid with Interactive Hover */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          justifyContent: 'center'
        }}>
          {candidates.map((cand, idx) => {
            const imgSrc = cand.profileImage || '/assets/images/deity-portrait.jpg';
            const isLogo = imgSrc.includes('logo') || imgSrc.endsWith('.svg');

            return (
              <div
                key={cand._id}
                className="card-interactive"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--border-gold)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Order Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 2,
                  backgroundColor: 'rgba(122, 18, 29, 0.92)',
                  color: '#FFD166',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '14px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  #{idx + 1}
                </div>

                {/* Photo / Emblem Frame */}
                <div style={{
                  width: '100%',
                  height: '210px',
                  backgroundColor: isLogo ? '#38060D' : '#FAF7F2',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={imgSrc}
                    alt={cand.fullName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: isLogo ? 'contain' : 'cover',
                      objectPosition: isLogo ? 'center' : 'center 22%',
                      padding: isLogo ? '22px' : '0',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLogo) e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isLogo) e.target.style.transform = 'scale(1)';
                    }}
                    onError={(e) => { e.target.src = '/assets/images/deity-portrait.jpg'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(56, 6, 13, 0.88) 0%, rgba(56, 6, 13, 0.2) 40%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{ position: 'absolute', bottom: '8px', left: '10px', right: '10px', color: '#FFF' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#FFD166', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {cand.positionDevanagari || cand.position}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                      {cand.fullNameDevanagari || cand.fullName}
                    </div>
                  </div>
                </div>

                {/* Bio & Details */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#555',
                    lineHeight: 1.5,
                    margin: '0 0 0.85rem 0'
                  }}>
                    {cand.bio || 'छापकी टोलको विकास, धार्मिक अनुष्ठान तथा सामाजिक सद्भावमा निरन्तर क्रियाशील।'}
                  </p>

                  <div style={{
                    borderTop: '1px solid #F0ECE4',
                    paddingTop: '0.65rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    color: '#777'
                  }}>
                    <div>घर नं. <strong>{cand.houseNumber || '१०१'}</strong></div>
                    {cand.phone && (
                      <a
                        href={`tel:${cand.phone}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: 'var(--color-primary)',
                          fontWeight: '600',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-saffron)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      >
                        <Phone size={12} />
                        <span>{cand.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
