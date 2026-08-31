import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  Upload,
  Sparkles
} from 'lucide-react';

const GalleryView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    imageUrl: '/assets/images/deity-portrait.jpg',
    category: 'Temple',
    categoryNepali: 'मन्दिर',
    isFeatured: false,
    description: ''
  });

  const categories = [
    { key: 'Temple', ne: 'मन्दिर' },
    { key: 'Bhagwan', ne: 'भगवान' },
    { key: 'Pooja', ne: 'पूजा' },
    { key: 'Events', ne: 'कार्यक्रम' },
    { key: 'Devotees', ne: 'भक्तजन' },
    { key: 'Donation', ne: 'दान तथा सेवा' },
    { key: 'Festival', ne: 'उत्सव' },
    { key: 'Other', ne: 'अन्य' }
  ];

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      if (res.data.success) {
        setGallery(res.data.data);
      }
    } catch (err) {
      addToast('ग्यालरी तस्बिरहरू लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setPreviewUrl('/assets/images/deity-portrait.jpg');
    setFormData({
      title: '',
      titleEnglish: '',
      imageUrl: '/assets/images/deity-portrait.jpg',
      category: 'Temple',
      categoryNepali: 'मन्दिर',
      isFeatured: false,
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setPreviewUrl(item.imageUrl);
    setFormData({
      title: item.title,
      titleEnglish: item.titleEnglish || '',
      imageUrl: item.imageUrl,
      category: item.category,
      categoryNepali: item.categoryNepali || 'मन्दिर',
      isFeatured: item.isFeatured || false,
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const found = categories.find(c => c.key === e.target.value);
    setFormData(prev => ({
      ...prev,
      category: e.target.value,
      categoryNepali: found ? found.ne : 'मन्दिर'
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
        setPreviewUrl(res.data.url);
        addToast('तस्बिर सफलतापूर्वक अपलोड भयो।', 'success');
      }
    } catch (err) {
      addToast('तस्बिर अपलोड गर्न सकिएन।', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      addToast('कृपया शीर्षक र तस्बिर प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    try {
      if (editingItem) {
        const res = await api.put(`/gallery/${editingItem._id}`, formData);
        if (res.data.success) {
          addToast('तस्बिर विवरण अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchGallery();
        }
      } else {
        const res = await api.post('/gallery', formData);
        if (res.data.success) {
          addToast('नयाँ तस्बिर ग्यालरीमा थपियो।', 'success');
          setIsModalOpen(false);
          fetchGallery();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'तस्बिर सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('के तपाईं यो तस्बिर मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/gallery/${id}`);
        if (res.data.success) {
          addToast('तस्बिर ग्यालरीबाट हटाइयो।', 'success');
          fetchGallery();
        }
      } catch (err) {
        addToast('तस्बिर हटाउन सकिएन।', 'error');
      }
    }
  };

  const filteredGallery = gallery.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ImageIcon size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            मन्दिर तस्बिर सङ्ग्रह व्यवस्थापन (Photo Gallery)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>नयाँ तस्बिर थप्नुहोस् (Add Photo)</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--border-radius-md)',
        padding: '0.75rem 1rem',
        border: '1px solid var(--border-gold)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-outline'}`}
        >
          सबै ({gallery.length})
        </button>
        {categories.map((c) => {
          const count = gallery.filter(g => g.category === c.key).length;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`btn btn-sm ${selectedCategory === c.key ? 'btn-primary' : 'btn-outline'}`}
            >
              {c.ne} ({count})
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>तस्बिरहरू लोड हुँदैछन्...</div>
        ) : filteredGallery.length > 0 ? (
          filteredGallery.map((item) => (
            <div
              key={item._id}
              className="temple-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(250, 247, 242, 0.95)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--color-primary-dark)',
                  border: '1px solid var(--border-gold)'
                }}>
                  {item.categoryNepali || item.category}
                </div>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                  {item.title}
                </h4>
                {item.description && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flex: 1 }}>
                    {item.description}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  <button onClick={() => handleOpenEditModal(item)} className="btn btn-sm btn-outline">
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    style={{
                      backgroundColor: '#FEE2E2',
                      color: '#991B1B',
                      border: '1px solid #F87171',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            कुनै तस्बिर फेला परेन।
          </div>
        )}
      </div>

      {/* Add / Edit Photo Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingItem ? 'तस्बिर विवरण सम्पादन (Edit Photo)' : 'नयाँ तस्बिर थप्नुहोस् (Add Photo)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                {/* Upload & Preview Area */}
                <div style={{
                  backgroundColor: 'var(--bg-cream-alt)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px dashed var(--border-gold)',
                  textAlign: 'center',
                  marginBottom: '1.25rem'
                }}>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxHeight: '160px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        margin: '0 auto 10px auto',
                        borderRadius: '8px',
                        border: '1px solid var(--border-gold)'
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                    <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', backgroundColor: '#FFFFFF' }}>
                      <Upload size={14} />
                      <span>{uploading ? 'अपलोड हुँदैछ...' : 'कम्प्युटरबाट नयाँ तस्बिर छनौट गर्नुहोस्'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">तस्बिरको URL / Asset Path</label>
                  <select
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setPreviewUrl(e.target.value);
                    }}
                    className="form-control"
                  >
                    <option value="/assets/images/deity-portrait.jpg">भगवान विश्वकर्मा मुख्य विग्रह (Deity Portrait)</option>
                    <option value="/assets/images/deity-altar-lamps.jpg">गर्भगृह पञ्चदीप प्रज्वलन (Altar Lamps)</option>
                    <option value="/assets/images/deity-sanctum.jpg">पवित्र मण्डप पुष्प सज्जा (Sanctum Drapes)</option>
                    <option value="/assets/images/temple-structure.jpg">मन्दिर भवन तथा तुलसी मठ (Temple Structure)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">तस्बिरको शीर्षक (Nepali Title) *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-control"
                    placeholder="उदा. गर्भगृह दीप प्रज्वलन आरती"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">वर्ग (Category)</label>
                    <select
                      value={formData.category}
                      onChange={handleCategoryChange}
                      className="form-control"
                    >
                      {categories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.ne} ({c.key})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">विशेष तस्बिर (Featured)</label>
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <span>होमपेजमा प्रमुख देखाउने</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">छोटो विवरण / सन्देश (Description)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    placeholder="तस्बिरको ऐतिहासिक वा धार्मिक सन्दर्भ..."
                    rows={2}
                  />
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'तस्बिर थप्नुहोस्'}
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

export default GalleryView;
