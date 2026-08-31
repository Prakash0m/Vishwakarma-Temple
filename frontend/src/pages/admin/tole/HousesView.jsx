import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Home,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Clock,
  UserCheck,
  UserX,
  FileText
} from 'lucide-react';

const HousesView = () => {
  const { t, language } = useLanguage();
  const [houses, setHouses] = useState([]);
  const [summary, setSummary] = useState({
    totalHouses: 0,
    singleFamilyCount: 0,
    jointFamilyCount: 0,
    totalPopulation: 0,
    totalMale: 0,
    totalFemale: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [familyTypeFilter, setFamilyTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedHouseTimeline, setSelectedHouseTimeline] = useState(null);
  const [editingHouse, setEditingHouse] = useState(null);
  const [activeProfileTab, setActiveProfileTab] = useState('members'); // 'members', 'attendance', 'funds', 'fines', 'weddings'

  // Form state
  const [formData, setFormData] = useState({
    houseNumber: '',
    familyType: 'Single Family',
    representativeName: '',
    representativePhone: '',
    alternatePhone: '',
    address: 'छापकी-५, सप्तरी',
    notes: '',
    familyMembers: [
      { memberId: 'MEM-0001', fullName: '', gender: 'Male', relationship: 'घरमुली (Head)', phone: '', age: '', occupation: '', isRepresentative: true, status: 'Active' }
    ]
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchHouses();
  }, [search, familyTypeFilter, statusFilter]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/houses', {
        params: {
          search,
          familyType: familyTypeFilter,
          status: statusFilter
        }
      });
      if (res.data.success) {
        setHouses(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching houses:', err);
    } finally {
      setLoading(false);
    }
  };

  const openProfile = async (house) => {
    try {
      const res = await api.get(`/tole/houses/${house._id}`);
      if (res.data.success) {
        setSelectedHouseTimeline(res.data.data);
        setActiveProfileTab('members');
        setShowProfileModal(true);
      }
    } catch (err) {
      console.error('Error fetching house details:', err);
    }
  };

  const handleOpenAdd = () => {
    setEditingHouse(null);
    setFormData({
      houseNumber: '',
      familyType: 'Single Family',
      representativeName: '',
      representativePhone: '',
      alternatePhone: '',
      address: 'छापकी-५, सप्तरी',
      notes: '',
      familyMembers: [
        { memberId: 'MEM-0001', fullName: '', gender: 'Male', relationship: 'घरमुली (Head)', phone: '', age: '', occupation: '', isRepresentative: true, status: 'Active' }
      ]
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (house) => {
    setEditingHouse(house);
    setFormData({
      houseNumber: house.houseNumber,
      familyType: house.familyType,
      representativeName: house.representativeName,
      representativePhone: house.representativePhone,
      alternatePhone: house.alternatePhone || '',
      address: house.address,
      notes: house.notes || '',
      familyMembers: house.familyMembers && house.familyMembers.length > 0 ? house.familyMembers : [
        { memberId: 'MEM-0001', fullName: house.representativeName, gender: 'Male', relationship: 'घरमुली (Head)', phone: house.representativePhone, isRepresentative: true, status: 'Active' }
      ]
    });
    setShowAddModal(true);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.familyMembers];
    updated[index][field] = value;
    if (field === 'fullName' && updated[index].isRepresentative) {
      setFormData(prev => ({ ...prev, representativeName: value, familyMembers: updated }));
      return;
    }
    if (field === 'phone' && updated[index].isRepresentative) {
      setFormData(prev => ({ ...prev, representativePhone: value, familyMembers: updated }));
      return;
    }
    setFormData(prev => ({ ...prev, familyMembers: updated }));
  };

  const addMemberRow = () => {
    const nextIdx = formData.familyMembers.length + 1;
    setFormData(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        {
          memberId: `MEM-${String(nextIdx).padStart(4, '0')}`,
          fullName: '',
          gender: 'Male',
          relationship: 'छोरा (Son)',
          phone: '',
          age: '',
          occupation: '',
          isRepresentative: false,
          status: 'Active'
        }
      ]
    }));
  };

  const removeMemberRow = (index) => {
    if (formData.familyMembers.length <= 1) return;
    const updated = formData.familyMembers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, familyMembers: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);

      // Ensure representative name is synced
      const rep = formData.familyMembers.find(m => m.isRepresentative) || formData.familyMembers[0];
      const payload = {
        ...formData,
        representativeName: formData.representativeName || rep.fullName,
        representativePhone: formData.representativePhone || rep.phone
      };

      if (editingHouse) {
        await api.put(`/tole/houses/${editingHouse._id}`, payload);
        setMessage({ type: 'success', text: 'घर विवरण सफलतापूर्वक अद्यावधिक भयो (House updated)' });
      } else {
        await api.post('/tole/houses', payload);
        setMessage({ type: 'success', text: 'नयाँ घर सफलतापूर्वक दर्ता भयो (House registered)' });
      }

      setShowAddModal(false);
      fetchHouses();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'सुरक्षित गर्दा त्रुटि भयो' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, houseNo) => {
    if (window.confirm(`के तपाईं घर नं. ${houseNo} मेटाउन निश्चित हुनुहुन्छ?`)) {
      try {
        await api.delete(`/tole/houses/${id}`);
        fetchHouses();
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
            टोल घरधुरी तथा परिवार व्यवस्थापन (House Directory)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            छापकी (वडा नं. ५), सप्तरी • एकल तथा संयुक्त परिवार अभिलेखीकरण
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
          <span>नयाँ घर दर्ता गर्नुहोस्</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल घरधुरी (Total Houses)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
                {summary.totalHouses}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Home size={22} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>एकल परिवार (Single Family)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2B7A78', marginTop: '0.25rem' }}>
                {summary.singleFamilyCount}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#E6F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2B7A78' }}>
              <Users size={22} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>संयुक्त परिवार (Joint Family)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#D9531E', marginTop: '0.25rem' }}>
                {summary.jointFamilyCount}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FDF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9531E' }}>
              <Home size={22} />
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल जनसंख्या (Total Members)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#3A2E39', marginTop: '0.25rem' }}>
                {summary.totalPopulation}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F2EFF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3A2E39' }}>
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="घर नं., नाम वा फोन नम्बर खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem 0.65rem 2.25rem',
              borderRadius: '8px',
              border: '1px solid #D0C9BE',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>परिवार प्रकार:</label>
          <select
            value={familyTypeFilter}
            onChange={(e) => setFamilyTypeFilter(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
          >
            <option value="all">सबै (All)</option>
            <option value="Single Family">एकल परिवार (Single Family)</option>
            <option value="Joint Family">संयुक्त परिवार (Joint Family)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>स्थिति:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
          >
            <option value="all">सबै स्थिति</option>
            <option value="Active">सक्रिय (Active)</option>
            <option value="Inactive">निष्क्रिय (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Houses Data Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>घर ID</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>घर नं.</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>मुख्य अभिभावक (Representative)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>परिवार प्रकार</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>सदस्य संख्या</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>सम्पर्क नम्बर</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>स्थिति</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)', textAlign: 'right' }}>कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    घरधुरी विवरण लोड हुँदैछ...
                  </td>
                </tr>
              ) : houses.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    कुनै घर फेला परेन।
                  </td>
                </tr>
              ) : (
                houses.map((house) => (
                  <tr key={house._id} style={{ borderBottom: '1px solid #F0ECE4', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                      {house.houseId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#111' }}>
                      {house.houseNumber}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: '600', color: '#222' }}>{house.representativeName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#777' }}>{house.address}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: house.familyType.includes('Joint') ? '#FDF0EA' : '#E6F4F1',
                          color: house.familyType.includes('Joint') ? '#D9531E' : '#2B7A78'
                        }}
                      >
                        {house.familyType}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={14} color="#666" />
                        <span style={{ fontWeight: '600' }}>{house.totalMembers || house.familyMembers?.length || 1} जना</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>
                        (पु: {house.maleCount || 0} / म: {house.femaleCount || 0})
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: '600', color: '#444' }}>
                      {house.representativePhone}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: house.status === 'Active' || house.status === 'सक्रिय' ? '#E8F5E9' : '#FFEBEE',
                          color: house.status === 'Active' || house.status === 'सक्रिय' ? '#2E7D32' : '#C62828'
                        }}
                      >
                        {house.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openProfile(house)}
                          title="घर पूर्ण प्रोफाइल हेर्नुहोस्"
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--color-gold)',
                            backgroundColor: '#FAF7F2',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}
                        >
                          <Eye size={14} />
                          <span>प्रोफाइल</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(house)}
                          title="सम्पादन गर्नुहोस्"
                          style={{
                            padding: '0.35rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #D0C9BE',
                            backgroundColor: '#FFFFFF',
                            color: '#555',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(house._id, house.houseNumber)}
                          title="मेटाउनुहोस्"
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

      {/* Add / Edit House Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.4rem', marginBottom: '0.25rem' }}>
              {editingHouse ? `घर नं. ${editingHouse.houseNumber} सम्पादन` : 'नयाँ घरधुरी दर्ता फारम'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              छापकी टोल व्यवस्थापन प्रणाली • घर र सम्पूर्ण परिवार सदस्यहरूको विवरण
            </p>

            <form onSubmit={handleSubmit}>
              {/* House Main Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>घर नम्बर (House No.) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: १०१"
                    value={formData.houseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>परिवार प्रकार (Family Type) *</label>
                  <select
                    value={formData.familyType}
                    onChange={(e) => setFormData(prev => ({ ...prev, familyType: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  >
                    <option value="Single Family">एकल परिवार (Single Family)</option>
                    <option value="Joint Family">संयुक्त परिवार (Joint Family)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>सम्पर्क नम्बर (Representative Phone) *</label>
                  <input
                    type="text"
                    required
                    placeholder="98520XXXXX"
                    value={formData.representativePhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, representativePhone: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>ठेगाना (Address)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE' }}
                  />
                </div>
              </div>

              {/* Dynamic Family Members Section */}
              <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-gold)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary-dark)', margin: 0 }}>
                    परिवारका सदस्यहरू (Family Members: {formData.familyMembers.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addMemberRow}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-primary)',
                      color: 'var(--color-primary)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Plus size={14} />
                    <span>सदस्य थप्नुहोस्</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {formData.familyMembers.map((member, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#FFFFFF',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #E8E2D9',
                        display: 'grid',
                        gridTemplateColumns: '1fr 110px 140px 120px 70px 40px',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="पूरा नाम (Full Name)"
                          value={member.fullName}
                          onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                          style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <select
                          value={member.gender}
                          onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                          style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                        >
                          <option value="Male">पुरुष (Male)</option>
                          <option value="Female">महिला (Female)</option>
                          <option value="Other">अन्य (Other)</option>
                        </select>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          placeholder="नाता (उदा: छोरा, श्रीमती)"
                          value={member.relationship}
                          onChange={(e) => handleMemberChange(index, 'relationship', e.target.value)}
                          style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="फोन (वैकल्पिक)"
                          value={member.phone || ''}
                          onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                          style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          placeholder="उमेर"
                          value={member.age || ''}
                          onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                          style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                        />
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        {formData.familyMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMemberRow(index)}
                            style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer', padding: '0.25rem' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>थप टिप्पणी / विवरण (Notes)</label>
                <textarea
                  rows="2"
                  placeholder="कुनै विशेष टिप्पणी..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}
                >
                  {saving ? 'सुरक्षित हुँदैछ...' : 'सुरक्षित गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* House Profile Drawer / Modal with Complete Timeline */}
      {showProfileModal && selectedHouseTimeline && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '950px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setShowProfileModal(false)}
              style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={24} />
            </button>

            {/* Profile Header */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderBottom: '1px solid #E8E2D9', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--color-primary-subtle)', border: '2px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Home size={32} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                    घर नम्बर {selectedHouseTimeline.house.houseNumber} ({selectedHouseTimeline.house.houseId})
                  </h2>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FAF7F2', border: '1px solid var(--border-gold)', color: 'var(--color-primary)' }}>
                    {selectedHouseTimeline.house.familyType}
                  </span>
                </div>
                <div style={{ color: '#555', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  मुख्य अभिभावक: <strong>{selectedHouseTimeline.house.representativeName}</strong> • फोन: {selectedHouseTimeline.house.representativePhone} • {selectedHouseTimeline.house.address}
                </div>
              </div>
            </div>

            {/* Profile Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ backgroundColor: '#FAF7F2', padding: '0.9rem', borderRadius: '10px', border: '1px solid #E8E2D9' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>बैठक उपस्थिति दर</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                  {selectedHouseTimeline.metrics.attendancePercentage}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>
                  {selectedHouseTimeline.metrics.presentMeetings} / {selectedHouseTimeline.metrics.totalMeetings} बैठक उपस्थित
                </div>
              </div>

              <div style={{ backgroundColor: '#FAF7F2', padding: '0.9rem', borderRadius: '10px', border: '1px solid #E8E2D9' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>कुल टोल कोष भुक्तानी</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2E7D32' }}>
                  रु. {selectedHouseTimeline.metrics.totalFundPaid}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>स्वीकृत भुक्तानी</div>
              </div>

              <div style={{ backgroundColor: '#FAF7F2', padding: '0.9rem', borderRadius: '10px', border: '1px solid #E8E2D9' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>कुल जरिवाना बाँकी</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: selectedHouseTimeline.metrics.pendingFineAmount > 0 ? '#C62828' : '#2E7D32' }}>
                  रु. {selectedHouseTimeline.metrics.pendingFineAmount}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>
                  चुक्ता: रु. {selectedHouseTimeline.metrics.paidFineAmount}
                </div>
              </div>

              <div style={{ backgroundColor: '#FAF7F2', padding: '0.9rem', borderRadius: '10px', border: '1px solid #E8E2D9' }}>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>विवाह दर्ता</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#D9531E' }}>
                  {selectedHouseTimeline.timeline.weddings.length} वटा
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>पारिवारिक विवाह</div>
              </div>
            </div>

            {/* Profile Tab Navigation */}
            <div style={{ display: 'flex', borderBottom: '2px solid #F0ECE4', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[
                { key: 'members', label: `परिवार सदस्यहरू (${selectedHouseTimeline.house.familyMembers?.length || 0})` },
                { key: 'attendance', label: `बैठक उपस्थिति (${selectedHouseTimeline.timeline.attendance.length})` },
                { key: 'funds', label: `मासिक कोष भुक्तानी (${selectedHouseTimeline.timeline.fundPayments.length})` },
                { key: 'fines', label: `जरिवाना अभिलेख (${selectedHouseTimeline.timeline.fines.length})` },
                { key: 'weddings', label: `विवाह दर्ता (${selectedHouseTimeline.timeline.weddings.length})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveProfileTab(tab.key)}
                  style={{
                    padding: '0.65rem 1rem',
                    border: 'none',
                    borderBottom: activeProfileTab === tab.key ? '3px solid var(--color-primary)' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: activeProfileTab === tab.key ? 'var(--color-primary-dark)' : '#666',
                    fontWeight: activeProfileTab === tab.key ? '700' : '500',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeProfileTab === 'members' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                      <th style={{ padding: '0.65rem 0.85rem' }}>सदस्य ID</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>पूरा नाम</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>लिङ्ग</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>नाता (Relationship)</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>उमेर</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>पेशा</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>सम्पर्क नम्बर</th>
                      <th style={{ padding: '0.65rem 0.85rem' }}>स्थिति</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHouseTimeline.house.familyMembers.map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F0ECE4' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: '600', color: 'var(--color-primary)' }}>{m.memberId}</td>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: '600' }}>
                          {m.fullName} {m.isRepresentative && <span style={{ fontSize: '0.7rem', color: '#D9531E' }}>(घरमुली)</span>}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{m.gender}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{m.relationship}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{m.age ? `${m.age} वर्ष` : '-'}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{m.occupation || '-'}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>{m.phone || '-'}</td>
                        <td style={{ padding: '0.65rem 0.85rem' }}>
                          <span style={{ padding: '0.15rem 0.45rem', borderRadius: '10px', fontSize: '0.72rem', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeProfileTab === 'attendance' && (
              <div>
                {selectedHouseTimeline.timeline.attendance.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>कुनै बैठक उपस्थिति विवरण फेला परेन।</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {selectedHouseTimeline.timeline.attendance.map((att, idx) => (
                      <div key={idx} style={{ padding: '0.85rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8E2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#222' }}>{att.meeting?.title || 'टोल बैठक'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            मिति: {new Date(att.date).toLocaleDateString()} • उपस्थित व्यक्ति: {att.attendeeName || att.representativeName}
                          </div>
                          {att.remarks && <div style={{ fontSize: '0.75rem', color: '#C62828', marginTop: '0.2rem' }}>कैफियत: {att.remarks}</div>}
                        </div>
                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: att.status === 'Present' || att.status === 'उपस्थित' ? '#E8F5E9' : '#FFEBEE', color: att.status === 'Present' || att.status === 'उपस्थित' ? '#2E7D32' : '#C62828' }}>
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeProfileTab === 'funds' && (
              <div>
                {selectedHouseTimeline.timeline.fundPayments.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>कुनै कोष भुक्तानी विवरण छैन।</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {selectedHouseTimeline.timeline.fundPayments.map((p, idx) => (
                      <div key={idx} style={{ padding: '0.85rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8E2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#222' }}>
                            {p.campaign?.title || `${p.campaignMonth} ${p.campaignYear} मासिक कोष`} (ID: {p.paymentId})
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            रकम: <strong>रु. {p.amount}</strong> • माध्यम: {p.paymentMethod} • पेश मिति: {new Date(p.submittedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: p.status === 'Approved' || p.status === 'स्वीकृत' ? '#E8F5E9' : '#FFF8E1', color: p.status === 'Approved' || p.status === 'स्वीकृत' ? '#2E7D32' : '#F57F17' }}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeProfileTab === 'fines' && (
              <div>
                {selectedHouseTimeline.timeline.fines.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>यस घरको कुनै जरिवाना अभिलेख छैन।</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {selectedHouseTimeline.timeline.fines.map((f, idx) => (
                      <div key={idx} style={{ padding: '0.85rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8E2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#222' }}>
                            {f.fineType} - रु. {f.amount} ({f.fineId})
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            कारण: {f.reason} • मिति: {new Date(f.date).toLocaleDateString()}
                          </div>
                        </div>
                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: f.status === 'Paid' ? '#E8F5E9' : '#FFEBEE', color: f.status === 'Paid' ? '#2E7D32' : '#C62828' }}>
                          {f.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeProfileTab === 'weddings' && (
              <div>
                {selectedHouseTimeline.timeline.weddings.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>कुनै विवाह अभिलेख फेला परेन।</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {selectedHouseTimeline.timeline.weddings.map((w, idx) => (
                      <div key={idx} style={{ padding: '0.85rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E8E2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#222' }}>
                            शुभ विवाह: {w.brideName} र {w.groomName} ({w.weddingId})
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#666' }}>
                            मिति: {new Date(w.weddingDate).toLocaleDateString()} {w.weddingDateNepali && `(${w.weddingDateNepali})`} • स्थान: {w.location}
                          </div>
                        </div>
                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: '#FDF0EA', color: '#D9531E' }}>
                          {w.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HousesView;
