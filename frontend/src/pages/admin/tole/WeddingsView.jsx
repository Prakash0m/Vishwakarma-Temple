import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  User
} from 'lucide-react';

const WeddingsView = () => {
  const { t } = useLanguage();
  const [weddings, setWeddings] = useState([]);
  const [summary, setSummary] = useState({
    totalWeddings: 0,
    upcomingCount: 0,
    completedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWedding, setEditingWedding] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    brideHouse: '',
    groomHouse: '',
    weddingDate: new Date().toISOString().split('T')[0],
    weddingDateNepali: '',
    weddingType: 'Traditional Hindu',
    contactPerson: '',
    contactPhone: '',
    location: 'छापकी, सप्तरी (विश्वकर्मा मन्दिर परिसर / वर-वधु निवास)',
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWeddings();
  }, [statusFilter, search]);

  const fetchWeddings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/weddings', {
        params: { status: statusFilter, search }
      });
      if (res.data.success) {
        setWeddings(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching weddings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingWedding(null);
    setFormData({
      brideName: '',
      groomName: '',
      brideHouse: '',
      groomHouse: '',
      weddingDate: new Date().toISOString().split('T')[0],
      weddingDateNepali: '',
      weddingType: 'Traditional Hindu',
      contactPerson: '',
      contactPhone: '',
      location: 'छापकी, सप्तरी (विश्वकर्मा मन्दिर परिसर / वर-वधु निवास)',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (w) => {
    setEditingWedding(w);
    setFormData({
      brideName: w.brideName,
      groomName: w.groomName,
      brideHouse: w.brideHouse || '',
      groomHouse: w.groomHouse || '',
      weddingDate: new Date(w.weddingDate).toISOString().split('T')[0],
      weddingDateNepali: w.weddingDateNepali || '',
      weddingType: w.weddingType,
      contactPerson: w.contactPerson,
      contactPhone: w.contactPhone,
      location: w.location,
      notes: w.notes || ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingWedding) {
        await api.put(`/tole/weddings/${editingWedding._id}`, formData);
      } else {
        await api.post('/tole/weddings', formData);
      }
      setShowAddModal(false);
      fetchWeddings();
    } catch (err) {
      alert('त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, names) => {
    if (window.confirm(`के तपाईं ${names} को विवाह अभिलेख मेटाउन निश्चित हुनुहुन्छ?`)) {
      try {
        await api.delete(`/tole/weddings/${id}`);
        fetchWeddings();
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
            टोल विवाह अभिलेख तथा क्यालेन्डर (Wedding Management)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            छापकी टोलका वर-वधु, निश्चित विवाह मिति तथा मन्दिर मण्डप अनुष्ठान अभिलेखीकरण
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(122, 18, 29, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>नयाँ विवाह दर्ता गर्नुहोस्</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल विवाह अभिलेख (Total Weddings)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
            {summary.totalWeddings}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>आगामी निश्चित विवाह (Upcoming)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#D9531E', marginTop: '0.25rem' }}>
            {summary.upcomingCount}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>सम्पन्न विवाहहरू (Completed)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2E7D32', marginTop: '0.25rem' }}>
            {summary.completedCount}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="वर, वधु, घर वा फोन नम्बर खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>स्थिति:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
          >
            <option value="all">सबै (All)</option>
            <option value="Upcoming">आगामी (Upcoming)</option>
            <option value="Completed">सम्पन्न (Completed)</option>
          </select>
        </div>
      </div>

      {/* Weddings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
            विवाह विवरण लोड हुँदैछ...
          </div>
        ) : weddings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
            कुनै विवाह अभिलेख फेला परेन।
          </div>
        ) : (
          weddings.map((w) => (
            <div
              key={w._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid var(--border-gold)',
                padding: '1.25rem',
                boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    {w.weddingId}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.55rem', borderRadius: '12px', backgroundColor: w.status === 'Upcoming' ? '#FFF8E1' : '#E8F5E9', color: w.status === 'Upcoming' ? '#F57F17' : '#2E7D32' }}>
                    {w.status === 'Upcoming' ? 'आगामी विवाह' : 'सम्पन्न'}
                  </span>
                </div>

                <div style={{ textAlign: 'center', padding: '0.75rem 0', borderBottom: '1px dashed #E8E2D9', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Heart size={20} color="#D9531E" fill="#D9531E" />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                      {w.brideName} 💖 {w.groomName}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                    {w.weddingType}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#444' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="var(--color-primary)" />
                    <span><strong>निश्चित मिति:</strong> {new Date(w.weddingDate).toLocaleDateString()} {w.weddingDateNepali && `(${w.weddingDateNepali})`}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={15} color="var(--color-primary)" />
                    <span><strong>स्थान:</strong> {w.location}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={15} color="var(--color-primary)" />
                    <span><strong>सम्पर्क:</strong> {w.contactPerson} ({w.contactPhone})</span>
                  </div>

                  {w.notes && (
                    <div style={{ backgroundColor: '#FAF7F2', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginTop: '0.3rem', color: '#666' }}>
                      {w.notes}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #F0ECE4', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => handleOpenEdit(w)}
                  style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', color: '#555', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Edit2 size={14} />
                  <span>सम्पादन</span>
                </button>
                <button
                  onClick={() => handleDelete(w._id, `${w.brideName} र ${w.groomName}`)}
                  style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #FFCDD2', backgroundColor: '#FFF', color: '#C62828', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Trash2 size={14} />
                  <span>मेटाउनुहोस्</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Wedding Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              {editingWedding ? 'विवाह विवरण सम्पादन' : 'नयाँ विवाह दर्ता फारम'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              छापकी टोल विवाह दर्ता तथा क्यालेन्डर प्रणाली
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>दुलहीको नाम (Bride Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: पुजा शर्मा"
                    value={formData.brideName}
                    onChange={(e) => setFormData(prev => ({ ...prev, brideName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>दुलहाको नाम (Groom Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: अमित शर्मा"
                    value={formData.groomName}
                    onChange={(e) => setFormData(prev => ({ ...prev, groomName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>दुलहीको घर / ठेगाना</label>
                  <input
                    type="text"
                    placeholder="उदा: राजविराज-३, सप्तरी"
                    value={formData.brideHouse}
                    onChange={(e) => setFormData(prev => ({ ...prev, brideHouse: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>दुलहाको घर (छापकी घर नं.)</label>
                  <input
                    type="text"
                    placeholder="उदा: छापकी-५, घर नं. १०१"
                    value={formData.groomHouse}
                    onChange={(e) => setFormData(prev => ({ ...prev, groomHouse: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>विवाह मिति (Date) *</label>
                  <input
                    type="date"
                    required
                    value={formData.weddingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>नेपाली मिति (उदा: २०८३ असोज २)</label>
                  <input
                    type="text"
                    placeholder="२०८३ असोज २ गते"
                    value={formData.weddingDateNepali}
                    onChange={(e) => setFormData(prev => ({ ...prev, weddingDateNepali: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>सम्पर्क व्यक्ति (Contact Person) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: राम प्रसाद शर्मा"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>सम्पर्क नम्बर (Phone) *</label>
                  <input
                    type="text"
                    required
                    placeholder="98520XXXXX"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>विवाह स्थल (Location)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                  {saving ? 'दर्ता हुँदैछ...' : 'विवाह दर्ता गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingsView;
