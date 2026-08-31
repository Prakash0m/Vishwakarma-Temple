import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Save,
  ShieldCheck,
  Key
} from 'lucide-react';

const SettingsView = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        addToast('प्रशासक प्रोफाइल सफलतापूर्वक अद्यावधिक गरियो।', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'प्रोफाइल अद्यावधिक गर्न सकिएन।', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('नयाँ पासवर्डहरू मिलेनन्।', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast('पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ।', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        addToast('पासवर्ड सफलतापूर्वक परिवर्तन भयो।', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'पासवर्ड परिवर्तन गर्न सकिएन।', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
          प्रशासक खाता तथा सुरक्षा सेटिङ (Admin Account & Security)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          तपाईंको प्रशासक प्रोफाइल र पासवर्ड परिवर्तन गर्नुहोस्
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Profile Card */}
        <div className="temple-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid var(--border-gold)' }}>
            <User size={22} color="#7A121D" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
              प्रशासक प्रोफाइल (Profile Details)
            </h3>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">प्रशासकको पूरा नाम *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">इमेल ठेगाना *</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">फोन नम्बर</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '6px' }} disabled={savingProfile}>
              <Save size={16} />
              <span>{savingProfile ? 'सुरक्षित गर्दै...' : 'प्रोफाइल अद्यावधिक गर्नुहोस्'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="temple-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid var(--border-gold)' }}>
            <Lock size={22} color="#D9531E" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
              पासवर्ड परिवर्तन (Change Password)
            </h3>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label">हालको पासवर्ड (Current Password) *</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">नयाँ पासवर्ड (New Password) *</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">नयाँ पासवर्ड पुष्टि गर्नुहोस् (Confirm Password) *</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-saffron" style={{ width: '100%', gap: '6px' }} disabled={savingPassword}>
              <Key size={16} />
              <span>{savingPassword ? 'परिवर्तन गर्दै...' : 'पासवर्ड परिवर्तन गर्नुहोस्'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
