import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Flame,
  Plus,
  Edit2,
  Trash2,
  X,
  Clock,
  Tag,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const PoojasView = () => {
  const { language, t, getLocalized } = useLanguage();
  const { addToast } = useToast();

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPooja, setEditingPooja] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    description: '',
    descriptionEnglish: '',
    price: '',
    duration: '४५ मिनेट',
    durationEnglish: '45 Minutes',
    image: '/assets/images/deity-altar-lamps.jpg',
    isActive: true,
    featured: false,
    order: 0
  });

  const fetchPoojas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/poojas?includeInactive=true');
      if (res.data.success) {
        setPoojas(res.data.data);
      }
    } catch (err) {
      addToast('पूजा सेवाहरू लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPooja(null);
    setFormData({
      title: '',
      titleEnglish: '',
      description: '',
      descriptionEnglish: '',
      price: '',
      duration: '४५ मिनेट',
      durationEnglish: '45 Minutes',
      image: '/assets/images/deity-altar-lamps.jpg',
      isActive: true,
      featured: false,
      order: poojas.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingPooja(p);
    setFormData({
      title: p.title,
      titleEnglish: p.titleEnglish || '',
      description: p.description,
      descriptionEnglish: p.descriptionEnglish || '',
      price: p.price,
      duration: p.duration,
      durationEnglish: p.durationEnglish || '',
      image: p.image || '/assets/images/deity-altar-lamps.jpg',
      isActive: p.isActive,
      featured: p.featured || false,
      order: p.order || 0
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || Number(formData.price) < 0) {
      addToast('कृपया पूजाको नाम र वैध शुल्क प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    try {
      if (editingPooja) {
        const res = await api.put(`/poojas/${editingPooja._id}`, formData);
        if (res.data.success) {
          addToast('पूजा सेवा अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchPoojas();
        }
      } else {
        const res = await api.post('/poojas', formData);
        if (res.data.success) {
          addToast('नयाँ पूजा सेवा सफलतापूर्वक सिर्जना भयो।', 'success');
          setIsModalOpen(false);
          fetchPoojas();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'पूजा सेवा सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeletePooja = async (id) => {
    if (window.confirm('के तपाईं यो पूजा सेवा मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/poojas/${id}`);
        if (res.data.success) {
          addToast('पूजा सेवा हटाइयो।', 'success');
          fetchPoojas();
        }
      } catch (err) {
        addToast('पूजा सेवा हटाउन सकिएन।', 'error');
      }
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Flame size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            पूजा तथा धार्मिक सेवा व्यवस्थापन (Pooja Catalog)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>नयाँ पूजा सेवा थप्नुहोस् (Add Pooja)</span>
        </button>
      </div>

      {/* Poojas Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>पूजा सेवाहरू लोड हुँदैछन्...</div>
        ) : poojas.length > 0 ? (
          poojas.map((p) => (
            <div
              key={p._id}
              className="temple-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                <img
                  src={p.image || '/assets/images/deity-altar-lamps.jpg'}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: 'var(--border-radius-full)',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  border: '1px solid var(--color-gold)'
                }}>
                  रु. {p.price?.toLocaleString('ne-NP')}
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-saffron)', fontWeight: '600' }}>
                    ⏱ {p.duration}
                  </span>
                  <span className={`badge ${p.isActive ? 'badge-green' : 'badge-maroon'}`}>
                    {p.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'}
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
                  {p.description}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <button onClick={() => handleOpenEditModal(p)} className="btn btn-sm btn-outline">
                    <Edit2 size={14} />
                    <span>सम्पादन</span>
                  </button>
                  <button
                    onClick={() => handleDeletePooja(p._id)}
                    style={{
                      backgroundColor: '#FEE2E2',
                      color: '#991B1B',
                      border: '1px solid #F87171',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>हटाउनुहोस्</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            कुनै पूजा सेवा फेला परेन।
          </div>
        )}
      </div>

      {/* Add / Edit Pooja Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingPooja ? 'पूजा सेवा सम्पादन (Edit Pooja)' : 'नयाँ पूजा सेवा थप्नुहोस् (Add Pooja)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">पूजाको नाम (Nepali) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-control"
                    placeholder="उदा. विशेष विश्वकर्मा पूजा"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pooja Name (English)</label>
                  <input
                    type="text"
                    value={formData.titleEnglish}
                    onChange={(e) => setFormData({ ...formData, titleEnglish: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Special Vishwakarma Pooja"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">शुल्क / Offering (रु.) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="form-control"
                      placeholder="११००"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">समय / Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="form-control"
                      placeholder="४५ मिनेट"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">तस्बिर छनौट (Image Asset)</label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="form-control"
                  >
                    <option value="/assets/images/deity-altar-lamps.jpg">दीपावली तथा पञ्चदीप अर्पण (Altar Lamps)</option>
                    <option value="/assets/images/deity-sanctum.jpg">गर्भगृह मण्डप (Sanctum Drapes)</option>
                    <option value="/assets/images/deity-portrait.jpg">भगवान विग्रह (Lord Vishwakarma Portrait)</option>
                    <option value="/assets/images/temple-structure.jpg">मन्दिर भवन (Temple Structure)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">विवरण (Nepali Description) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    placeholder="पूजाको महत्व, विधि र नैवेद्य विवरण..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description (English)</label>
                  <textarea
                    value={formData.descriptionEnglish}
                    onChange={(e) => setFormData({ ...formData, descriptionEnglish: e.target.value })}
                    className="form-control"
                    placeholder="English description of the pooja ritual..."
                    rows={2}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>वेबसाइटमा सक्रिय देखाउने (Active)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <span>विशेष सेवा (Featured)</span>
                  </label>
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPooja ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'पूजा सेवा थप्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoojasView;
