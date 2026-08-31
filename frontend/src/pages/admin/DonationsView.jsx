import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Printer,
  X,
  User,
  Filter,
  CheckCircle
} from 'lucide-react';

const DonationsView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [donations, setDonations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [filteredTotal, setFilteredTotal] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [formData, setFormData] = useState({
    receiptNumber: '',
    donorName: '',
    donorPhone: '',
    donorAddress: '',
    memberId: '',
    amount: '',
    purpose: 'सामान्य मन्दिर कोष',
    paymentMethod: 'Cash',
    transactionId: '',
    privacy: 'public',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donations', {
        params: { search, paymentMethod: paymentFilter, purpose: purposeFilter }
      });
      if (res.data.success) {
        setDonations(res.data.data);
        setFilteredTotal(res.data.filteredTotalAmount || 0);
      }
    } catch (err) {
      addToast('चन्दा विवरण लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [search, paymentFilter, purposeFilter]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingDonation(null);
    setFormData({
      receiptNumber: '',
      donorName: '',
      donorPhone: '',
      donorAddress: 'छापकी, सप्तरी',
      memberId: '',
      amount: '',
      purpose: 'सामान्य मन्दिर कोष',
      paymentMethod: 'Cash',
      transactionId: '',
      privacy: 'public',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (donation) => {
    setEditingDonation(donation);
    setFormData({
      receiptNumber: donation.receiptNumber,
      donorName: donation.donorName,
      donorPhone: donation.donorPhone || '',
      donorAddress: donation.donorAddress || '',
      memberId: donation.member?._id || '',
      amount: donation.amount,
      purpose: donation.purpose,
      paymentMethod: donation.paymentMethod,
      transactionId: donation.transactionId || '',
      privacy: donation.privacy || 'public',
      date: donation.date ? new Date(donation.date).toISOString().split('T')[0] : '',
      notes: donation.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleMemberSelect = (memberId) => {
    const mem = members.find(m => m._id === memberId);
    if (mem) {
      setFormData(prev => ({
        ...prev,
        memberId: mem._id,
        donorName: mem.name,
        donorPhone: mem.phone,
        donorAddress: mem.address
      }));
    } else {
      setFormData(prev => ({ ...prev, memberId: '' }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.donorName || !formData.amount || Number(formData.amount) <= 0) {
      addToast('कृपया दाताको नाम र वैध चन्दा रकम प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    try {
      const payload = {
        ...formData,
        member: formData.memberId || null
      };

      if (editingDonation) {
        const res = await api.put(`/donations/${editingDonation._id}`, payload);
        if (res.data.success) {
          addToast('चन्दा विवरण अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchDonations();
        }
      } else {
        const res = await api.post('/donations', payload);
        if (res.data.success) {
          addToast('चन्दा सफलतापूर्वक संकलन तथा दर्ता गरियो।', 'success');
          setIsModalOpen(false);
          fetchDonations();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'चन्दा रेकर्ड सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm('के तपाईं यो चन्दा रेकर्ड मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/donations/${id}`);
        if (res.data.success) {
          addToast('चन्दा रेकर्ड हटाइयो।', 'success');
          fetchDonations();
        }
      } catch (err) {
        addToast('चन्दा रेकर्ड हटाउन सकिएन।', 'error');
      }
    }
  };

  const handlePrintReceipt = (donation) => {
    setSelectedReceipt(donation);
    setIsReceiptModalOpen(true);
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HeartHandshake size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            चन्दा तथा दान संकलन (Chanda Collection)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-green">
          <Plus size={16} />
          <span>नयाँ चन्दा संकलन (Record Donation)</span>
        </button>
      </div>

      {/* Filter and Summary Strip */}
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
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              placeholder="दाताको नाम, रसिद वा ट्रान्जेक्सन ID..."
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="All">सबै भुक्तानी माध्यम</option>
            <option value="Cash">Cash (नगद)</option>
            <option value="eSewa">eSewa</option>
            <option value="Khalti">Khalti</option>
            <option value="Fonepay">Fonepay</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            <option value="All">सबै उद्देश्य (All Purposes)</option>
            <option value="सामान्य मन्दिर कोष">सामान्य मन्दिर कोष</option>
            <option value="मन्दिर मर्मत तथा रंगरोगन">मन्दिर मर्मत</option>
            <option value="अन्नपूर्णा महाप्रसाद कोष">अन्नपूर्णा महाप्रसाद</option>
            <option value="विश्वकर्मा जयन्ती महामहोत्सव">विश्वकर्मा जयन्ती</option>
            <option value="दैनिक पूजा तथा दीप प्रज्वलन">दैनिक पूजा</option>
          </select>
        </div>

        <div style={{
          backgroundColor: 'var(--color-green-subtle)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(45, 106, 79, 0.3)'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-green-dark)' }}>फिल्टर गरिएको कुल चन्दा: </span>
          <strong style={{ fontSize: '1.15rem', color: 'var(--color-green-dark)' }}>
            रु. {filteredTotal.toLocaleString('ne-NP')}
          </strong>
        </div>
      </div>

      {/* Donations Data Table */}
      <div className="temple-card">
        <div className="temple-table-wrapper">
          <table className="temple-table">
            <thead>
              <tr>
                <th>रसिद नं.</th>
                <th>मिति</th>
                <th>दाताको नाम</th>
                <th>सदस्य संलग्नता</th>
                <th>उद्देश्य</th>
                <th>रकम (रु.)</th>
                <th>माध्यम</th>
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
              ) : donations.length > 0 ? (
                donations.map((d) => (
                  <tr key={d._id}>
                    <td><code style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{d.receiptNumber}</code></td>
                    <td>{new Date(d.date).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {d.donorName}
                      </div>
                      {d.donorPhone && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.donorPhone}</div>}
                    </td>
                    <td>
                      {d.member ? (
                        <span className="badge badge-maroon">
                          {d.member.name} ({d.member.memberId})
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>श्रद्धालु (Guest)</span>
                      )}
                    </td>
                    <td>{d.purpose}</td>
                    <td>
                      <strong style={{ color: 'var(--color-green)', fontSize: '0.98rem' }}>
                        रु. {d.amount?.toLocaleString('ne-NP')}
                      </strong>
                    </td>
                    <td><span className="badge badge-gold">{d.paymentMethod}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handlePrintReceipt(d)}
                          className="btn btn-sm btn-outline-gold"
                          title="Print Receipt"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(d)}
                          className="btn btn-sm btn-outline"
                          title="Edit Record"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteDonation(d._id)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: '1px solid #F87171',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            cursor: 'pointer'
                          }}
                          title="Delete Record"
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
                    कुनै चन्दा रेकर्ड फेला परेन।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Donation Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingDonation ? 'चन्दा विवरण सम्पादन (Edit Donation)' : 'नयाँ चन्दा संकलन प्रविष्टि (Record Donation)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                {/* Link with Member Dropdown */}
                <div className="form-group">
                  <label className="form-label">मन्दिर सदस्य छनौट (यदि सदस्य हुनुहुन्छ भने)</label>
                  <select
                    value={formData.memberId}
                    onChange={(e) => handleMemberSelect(e.target.value)}
                    className="form-control"
                  >
                    <option value="">-- नयाँ वा अन्य श्रद्धालु (Non-member) --</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.memberId}) - {m.address}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">दाताको नाम (Donor Name) *</label>
                    <input
                      type="text"
                      name="donorName"
                      value={formData.donorName}
                      onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                      className="form-control"
                      placeholder="उदा. राम प्रसाद शर्मा"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">सहयोग रकम (रु.) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="form-control"
                      placeholder="उदा. २५०००"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">फोन नम्बर (Phone)</label>
                    <input
                      type="tel"
                      name="donorPhone"
                      value={formData.donorPhone}
                      onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                      className="form-control"
                      placeholder="९८५२०१२३४५"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ठेगाना (Address)</label>
                    <input
                      type="text"
                      name="donorAddress"
                      value={formData.donorAddress}
                      onChange={(e) => setFormData({ ...formData, donorAddress: e.target.value })}
                      className="form-control"
                      placeholder="छापकी-५, सप्तरी"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">भुक्तानी माध्यम (Method)</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="form-control"
                    >
                      <option value="Cash">Cash (नगद)</option>
                      <option value="eSewa">eSewa</option>
                      <option value="Khalti">Khalti</option>
                      <option value="Fonepay">Fonepay</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Other">अन्य</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">मिति (Date)</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="form-control"
                    >
                    </input>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">दानको उद्देश्य (Purpose)</label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="form-control"
                    >
                      <option value="सामान्य मन्दिर कोष">सामान्य मन्दिर कोष</option>
                      <option value="मन्दिर मर्मत तथा रंगरोगन">मन्दिर मर्मत तथा रंगरोगन</option>
                      <option value="अन्नपूर्णा महाप्रसाद कोष">अन्नपूर्णा महाप्रसाद कोष</option>
                      <option value="दैनिक पूजा तथा दीप प्रज्वलन">दैनिक पूजा तथा दीप प्रज्वलन</option>
                      <option value="विश्वकर्मा जयन्ती महामहोत्सव">विश्वकर्मा जयन्ती महामहोत्सव</option>
                      <option value="सामाजिक तथा स्वास्थ्य सेवा">सामाजिक तथा स्वास्थ्य सेवा</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">गोपनीयता (Privacy)</label>
                    <select
                      name="privacy"
                      value={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                      className="form-control"
                    >
                      <option value="public">सार्वजनिक देखाउने (Public)</option>
                      <option value="initials">संक्षिप्त नाम (Initials)</option>
                      <option value="anonymous">गोप्य राख्ने (Anonymous)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reference / Transaction ID</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    className="form-control"
                    placeholder="उदा. NBL-99214 / ESW-12345"
                  />
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-green">
                    {editingDonation ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'चन्दा दर्ता गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Printable Modal */}
      {isReceiptModalOpen && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setIsReceiptModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                आधिकारिक चन्दा रसिद (Donation Receipt)
              </h3>
              <button onClick={() => setIsReceiptModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" id="printable-receipt">
              {/* Receipt Visual Layout */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-gold)',
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative'
              }}>
                {/* Temple Header */}
                <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--border-gold)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-saffron)' }}>ॐ श्री विश्वकर्मणे नमः</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '1.35rem' }}>
                    श्री विश्वकर्मा मन्दिर
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण, सप्तरी, नेपाल</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>फोन: +९७७-३१-५२०१२३</div>
                </div>

                {/* Receipt Data Table */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span>रसिद नम्बर: <strong>{selectedReceipt.receiptNumber}</strong></span>
                  <span>मिति: <strong>{new Date(selectedReceipt.date).toLocaleDateString()}</strong></span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>श्रीमान/श्रीमती:</span>
                    <strong>{selectedReceipt.donorName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>ठेगाना / सम्पर्क:</span>
                    <span>{selectedReceipt.donorAddress || 'छापकी, सप्तरी'} ({selectedReceipt.donorPhone || 'N/A'})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>चन्दाको उद्देश्य:</span>
                    <span>{selectedReceipt.purpose}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>भुक्तानी माध्यम:</span>
                    <span>{selectedReceipt.paymentMethod} {selectedReceipt.transactionId ? `(${selectedReceipt.transactionId})` : ''}</span>
                  </div>
                </div>

                {/* Total Box */}
                <div style={{
                  backgroundColor: 'var(--color-green-subtle)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(45, 106, 79, 0.4)',
                  marginBottom: '1.5rem'
                }}>
                  <span style={{ fontWeight: '700', color: 'var(--color-green-dark)' }}>प्राप्त सहयोग रकम:</span>
                  <strong style={{ fontSize: '1.3rem', color: 'var(--color-green-dark)' }}>
                    रु. {selectedReceipt.amount?.toLocaleString('ne-NP')}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div>
                    <div>जय विश्वकर्मा भगवान 🙏</div>
                    <div style={{ fontSize: '0.72rem' }}>सम्पर्क: info@vishwakarmatemple.org.np</div>
                  </div>
                  <div style={{ textAlign: 'center', borderTop: '1px solid #000', paddingTop: '4px', minWidth: '120px' }}>
                    अधिकृत हस्ताक्षर
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => window.print()}
                className="btn btn-primary"
                style={{ gap: '6px' }}
              >
                <Printer size={16} />
                <span>प्रिन्ट गर्नुहोस् (Print)</span>
              </button>
              <button onClick={() => setIsReceiptModalOpen(false)} className="btn btn-outline">
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsView;
