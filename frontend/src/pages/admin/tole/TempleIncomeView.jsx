import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  DollarSign,
  TrendingUp,
  Droplets,
  Building,
  Heart,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  FileText,
  X
} from 'lucide-react';

const TempleIncomeView = () => {
  const { t } = useLanguage();
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState({
    totalTempleIncome: 0,
    jalahawaPokhariIncome: 0,
    gosaiPokhariIncome: 0,
    donationIncome: 0,
    otherIncome: 0
  });
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    sourceName: 'जलाहवा पोखरी (Jalahawa Pokhari)',
    sourceCategory: 'Pokhari',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    fiscalYear: '२०८३/२०८४',
    description: '',
    receivedBy: 'सीता शर्मा (कोषाध्यक्ष)',
    payerName: '',
    payerPhone: '',
    paymentMethod: 'Bank Transfer',
    transactionId: '',
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, [sourceFilter, search]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/temple-income', {
        params: { sourceName: sourceFilter, search }
      });
      if (res.data.success) {
        setIncomes(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching temple incomes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setFormData({
      sourceName: 'जलाहवा पोखरी (Jalahawa Pokhari)',
      sourceCategory: 'Pokhari',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      fiscalYear: '२०८३/२०८४',
      description: '',
      receivedBy: 'सीता शर्मा (कोषाध्यक्ष)',
      payerName: '',
      payerPhone: '',
      paymentMethod: 'Bank Transfer',
      transactionId: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (inc) => {
    setEditingIncome(inc);
    setFormData({
      sourceName: inc.sourceName,
      sourceCategory: inc.sourceCategory,
      amount: inc.amount,
      date: new Date(inc.date).toISOString().split('T')[0],
      fiscalYear: inc.fiscalYear || '२०८३/२०८४',
      description: inc.description,
      receivedBy: inc.receivedBy,
      payerName: inc.payerName || '',
      payerPhone: inc.payerPhone || '',
      paymentMethod: inc.paymentMethod,
      transactionId: inc.transactionId || '',
      notes: inc.notes || ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingIncome) {
        await api.put(`/temple-income/${editingIncome._id}`, formData);
      } else {
        await api.post('/temple-income', formData);
      }
      setShowAddModal(false);
      fetchIncomes();
    } catch (err) {
      alert('त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('के तपाईं यो आम्दानी विवरण मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        await api.delete(`/temple-income/${id}`);
        fetchIncomes();
      } catch (err) {
        alert('मेटाउन सकिएन');
      }
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            मन्दिर आम्दानी तथा पोखरी स्रोत व्यवस्थापन (Temple Income)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            जलाहवा पोखरी, गोसाइँ पोखरी ठेक्का, मन्दिर भेटी तथा भाडा आम्दानी (टोल कोष भन्दा छुट्टै वित्तीय खाता)
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
          <span>नयाँ आम्दानी दर्ता</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल मन्दिर आम्दानी (Total Income)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
            रु. {summary.totalTempleIncome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#777', marginTop: '0.2rem' }}>सम्पूर्ण पोखरी तथा मन्दिर स्रोतहरू</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>जलाहवा पोखरी (Pokhari 1)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0077B6', marginTop: '0.25rem' }}>
                रु. {summary.jalahawaPokhariIncome.toLocaleString()}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077B6' }}>
              <Droplets size={22} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>गोसाइँ पोखरी (Pokhari 2)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2D6A4F', marginTop: '0.25rem' }}>
                रु. {summary.gosaiPokhariIncome.toLocaleString()}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D6A4F' }}>
              <Droplets size={22} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>भाडा तथा अन्य आम्दानी</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#D9531E', marginTop: '0.25rem' }}>
                रु. {summary.otherIncome.toLocaleString()}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FDF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9531E' }}>
              <Building size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="आम्दानी विवरण, व्यक्ति वा ID खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>स्रोत अनुसार:</label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
          >
            <option value="all">सबै स्रोत (All Sources)</option>
            <option value="जलाहवा पोखरी (Jalahawa Pokhari)">जलाहवा पोखरी</option>
            <option value="गोसाइँ पोखरी (Gosai Pokhari)">गोसाइँ पोखरी</option>
            <option value="घर/सटर भाडा">घर/सटर भाडा</option>
            <option value="मन्दिर भेटी तथा दान">मन्दिर भेटी तथा दान</option>
          </select>
        </div>
      </div>

      {/* Incomes Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>आम्दानी ID</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>स्रोतको नाम</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>रकम (Amount)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>विवरण (Description)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>मिति</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>बुझिलिने / भुक्तानी माध्यम</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)', textAlign: 'right' }}>कार्य</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    आम्दानी विवरण लोड हुँदैछ...
                  </td>
                </tr>
              ) : incomes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    कुनै आम्दानी फेला परेन।
                  </td>
                </tr>
              ) : (
                incomes.map((inc) => (
                  <tr key={inc._id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {inc.incomeId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          backgroundColor: inc.sourceName.includes('जलाहवा') ? '#E0F2FE' : inc.sourceName.includes('गोसाइँ') ? '#E8F5E9' : '#FAF7F2',
                          color: inc.sourceName.includes('जलाहवा') ? '#0077B6' : inc.sourceName.includes('गोसाइँ') ? '#2D6A4F' : 'var(--color-primary-dark)'
                        }}
                      >
                        {inc.sourceName}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#2E7D32', fontSize: '1rem' }}>
                      रु. {inc.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#444' }}>
                      <div>{inc.description}</div>
                      {inc.payerName && <div style={{ fontSize: '0.75rem', color: '#777' }}>भुक्तानीकर्ता: {inc.payerName}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#555' }}>
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '600' }}>{inc.receivedBy}</div>
                      <div style={{ fontSize: '0.75rem', color: '#777' }}>{inc.paymentMethod} {inc.transactionId && `(${inc.transactionId})`}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEdit(inc)}
                          style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', color: '#555', cursor: 'pointer' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(inc._id)}
                          style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #FFCDD2', backgroundColor: '#FFF', color: '#C62828', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Income Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              {editingIncome ? 'आम्दानी विवरण सम्पादन' : 'नयाँ मन्दिर आम्दानी दर्ता'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              जलाहवा/गोसाइँ पोखरी वा अन्य मन्दिर स्रोतको आम्दानी
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>आम्दानी स्रोत *</label>
                  <select
                    value={formData.sourceName}
                    onChange={(e) => setFormData(prev => ({ ...prev, sourceName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    <option value="जलाहवा पोखरी (Jalahawa Pokhari)">जलाहवा पोखरी (Pokhari 1)</option>
                    <option value="गोसाइँ पोखरी (Gosai Pokhari)">गोसाइँ पोखरी (Pokhari 2)</option>
                    <option value="घर/सटर भाडा">घर/सटर भाडा</option>
                    <option value="मन्दिर भेटी तथा दान">मन्दिर भेटी तथा दान</option>
                    <option value="अन्य मन्दिर आम्दानी">अन्य मन्दिर आम्दानी</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>रकम (Amount in NPR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="उदा: 125000"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontWeight: '700' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>मिति (Date) *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>आर्थिक वर्ष (Fiscal Year)</label>
                  <input
                    type="text"
                    value={formData.fiscalYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, fiscalYear: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>आम्दानीको विवरण (Description) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: मत्स्यपालन ठेक्का प्रथम किस्ता भुक्तानी"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>बुझिलिने व्यक्ति (Received By) *</label>
                  <input
                    type="text"
                    required
                    value={formData.receivedBy}
                    onChange={(e) => setFormData(prev => ({ ...prev, receivedBy: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>भुक्तानी माध्यम</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    <option value="Bank Transfer">बैंक ट्रान्सफर (Bank Transfer)</option>
                    <option value="Cash">नगद (Cash)</option>
                    <option value="Cheque">चेक (Cheque)</option>
                    <option value="eSewa">eSewa</option>
                    <option value="Khalti">Khalti</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>भुक्तानीकर्ता / ठेकेदारको नाम</label>
                  <input
                    type="text"
                    placeholder="उदा: मत्स्य व्यवसायी समूह"
                    value={formData.payerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, payerName: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>बैंक कारोबार / भौचर नं.</label>
                  <input
                    type="text"
                    placeholder="उदा: NBL-TXN-882193"
                    value={formData.transactionId}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  रद्द
                </button>
                <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                  {saving ? 'दर्ता हुँदैछ...' : 'आम्दानी सुरक्षित गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempleIncomeView;
