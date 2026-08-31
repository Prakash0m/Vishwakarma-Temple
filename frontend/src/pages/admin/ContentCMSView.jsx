import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  FileText,
  Save,
  Eye,
  Sliders,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Shield
} from 'lucide-react';

const ContentCMSView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    templeNameNepali: 'विश्वकर्मा मन्दिर',
    templeNameEnglish: 'Vishwakarma Temple',
    heroEyebrowNepali: 'ॐ श्री विश्वकर्मणे नमः',
    heroTitleNepali: 'विश्वकर्मा भगवानको शरणमा स्वागत छ',
    heroTitleEnglish: 'Welcome to the Divine Presence of Lord Vishwakarma',
    heroSubtitleNepali: '',
    heroSubtitleEnglish: '',
    heroImage: '/assets/images/deity-portrait.jpg',
    aboutTitleNepali: 'हाम्रो मन्दिरको बारेमा',
    aboutTitleEnglish: 'About Vishwakarma Temple',
    aboutDescriptionNepali: '',
    aboutDescriptionEnglish: '',
    aboutImage: '/assets/images/temple-structure.jpg',
    establishedYear: '२०५५ (1998 AD)',
    devoteesCount: '१०,०००+',
    annualEventsCount: '२४+',
    communityProjectsCount: '१००% पारदर्शी',
    dailyPoojaTimeNepali: 'बिहान ६:०० देखि साँझ ७:०० सम्म',
    specialPoojaTimeNepali: 'प्रत्येक शनिबार तथा संक्रान्ति',
    phone: '+९७७-३१-५२०१२३',
    secondaryPhone: '+९७७ ९८५२८९९९९९',
    email: 'info@vishwakarmatemple.org.np',
    addressNepali: 'छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी जिल्ला, मधेश प्रदेश, नेपाल',
    addressEnglish: 'Chhapki (Ward No. 5), Agnisair Krishnasavaran Rural Municipality, Saptari District, Madhesh Province, Nepal',
    googleMapsUrl: 'https://www.google.com/maps/place/Vishwakarma+Temple/@26.6052464,86.8144002,974m/',
    donorPrivacyDisplay: 'public',
    showDonationSection: true,
    showDonorList: true,
    showLiveDarshan: true,
    showMeeting: true,
    showEvents: true,
    showGallery: true,
    showTransparency: true,
    showPooja: true,
    transparencyNoticeNepali: 'मन्दिरका आर्थिक गतिविधिहरू पारदर्शी र व्यवस्थित रूपमा व्यवस्थापन गरिन्छ।'
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data.success && res.data.data) {
        setSettings(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      addToast('सामग्री सेटिङ लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        addToast('वेबसाइट सामग्री तथा सेक्सन सेटिङ सफलतापूर्वक सुरक्षित गरियो।', 'success');
      }
    } catch (err) {
      addToast('सामग्री सुरक्षित गर्न सकिएन।', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>लोड हुँदैछ...</div>;
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            वेबसाइट सामग्री तथा सेक्सन नियन्त्रण (Content CMS)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            कोड परिवर्तन नगरी होमपेजका शीर्षक, विवरण, सम्पर्क र सेक्सनहरू नियन्त्रण गर्नुहोस्
          </p>
        </div>

        <button onClick={handleFormSubmit} className="btn btn-primary" disabled={saving}>
          <Save size={16} />
          <span>{saving ? 'सुरक्षित गर्दै...' : 'सबै परिवर्तन सुरक्षित गर्नुहोस् (Save All)'}</span>
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* Section 1: Visibility Toggles (ON / OFF) */}
        <div className="temple-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sliders size={20} color="#7A121D" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
              होमपेज सेक्सन सक्रिय / निष्क्रिय (Section Visibility ON/OFF)
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            {[
              { key: 'showPooja', label: 'पूजा तथा सेवा सेक्सन' },
              { key: 'showEvents', label: 'आगामी कार्यक्रम सेक्सन' },
              { key: 'showLiveDarshan', label: 'लाइभ दर्शन सेक्सन' },
              { key: 'showMeeting', label: 'भर्चुअल बैठक सेक्सन' },
              { key: 'showGallery', label: 'तस्बिर ग्यालरी सेक्सन' },
              { key: 'showDonationSection', label: 'चन्दा तथा दान सेक्सन' },
              { key: 'showDonorList', label: 'सहयोगी दाता सूची (Donor Ticker)' },
              { key: 'showTransparency', label: 'आर्थिक पारदर्शिता सेक्सन' },
            ].map(sec => (
              <label
                key={sec.key}
                style={{
                  backgroundColor: 'var(--bg-cream-alt)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-brown)' }}>
                  {sec.label}
                </span>
                <input
                  type="checkbox"
                  name={sec.key}
                  checked={settings[sec.key]}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Section 2: Donor Privacy Display Control */}
        <div className="temple-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shield size={20} color="#2D6A4F" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
              चन्दा दाता नाम प्रदर्शन गोपनीयता (Donor Privacy Policy)
            </h3>
          </div>

          <div style={{ maxWidth: '400px' }}>
            <label className="form-label">सार्वजनिक होमपेजमा दाताको नाम कसरी देखाउने?</label>
            <select
              name="donorPrivacyDisplay"
              value={settings.donorPrivacyDisplay}
              onChange={handleChange}
              className="form-control"
            >
              <option value="public">पूरा नाम देखाउने (Full Name)</option>
              <option value="initials">संक्षिप्त नाम मात्र देखाउने (Initials e.g. R. P. S.)</option>
              <option value="anonymous">सबैलाई गोप्य देखाउने (Anonymous Devotee)</option>
              <option value="disabled">दाता सूची बन्द गर्ने (Disabled)</option>
            </select>
          </div>
        </div>

        {/* Section 3: Hero Section Content */}
        <div className="temple-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            हिरो सेक्सन सामग्री (Hero Section Content)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hero Eyebrow (Nepali)</label>
              <input
                type="text"
                name="heroEyebrowNepali"
                value={settings.heroEyebrowNepali}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero मुख्य तस्बिर (Image)</label>
              <select
                name="heroImage"
                value={settings.heroImage}
                onChange={handleChange}
                className="form-control"
              >
                <option value="/assets/images/deity-portrait.jpg">भगवान विश्वकर्मा मुख्य विग्रह (Deity Portrait)</option>
                <option value="/assets/images/deity-altar-lamps.jpg">पञ्चदीप मण्डप (Altar Lamps)</option>
                <option value="/assets/images/deity-sanctum.jpg">गर्भगृह (Sanctum)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Hero मुख्य शीर्षक (Heading Nepali) *</label>
            <input
              type="text"
              name="heroTitleNepali"
              value={settings.heroTitleNepali}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero Heading (English)</label>
            <input
              type="text"
              name="heroTitleEnglish"
              value={settings.heroTitleEnglish}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hero उपशीर्षक / विवरण (Subtitle Nepali)</label>
            <textarea
              name="heroSubtitleNepali"
              value={settings.heroSubtitleNepali}
              onChange={handleChange}
              className="form-control"
              rows={2}
            />
          </div>
        </div>

        {/* Section 4: About Temple Content & Statistics */}
        <div className="temple-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            मन्दिर परिचय तथा तथ्याङ्क (About Story & Stats)
          </h3>

          <div className="form-group">
            <label className="form-label">About शीर्षक (Nepali)</label>
            <input
              type="text"
              name="aboutTitleNepali"
              value={settings.aboutTitleNepali}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">मन्दिरको विस्तृत इतिहास तथा परिचय (Nepali Story)</label>
            <textarea
              name="aboutDescriptionNepali"
              value={settings.aboutDescriptionNepali}
              onChange={handleChange}
              className="form-control"
              rows={4}
            />
          </div>

          {/* Stats 4 inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">स्थापना वर्ष</label>
              <input
                type="text"
                name="establishedYear"
                value={settings.establishedYear}
                onChange={handleChange}
                className="form-control"
                placeholder="२०५५"
              />
            </div>

            <div className="form-group">
              <label className="form-label">वार्षिक भक्तजन संख्या</label>
              <input
                type="text"
                name="devoteesCount"
                value={settings.devoteesCount}
                onChange={handleChange}
                className="form-control"
                placeholder="१०,०००+"
              />
            </div>

            <div className="form-group">
              <label className="form-label">वार्षिक कार्यक्रम संख्या</label>
              <input
                type="text"
                name="annualEventsCount"
                value={settings.annualEventsCount}
                onChange={handleChange}
                className="form-control"
                placeholder="२४+"
              />
            </div>

            <div className="form-group">
              <label className="form-label">समुदाय सेवा सूचक</label>
              <input
                type="text"
                name="communityProjectsCount"
                value={settings.communityProjectsCount}
                onChange={handleChange}
                className="form-control"
                placeholder="१००% पारदर्शी"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Contact Information & Google Maps */}
        <div className="temple-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            सम्पर्क, समय र गुगल म्याप (Contact & Location Settings)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">मुख्य फोन नम्बर *</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">सहायक फोन नम्बर / मोबाइल</label>
              <input
                type="text"
                name="secondaryPhone"
                value={settings.secondaryPhone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">आधिकारिक इमेल</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">मन्दिरको पूरा ठेगाना (Nepali)</label>
              <input
                type="text"
                name="addressNepali"
                value={settings.addressNepali}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">गुगल म्याप लिङ्क (Google Maps URL)</label>
            <input
              type="url"
              name="googleMapsUrl"
              value={settings.googleMapsUrl}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">दैनिक पूजा समय (Daily Timings)</label>
              <input
                type="text"
                name="dailyPoojaTimeNepali"
                value={settings.dailyPoojaTimeNepali}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">विशेष पूजा समय (Special Timings)</label>
              <input
                type="text"
                name="specialPoojaTimeNepali"
                value={settings.specialPoojaTimeNepali}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Floating Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
          <button type="submit" className="btn btn-lg btn-primary" disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'सुरक्षित गर्दै...' : 'सबै परिवर्तन सुरक्षित गर्नुहोस् (Save All Content)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentCMSView;
