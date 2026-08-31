import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, ArrowLeft, Key } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@vishwakarmatemple.org');
  const [password, setPassword] = useState('TempleAdmin@2027');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      addToast('स्वागत छ! प्रशासक पोर्टलमा सफलतापूर्वक लगइन भयो।', 'success');
      navigate('/admin');
    } else {
      addToast(result.message || 'लगइन असफल भयो।', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Return to website link */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-primary)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}
      >
        <ArrowLeft size={16} />
        <span>मुख्य वेबसाइट फर्कनुहोस्</span>
      </Link>

      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid var(--border-gold)',
        padding: '2.5rem 2rem',
        boxShadow: '0 16px 40px rgba(43, 30, 22, 0.12)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/assets/images/temple-logo.svg"
            alt="Temple Logo"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              margin: '0 auto 1rem auto',
              boxShadow: '0 4px 14px rgba(122, 18, 29, 0.25)'
            }}
          />
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            color: 'var(--color-primary-dark)',
            marginBottom: '0.35rem'
          }}>
            {t('admin.loginTitle')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {t('admin.loginSubtitle')}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('admin.emailPlaceholder')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="admin@vishwakarmatemple.org"
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.passwordPlaceholder')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="••••••••"
                required
                style={{ paddingLeft: '2.4rem' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* Quick Demo Credentials Box */}
          <div style={{
            backgroundColor: 'var(--bg-cream-alt)',
            borderRadius: '10px',
            padding: '0.75rem',
            border: '1px solid var(--border-gold)',
            fontSize: '0.78rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '2px' }}>
              <Key size={13} />
              <span>पूर्वनिर्धारित प्रमाण (Default Credentials):</span>
            </div>
            <div>इमेल: <code>admin@vishwakarmatemple.org</code></div>
            <div>पासवर्ड: <code>TempleAdmin@2027</code></div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={loading}
          >
            <Shield size={18} />
            <span>{loading ? 'प्रमाणीकरण हुँदैछ...' : t('admin.loginBtn')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
