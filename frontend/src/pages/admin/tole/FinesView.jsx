import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  CreditCard,
  FileText,
  X,
  Trash2,
  Check
} from 'lucide-react';

const FinesView = () => {
  const { t } = useLanguage();
  const [fines, setFines] = useState([]);
  const [summary, setSummary] = useState({
    totalFinesCount: 0,
    totalFineAmount: 0,
    totalCollectedAmount: 0,
    totalPendingAmount: 0,
    pendingFinesCount: 0,
    paidFinesCount: 0
  });
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    houseIdDb: '',
    personName: '',
    fineType: 'Meeting Absence',
    amount: 100,
    reason: '',
    notes: ''
  });

  const [payFormData, setPayFormData] = useState({
    paidAmount: 100,
    paymentMethod: 'Cash',
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFines();
    fetchHouses();
  }, [statusFilter, search]);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/fines', {
        params: { status: statusFilter, search }
      });
      if (res.data.success) {
        setFines(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching fines:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouses = async () => {
    try {
      const res = await api.get('/tole/houses');
      if (res.data.success) {
        setHouses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
    }
  };

  const handleHouseSelect = (houseIdDb) => {
    const found = houses.find(h => h._id === houseIdDb);
    setFormData(prev => ({
      ...prev,
      houseIdDb,
      personName: found ? found.representativeName : ''
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/tole/fines', formData);
      setShowAddModal(false);
      fetchFines();
    } catch (err) {
      alert('त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const openPayModal = (fine) => {
    setSelectedFine(fine);
    setPayFormData({
      paidAmount: fine.amount - (fine.paidAmount || 0),
      paymentMethod: 'Cash',
      notes: ''
    });
    setShowPayModal(true);
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/tole/fines/${selectedFine._id}/pay`, payFormData);
      setShowPayModal(false);
      fetchFines();
    } catch (err) {
      alert('भुक्तानी दर्ता गर्दा त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleWaive = async (fineId) => {
    const reason = window.prompt('जरिवाना मिनाहा गर्नुको कारण लेख्नुहोस्:');
    if (reason !== null) {
      try {
        await api.put(`/tole/fines/${fineId}/waive`, { reason });
        fetchFines();
      } catch (err) {
        alert('मिनाहा गर्न सकिएन: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (fineId) => {
    if (window.confirm('के तपाईं यो जरिवाना मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        await api.delete(`/tole/fines/${fineId}`);
        fetchFines();
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
            टोल जरिवाना व्यवस्थापन (Fines & Penalties)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            बैठक अनुपस्थिति, ढिलो उपस्थिति तथा टोल नियम उल्लङ्घन जरिवाना अभिलेख
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
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
          <span>नयाँ जरिवाना दर्ता</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल जरिवाना रकम (Total Fines)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
            रु. {summary.totalFineAmount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#777', marginTop: '0.2rem' }}>कुल {summary.totalFinesCount} पटक जरिवाना</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>संकलित जरिवाना (Collected)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2E7D32', marginTop: '0.25rem' }}>
            रु. {summary.totalCollectedAmount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2E7D32', marginTop: '0.2rem' }}>{summary.paidFinesCount} वटा चुक्ता</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>असुली हुन बाँकी (Pending)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#C62828', marginTop: '0.25rem' }}>
            रु. {summary.totalPendingAmount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#C62828', marginTop: '0.2rem' }}>{summary.pendingFinesCount} वटा बाँकी</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="घर नं., व्यक्ति वा जरिवाना ID खोज्नुहोस्..."
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
            <option value="Pending">बाँकी (Pending)</option>
            <option value="Paid">चुक्ता (Paid)</option>
            <option value="Waived">मिनाहा (Waived)</option>
          </select>
        </div>
      </div>

      {/* Fines Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>जरिवाना ID</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>घर नं.</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>सम्बन्धित व्यक्ति</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>जरिवाना प्रकार</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>रकम</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>कारण (Reason)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>स्थिति</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)', textAlign: 'right' }}>कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    जरिवाना विवरण लोड हुँदैछ...
                  </td>
                </tr>
              ) : fines.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    कुनै जरिवाना फेला परेन।
                  </td>
                </tr>
              ) : (
                fines.map((fine) => (
                  <tr key={fine._id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {fine.fineId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>
                      {fine.house?.houseNumber || fine.houseId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                      {fine.personName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', backgroundColor: '#F0ECE4', color: '#444' }}>
                        {fine.fineType}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#111' }}>
                      रु. {fine.amount}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#555' }}>
                      {fine.reason}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: fine.status === 'Paid' ? '#E8F5E9' : fine.status === 'Pending' ? '#FFEBEE' : '#FFF8E1',
                          color: fine.status === 'Paid' ? '#2E7D32' : fine.status === 'Pending' ? '#C62828' : '#F57F17'
                        }}
                      >
                        {fine.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {fine.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => openPayModal(fine)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#2E7D32',
                                color: '#FFF',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              भुक्तानी लिनुहोस्
                            </button>
                            <button
                              onClick={() => handleWaive(fine._id)}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                border: '1px solid #D0C9BE',
                                backgroundColor: '#FFF',
                                color: '#555',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              मिनाहा
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(fine._id)}
                          style={{
                            padding: '0.35rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #FFCDD2',
                            backgroundColor: '#FFF',
                            color: '#C62828',
                            cursor: 'pointer'
                          }}
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

      {/* Add Fine Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '550px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              नयाँ जरिवाना दर्ता फारम
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              टोल नियम अनुसार जरिवाना विवरण
            </p>

            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>घरधुरी छान्नुहोस् (Select House) *</label>
                <select
                  required
                  value={formData.houseIdDb}
                  onChange={(e) => handleHouseSelect(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                >
                  <option value="">-- घर छान्नुहोस् --</option>
                  {houses.map(h => (
                    <option key={h._id} value={h._id}>
                      घर नं. {h.houseNumber} - {h.representativeName} ({h.houseId})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>जरिवाना प्रकार (Fine Type)</label>
                  <select
                    value={formData.fineType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fineType: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    <option value="Meeting Absence">बैठक अनुपस्थिति (Absence)</option>
                    <option value="Late Attendance">ढिलो उपस्थिति (Late)</option>
                    <option value="Tole Rule Violation">टोल नियम उल्लङ्घन</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>जरिवाना रकम (NPR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>जरिवानाको कारण (Reason) *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="उदा: साउन १ गतेको नियमित बैठकमा बिना जानकारी अनुपस्थित..."
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                  {saving ? 'दर्ता हुँदैछ...' : 'जरिवाना दर्ता गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Fine Modal */}
      {showPayModal && selectedFine && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '1.5rem', position: 'relative' }}>
            <button onClick={() => setShowPayModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              जरिवाना भुक्तानी दर्ता (Pay Fine)
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {selectedFine.personName} (घर नं. {selectedFine.house?.houseNumber || selectedFine.houseId}) • कुल जरिवाना: रु. {selectedFine.amount}
            </p>

            <form onSubmit={handlePaySubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>भुक्तानी रकम (Amount) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedFine.amount}
                  value={payFormData.paidAmount}
                  onChange={(e) => setPayFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontWeight: '700' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>भुक्तानी माध्यम (Payment Method)</label>
                <select
                  value={payFormData.paymentMethod}
                  onChange={(e) => setPayFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                >
                  <option value="Cash">नगद (Cash)</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                  <option value="Fonepay">Fonepay</option>
                  <option value="Bank Transfer">बैंक ट्रान्सफर (Bank Transfer)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowPayModal(false)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}>
                  रद्द
                </button>
                <button type="submit" disabled={saving} style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#2E7D32', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                  {saving ? 'दर्ता हुँदैछ...' : 'भुक्तानी स्वीकृत गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinesView;
