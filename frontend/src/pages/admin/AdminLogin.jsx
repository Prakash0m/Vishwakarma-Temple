import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      addToast('कृपया इमेल र पासवर्ड प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      addToast('स्वागत छ! प्रशासक पोर्टलमा सफलतापूर्वक लगइन भयो।', 'success');
      navigate('/admin');
    } else {
      addToast(result.message || 'लगइन असफल भयो। कृपया आफ्नो इमेल र पासवर्ड जाँच गर्नुहोस्।', 'error');
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
          fontWeight: '600',
          padding: '8px 14px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease'
        }}
      >
        <ArrowLeft size={16} />
        <span>{language === 'ne' ? 'मुख्य वेबसाइट फर्कनुहोस्' : 'Back to Website'}</span>
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
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: '600', marginBottom: '0.4rem', display: 'block', fontSize: '0.9rem' }}>
              {t('admin.emailPlaceholder')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder={language === 'ne' ? 'प्रशासक इमेल प्रविष्ट गर्नुहोस्' : 'Enter administrator email'}
                autoComplete="email"
                required
                style={{ paddingLeft: '2.4rem', height: '48px', borderRadius: '12px', fontSize: '0.95rem' }}
              />
              <Mail size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ fontWeight: '600', marginBottom: '0.4rem', display: 'block', fontSize: '0.9rem' }}>
              {t('admin.passwordPlaceholder')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder={language === 'ne' ? 'पासवर्ड प्रविष्ट गर्नुहोस्' : 'Enter password'}
                autoComplete="current-password"
                required
                style={{ paddingLeft: '2.4rem', paddingRight: '2.6rem', height: '48px', borderRadius: '12px', fontSize: '0.95rem' }}
              />
              <Lock size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '15px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={loading}
          >
            <Shield size={18} />
            <span>{loading ? (language === 'ne' ? 'प्रमाणीकरण हुँदैछ...' : 'Authenticating...') : t('admin.loginBtn')}</span>
          </button>
        </form>

        {/* Secure Access Footer */}
        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <Shield size={13} color="var(--color-primary)" />
          <span>{language === 'ne' ? 'सुरक्षित प्रशासकीय पहुँच नियन्त्रण प्रणाली' : 'Secure Administrative Access Control'}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
