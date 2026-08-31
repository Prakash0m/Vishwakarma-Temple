import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

const MembersView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMemberProfile, setSelectedMemberProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    nameDevanagari: '',
    phone: '',
    email: '',
    address: '',
    membershipType: 'General Member',
    status: 'Active',
    occupation: '',
    notes: ''
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members', {
        params: { search, status: statusFilter, membershipType: typeFilter }
      });
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      addToast('सदस्य विवरण लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter, typeFilter]);

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      memberId: '',
      name: '',
      nameDevanagari: '',
      phone: '',
      email: '',
      address: 'छापकी-५, सप्तरी',
      membershipType: 'General Member',
      status: 'Active',
      occupation: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      memberId: member.memberId,
      name: member.name,
      nameDevanagari: member.nameDevanagari || '',
      phone: member.phone,
      email: member.email || '',
      address: member.address,
      membershipType: member.membershipType,
      status: member.status,
      occupation: member.occupation || '',
      notes: member.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenProfile = async (member) => {
    setIsProfileOpen(true);
    setProfileLoading(true);
    try {
      const res = await api.get(`/members/${member._id}`);
      if (res.data.success) {
        setSelectedMemberProfile(res.data.data);
      }
    } catch (err) {
      addToast('सदस्य प्रोफाइल लोड गर्न सकिएन।', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        const res = await api.put(`/members/${editingMember._id}`, formData);
        if (res.data.success) {
          addToast('सदस्य विवरण सफलतापूर्वक अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchMembers();
        }
      } else {
        const res = await api.post('/members', formData);
        if (res.data.success) {
          addToast('नयाँ सदस्य सफलतापूर्वक दर्ता भयो।', 'success');
          setIsModalOpen(false);
          fetchMembers();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'सदस्य सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      try {
        const res = await api.delete(`/members/${id}`);
        if (res.data.success) {
          addToast('सदस्य विवरण हटाइयो।', 'success');
          fetchMembers();
        }
      } catch (err) {
        addToast('सदस्य हटाउन सकिएन।', 'error');
      }
    }
  };

  return (
    <div>
      {/* Top Header & Search Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            मन्दिर सदस्य व्यवस्थापन (Member Directory)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>नयाँ सदस्य थप्नुहोस् (Add Member)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--border-radius-md)',
        padding: '1rem',
        border: '1px solid var(--border-gold)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            placeholder="नाम, सदस्य ID वा फोन नम्बरबाट खोज्नुहोस्..."
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', minWidth: '140px' }}
        >
          <option value="All">सबै स्थिति (All Status)</option>
          <option value="Active">Active (सक्रिय)</option>
          <option value="Inactive">Inactive (निष्क्रिय)</option>
        </select>

        {/* Membership Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="All">सबै सदस्यता प्रकार</option>
          <option value="Life Member">Life Member (आजीवन)</option>
          <option value="Executive Member">Executive Member (कार्यसमिति)</option>
          <option value="Patron">Patron (संरक्षक)</option>
          <option value="General Member">General Member (साधारण)</option>
        </select>
      </div>

      {/* Members Data Table */}
      <div className="temple-card">
        <div className="temple-table-wrapper">
          <table className="temple-table">
            <thead>
              <tr>
                <th>सदस्य ID</th>
                <th>नाम</th>
                <th>फोन</th>
                <th>ठेगाना</th>
                <th>सदस्यता प्रकार</th>
                <th>कुल चन्दा</th>
                <th>स्थिति</th>
                <th style={{ textAlign: 'right' }}>कार्यहरू</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    लोड हुँदैछ...
                  </td>
                </tr>
              ) : members.length > 0 ? (
                members.map((m) => (
                  <tr key={m._id}>
                    <td><code style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{m.memberId}</code></td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {m.nameDevanagari || m.name}
                      </div>
                      {m.occupation && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.occupation}</div>}
                    </td>
                    <td>{m.phone}</td>
                    <td>{m.address}</td>
                    <td>
                      <span className="badge badge-gold">{m.membershipType}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-green)' }}>
                        रु. {m.totalDonated ? m.totalDonated.toLocaleString('ne-NP') : '०'}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'Active' ? 'badge-green' : 'badge-maroon'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenProfile(m)}
                          className="btn btn-sm btn-outline-gold"
                          title="View Profile & Donation History"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="btn btn-sm btn-outline"
                          title="Edit Member"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(m._id)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: '1px solid #F87171',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            cursor: 'pointer'
                          }}
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    कुनै सदस्य फेला परेन।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingMember ? 'सदस्य विवरण सम्पादन (Edit Member)' : 'नयाँ सदस्य दर्ता (Add Member)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">सदस्य ID (वैकल्पिक/Auto)</label>
                    <input
                      type="text"
                      name="memberId"
                      value={formData.memberId}
                      onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                      className="form-control"
                      placeholder="उदा. VKT-2026-001"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">पूरा नाम (Full Name) *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-control"
                      placeholder="उदा. राम प्रसाद शर्मा"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">फोन नम्बर (Phone) *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-control"
                      placeholder="९८५२०१२३४५"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">इमेल (Email)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                      placeholder="sharma@example.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">ठेगाना (Address) *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="form-control"
                      placeholder="छापकी-५, सप्तरी"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">पेशा (Occupation)</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      className="form-control"
                      placeholder="उदा. इन्जिनियर / व्यवसायी"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">सदस्यता प्रकार (Type)</label>
                    <select
                      name="membershipType"
                      value={formData.membershipType}
                      onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                      className="form-control"
                    >
                      <option value="General Member">General Member (साधारण सदस्य)</option>
                      <option value="Life Member">Life Member (आजीवन सदस्य)</option>
                      <option value="Executive Member">Executive Member (कार्यसमिति)</option>
                      <option value="Patron">Patron (संरक्षक)</option>
                      <option value="Honorary">Honorary (मानार्थ)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">स्थिति (Status)</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="form-control"
                    >
                      <option value="Active">Active (सक्रिय)</option>
                      <option value="Inactive">Inactive (निष्क्रिय)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">टिप्पणी / विवरण (Notes)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="form-control"
                    placeholder="विशेष योगदान, पद वा जानकारी..."
                    rows={2}
                  />
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMember ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'सदस्य सुरक्षित गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Member Profile Drawer & Full Donation History */}
      {isProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                सदस्य प्रोफाइल तथा चन्दा इतिहास (Member Profile & Donations)
              </h3>
              <button onClick={() => setIsProfileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {profileLoading || !selectedMemberProfile ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>प्रोफाइल लोड हुँदैछ...</div>
              ) : (
                <div>
                  {/* Member Summary Header */}
                  <div style={{
                    backgroundColor: 'var(--bg-cream-alt)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1px solid var(--border-gold)',
                    marginBottom: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>सदस्यको नाम</div>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)' }}>
                        {selectedMemberProfile.member.name}
                      </strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-saffron-dark)', fontWeight: '600' }}>
                        ID: {selectedMemberProfile.member.memberId}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>सम्पर्क र ठेगाना</div>
                      <div style={{ fontSize: '0.88rem' }}>📞 {selectedMemberProfile.member.phone}</div>
                      <div style={{ fontSize: '0.88rem' }}>📍 {selectedMemberProfile.member.address}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>कुल योगदान</div>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--color-green)' }}>
                        रु. {selectedMemberProfile.totalDonated?.toLocaleString('ne-NP')}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        कुल {selectedMemberProfile.donationCount} पटक चन्दा
                      </div>
                    </div>
                  </div>

                  {/* Donation History Table */}
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                    चन्दा तथा आर्थिक योगदान इतिहास ({selectedMemberProfile.donations?.length || 0})
                  </h4>

                  <div className="temple-table-wrapper" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    <table className="temple-table">
                      <thead>
                        <tr>
                          <th>मिति</th>
                          <th>रसिद</th>
                          <th>उद्देश्य</th>
                          <th>रकम</th>
                          <th>माध्यम</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMemberProfile.donations?.length > 0 ? (
                          selectedMemberProfile.donations.map((d) => (
                            <tr key={d._id}>
                              <td>{new Date(d.date).toLocaleDateString()}</td>
                              <td><code>{d.receiptNumber}</code></td>
                              <td>{d.purpose}</td>
                              <td style={{ color: 'var(--color-green)', fontWeight: '700' }}>
                                रु. {d.amount?.toLocaleString('ne-NP')}
                              </td>
                              <td><span className="badge badge-gold">{d.paymentMethod}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                              यस सदस्यको कुनै चन्दा रेकर्ड भेटिएन।
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setIsProfileOpen(false)} className="btn btn-primary">
                बन्द गर्नुहोस् (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersView;
