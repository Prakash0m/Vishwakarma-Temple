import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const FundCampaignsView = () => {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    titleEnglish: '',
    month: 'September',
    year: 2026,
    amountPerHouse: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
    paymentInstructions: 'eSewa / Khalti / Fonepay वा बैंक ट्रान्सफर मार्फत भुक्तानी गरी भौचर अपलोड गर्नुहोस्।',
    status: 'Active'
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/fund-campaigns');
      if (res.data.success) {
        setCampaigns(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCampaign(null);
    setFormData({
      title: 'असोज २०८३ टोल मासिक कोष संकलन अभियान',
      titleEnglish: 'October 2026 Tole Monthly Fund Collection Campaign',
      month: 'October',
      year: 2026,
      amountPerHouse: 1000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: '',
      paymentInstructions: 'eSewa / Khalti / Fonepay वा बैंक ट्रान्सफर मार्फत भुक्तानी गरी भौचर अपलोड गर्नुहोस्।',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCampaign(c);
    setFormData({
      title: c.title,
      titleEnglish: c.titleEnglish || '',
      month: c.month,
      year: c.year,
      amountPerHouse: c.amountPerHouse,
      startDate: new Date(c.startDate).toISOString().split('T')[0],
      endDate: new Date(c.endDate).toISOString().split('T')[0],
      description: c.description || '',
      paymentInstructions: c.paymentInstructions || '',
      status: c.status
    });
    setShowAddModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/tole/fund-campaigns/${id}/status`);
      fetchCampaigns();
    } catch (err) {
      alert('स्थिति परिवर्तन गर्न सकिएन');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCampaign) {
        await api.put(`/tole/fund-campaigns/${editingCampaign._id}`, formData);
      } else {
        await api.post('/tole/fund-campaigns', formData);
      }
      setShowAddModal(false);
      fetchCampaigns();
    } catch (err) {
      alert('त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            मासिक टोल कोष संकलन अभियानहरू (Fund Campaigns)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            प्रत्येक महिनाको अन्त्यमा सक्रिय कोष अभियान सिर्जना तथा घरधुरी भुक्तानी अनुगमन
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
          <span>नयाँ मासिक अभियान सिर्जना गर्नुहोस्</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
            अभियान विवरण लोड हुँदैछ...
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
            कुनै अभियान सिर्जना गरिएको छैन।
          </div>
        ) : (
          campaigns.map((camp) => (
            <div
              key={camp._id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: camp.status === 'Active' || camp.status === 'सक्रिय' ? '2px solid var(--border-gold)' : '1px solid #E8E2D9',
                padding: '1.25rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    {camp.campaignId}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(camp._id)}
                    style={{
                      padding: '0.2rem 0.65rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: camp.status === 'Active' || camp.status === 'सक्रिय' ? '#E8F5E9' : '#F0ECE4',
                      color: camp.status === 'Active' || camp.status === 'सक्रिय' ? '#2E7D32' : '#666'
                    }}
                  >
                    {camp.status === 'Active' || camp.status === 'सक्रिय' ? '● सक्रिय अभियान (Active)' : 'बन्द (Closed)'}
                  </button>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)', margin: '0 0 0.5rem 0' }}>
                  {camp.title}
                </h3>

                <div style={{ backgroundColor: '#FAF7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E8E2D9', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#666' }}>प्रति घर तोकिएको रकम:</span>
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1rem' }}>रु. {camp.amountPerHouse}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#666' }}>संकलित रकम (Approved):</span>
                    <strong style={{ color: '#2E7D32' }}>रु. {camp.totalCollectedAmount || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>भुक्तानी गरेका घरधुरी:</span>
                    <strong style={{ color: '#333' }}>{camp.collectedHouses || 0} / {camp.targetHouses || 0} घर</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>अवधि: {new Date(camp.startDate).toLocaleDateString()} देखि {new Date(camp.endDate).toLocaleDateString()}</div>
                  {camp.description && <div style={{ color: '#444' }}>{camp.description}</div>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #F0ECE4', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => handleOpenEdit(camp)}
                  style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', color: '#555', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Edit2 size={14} />
                  <span>सम्पादन</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Campaign Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              {editingCampaign ? 'अभियान सम्पादन' : 'नयाँ मासिक कोष अभियान सिर्जना'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              महिनाको अन्त्यमा सबै घरधुरीका लागि मासिक कोष संकलन खुला गर्नुहोस्
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>अभियान शीर्षक *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: भदौ २०८३ टोल मासिक कोष संकलन अभियान"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>महिना (Month) *</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>प्रति घर रकम (NPR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amountPerHouse}
                    onChange={(e) => setFormData(prev => ({ ...prev, amountPerHouse: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>सुरु मिति *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>अन्तिम मिति *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>भुक्तानी निर्देशन (Instructions)</label>
                <textarea
                  rows="2"
                  value={formData.paymentInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentInstructions: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  रद्द
                </button>
                <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                  {saving ? 'सुरक्षित हुँदैछ...' : 'अभियान सुरक्षित गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundCampaignsView;
