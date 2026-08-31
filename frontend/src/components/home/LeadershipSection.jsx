import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Users, Phone, ShieldCheck, CheckCircle } from 'lucide-react';

const LeadershipSection = () => {
  const { t, language } = useLanguage();
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
    <section id="leadership" style={{ padding: '5rem 1.5rem', backgroundColor: '#FAF7F2', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.95rem',
            backgroundColor: 'var(--color-primary-subtle)',
            borderRadius: '20px',
            color: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            border: '1px solid rgba(122, 18, 29, 0.2)'
          }}>
            <ShieldCheck size={16} />
            <span>टोल नेतृत्व तथा कार्यसमिति</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.25rem',
            color: 'var(--color-primary-dark)',
            margin: '0 0 0.75rem 0'
          }}>
            {language === 'ne' ? 'छापकी टोल विकास समिति नेतृत्व' : 'Chhapki Tole Leadership Committee'}
          </h2>

          <p style={{
            fontSize: '1.05rem',
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

        {/* 5 Candidates Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          justifyContent: 'center'
        }}>
          {candidates.map((cand, idx) => (
            <div
              key={cand._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-gold)',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(122, 18, 29, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
              }}
            >
              {/* Order Number Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 2,
                backgroundColor: 'rgba(122, 18, 29, 0.9)',
                color: '#FFD166',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: '700',
                backdropFilter: 'blur(4px)'
              }}>
                #{idx + 1}
              </div>

              {/* Photo */}
              <div style={{ width: '100%', height: '220px', backgroundColor: '#F0ECE4', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={cand.profileImage || '/assets/images/deity-portrait.jpg'}
                  alt={cand.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/assets/images/deity-portrait.jpg'; }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(56, 6, 13, 0.8) 0%, transparent 60%)'
                }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', color: '#FFF' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFD166', textTransform: 'uppercase' }}>
                    {cand.positionDevanagari || cand.position}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '700', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                    {cand.fullNameDevanagari || cand.fullName}
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#555',
                  lineHeight: 1.5,
                  margin: '0 0 1rem 0'
                }}>
                  {cand.bio || 'छापकी टोलको विकास, धार्मिक अनुष्ठान तथा सामाजिक सद्भावमा निरन्तर क्रियाशील।'}
                </p>

                <div style={{
                  borderTop: '1px solid #F0ECE4',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#777'
                }}>
                  <div>घर नं. <strong>{cand.houseNumber || '१०१'}</strong></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                    <Phone size={13} />
                    <span>{cand.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
