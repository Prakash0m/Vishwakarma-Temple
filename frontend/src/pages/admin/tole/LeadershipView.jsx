import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import { compressImageToBase64, getImageUrl } from '../../../utils/imageOptimizer';
import {
  Award,
  Users,
  Phone,
  Edit2,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  X,
  Upload,
  CheckCircle2
} from 'lucide-react';

const LeadershipView = () => {
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    fullNameDevanagari: '',
    houseNumber: '',
    position: 'Tole President',
    positionDevanagari: 'टोल अध्यक्ष',
    profileImage: '/assets/images/deity-portrait.jpg',
    bio: '',
    phone: '',
    email: '',
    displayOrder: 1
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/leadership', { params: { all: 'true' } });
      if (res.data.success) {
        setCandidates(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching leadership candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCandidate(null);
    setFormData({
      fullName: '',
      fullNameDevanagari: '',
      houseNumber: '',
      position: 'Tole President',
      positionDevanagari: 'टोल अध्यक्ष',
      profileImage: '/assets/images/deity-portrait.jpg',
      bio: '',
      phone: '',
      email: '',
      displayOrder: candidates.length + 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCandidate(c);
    setFormData({
      fullName: c.fullName,
      fullNameDevanagari: c.fullNameDevanagari || c.fullName,
      houseNumber: c.houseNumber || '',
      position: c.position,
      positionDevanagari: c.positionDevanagari || c.position,
      profileImage: c.profileImage || '/assets/images/deity-portrait.jpg',
      bio: c.bio || '',
      phone: c.phone,
      email: c.email || '',
      displayOrder: c.displayOrder || 1
    });
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await compressImageToBase64(file, 800, 800, 0.85);
      setFormData(prev => ({ ...prev, profileImage: base64 }));
    } catch (err) {
      console.error('Leadership photo upload error:', err);
      alert('तस्बिर प्रोसेस गर्न सकिएन।');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/tole/leadership/${id}/status`);
      fetchCandidates();
    } catch (err) {
      alert('स्थिति परिवर्तन गर्न सकिएन');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCandidate) {
        await api.put(`/tole/leadership/${editingCandidate._id}`, formData);
      } else {
        await api.post('/tole/leadership', formData);
      }
      setShowModal(false);
      fetchCandidates();
    } catch (err) {
      alert('त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`के तपाईं ${name} लाई उम्मेदवार सूचीबाट मेटाउन निश्चित हुनुहुन्छ?`)) {
      try {
        await api.delete(`/tole/leadership/${id}`);
        fetchCandidates();
      } catch (err) {
        alert('मेटाउन सकिएन: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            टोल समिति तथा ५ उम्मेदवार व्यवस्थापन (Tole Leadership)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            छापकी टोल नेतृत्व ५ उम्मेदवारहरूको तस्बिर, विवरण, पद तथा सार्वजनिक प्रदर्शन व्यवस्थापन
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary btn-shimmer"
          style={{
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}
        >
          <Plus size={18} />
          <span>नयाँ उम्मेदवार थप्नुहोस्</span>
        </button>
      </div>

      {/* 5 Candidates Showcase Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
            उम्मेदवार विवरण लोड हुँदैछ...
          </div>
        ) : candidates.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
            कुनै उम्मेदवार दर्ता भएको छैन।
          </div>
        ) : (
          candidates.map((c, idx) => {
            const isLogo = c.profileImage?.includes('logo') || c.profileImage?.endsWith('.svg');
            return (
              <div
                key={c._id}
                className="temple-card card-interactive"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: c.status === 'Active' ? '2px solid var(--border-gold)' : '1px solid #E8E2D9',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Top Badge: Candidate Number */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                  उम्मेदवार #{idx + 1} ({c.candidateId})
                </div>

                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                  <button
                    onClick={() => handleToggleStatus(c._id)}
                    style={{
                      backgroundColor: c.status === 'Active' ? '#2E7D32' : '#757575',
                      color: '#FFF',
                      border: 'none',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {c.status === 'Active' ? '✓ सक्रिय' : 'निष्क्रिय'}
                  </button>
                </div>

                <div>
                  {/* Image Container */}
                  <div style={{ width: '100%', height: '220px', backgroundColor: isLogo ? '#38060D' : '#FAF7F2', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={getImageUrl(c.profileImage)}
                      alt={c.fullName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: isLogo ? 'contain' : 'cover',
                        objectPosition: isLogo ? 'center' : 'center 22%',
                        padding: isLogo ? '20px' : '0'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/deity-portrait.jpg';
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', color: '#FFF' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFD166' }}>
                        {c.positionDevanagari || c.position}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                        {c.fullNameDevanagari || c.fullName}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                      घर नम्बर: <strong>{c.houseNumber || '१०१'}</strong> • फोन: <strong>{c.phone}</strong>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#444', lineHeight: 1.4, margin: 0, minHeight: '50px' }}>
                      {c.bio || 'छापकी टोलको विकास, धार्मिक तथा सामाजिक कार्यहरूमा नेतृत्वदायी भूमिका।'}
                    </p>
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #F0ECE4', backgroundColor: '#FAF7F2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#888' }}>
                    क्रम: {c.displayOrder}
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', color: '#555', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Edit2 size={13} />
                      <span>सम्पादन</span>
                    </button>
                    <button
                      onClick={() => handleDelete(c._id, c.fullName)}
                      style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #FFCDD2', backgroundColor: '#FFF', color: '#C62828', cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Candidate Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              {editingCandidate ? 'उम्मेदवार विवरण सम्पादन' : 'नयाँ टोल समिति उम्मेदवार दर्ता'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              सार्वजनिक वेबसाइटमा ५ नेतृत्व उम्मेदवारको रूपमा प्रदर्शन हुनेछ
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>पूरा नाम (नेपालीमा) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: पण्डित रमेश आचार्य"
                    value={formData.fullNameDevanagari}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullNameDevanagari: e.target.value, fullName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>घर नम्बर (House No.)</label>
                  <input
                    type="text"
                    placeholder="उदा: १०१"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>पद (Position) *</label>
                  <select
                    value={formData.positionDevanagari}
                    onChange={(e) => setFormData(prev => ({ ...prev, positionDevanagari: e.target.value, position: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    <option value="टोल अध्यक्ष">टोल अध्यक्ष (President)</option>
                    <option value="उपाध्यक्ष">उपाध्यक्ष (Vice President)</option>
                    <option value="सचिव">सचिव (Secretary)</option>
                    <option value="कोषाध्यक्ष">कोषाध्यक्ष (Treasurer)</option>
                    <option value="कार्यसमिति सदस्य">कार्यसमिति सदस्य (Member)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>सम्पर्क नम्बर (Phone) *</label>
                  <input
                    type="text"
                    required
                    placeholder="98520XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              {/* Upload Photo with Live Preview */}
              <div style={{
                backgroundColor: 'var(--bg-cream-alt)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1.5px dashed var(--border-gold)',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {formData.profileImage && (
                  <img
                    src={getImageUrl(formData.profileImage)}
                    alt="Preview"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto 8px auto',
                      border: '2px solid var(--color-gold)',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/deity-portrait.jpg';
                    }}
                  />
                )}
                <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', backgroundColor: '#FFFFFF' }}>
                  <Upload size={14} />
                  <span>{uploading ? 'तस्बिर लोड हुँदैछ...' : 'कम्प्युटरबाट नयाँ फोटो छनौट गर्नुहोस्'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>फोटो Preset वा URL</label>
                <select
                  value={formData.profileImage.startsWith('data:') ? 'custom' : formData.profileImage}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setFormData(prev => ({ ...prev, profileImage: e.target.value }));
                    }
                  }}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                >
                  {formData.profileImage.startsWith('data:') && (
                    <option value="custom">✓ नयाँ अपलोड गरिएको तस्बिर (Custom Upload)</option>
                  )}
                  <option value="/assets/images/deity-altar-lamps.jpg">पण्डित / पुजारी तस्बिर (Altar Lamps)</option>
                  <option value="/assets/images/temple-structure.jpg">मन्दिर भवन तथा तुलसी मठ (Temple Structure)</option>
                  <option value="/assets/images/deity-portrait.jpg">भगवान विश्वकर्मा विग्रह (Lord Vishwakarma)</option>
                  <option value="/assets/images/deity-sanctum.jpg">गर्भगृह मण्डप (Sanctum Drapes)</option>
                  <option value="/assets/images/temple-logo.svg">मन्दिर आधिकारिक लोगो (Official Emblem)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>संक्षिप्त परिचय तथा अनुभव (Short Bio)</label>
                <textarea
                  rows="3"
                  placeholder="सामाजिक अनुभव, योजना तथा प्रतिबद्धता..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                  {saving ? 'सुरक्षित हुँदैछ...' : 'सुरक्षित गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipView;
