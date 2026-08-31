import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
  Printer,
  Eye,
  X,
  FileText,
  User,
  Image as ImageIcon,
  Check,
  AlertTriangle
} from 'lucide-react';

const FundApprovalsView = () => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPaymentsCount: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    totalCollectedAmount: 0,
    totalPendingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [search, setSearch] = useState('');

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, search]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/fund-payments', {
        params: { status: statusFilter, search }
      });
      if (res.data.success) {
        setPayments(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching fund payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (payment) => {
    setSelectedPayment(payment);
    setAdminRemarks(payment.adminRemarks || 'प्रशासनद्वारा प्रमाणीकरण गरी भुक्तानी स्वीकृत गरियो।');
    setShowReviewModal(true);
  };

  const openReceiptModal = (payment) => {
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      const res = await api.put(`/tole/fund-payments/${selectedPayment._id}/approve`, {
        adminRemarks
      });
      if (res.data.success) {
        alert('भुक्तानी सफलतापूर्वक स्वीकृत गरियो!');
        setShowReviewModal(false);
        fetchPayments();
      }
    } catch (err) {
      alert('स्वीकृत गर्दा त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('अस्वीकृत गर्नुको कारण लेख्नुहोस् (उदा: भौचर प्रष्ट छैन, रकम नमिलेको):');
    if (!reason) return;
    try {
      setProcessing(true);
      const res = await api.put(`/tole/fund-payments/${selectedPayment._id}/reject`, {
        adminRemarks: reason
      });
      if (res.data.success) {
        alert('भुक्तानी अस्वीकृत गरिएको छ।');
        setShowReviewModal(false);
        fetchPayments();
      }
    } catch (err) {
      alert('अस्वीकृत गर्दा त्रुटि: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            मासिक टोल कोष भुक्तानी स्वीकृति (Fund Approvals)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            घरधुरीबाट पेश गरिएका मासिक कोष भुक्तानी भौचर प्रमाणीकरण, स्वीकृति तथा आधिकारिक रसिद जारी
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #FFD166', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>प्रतीक्षारत भुक्तानीहरू (Pending)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#F57F17', marginTop: '0.25rem' }}>
            {summary.pendingCount} वटा (रु. {summary.totalPendingAmount})
          </div>
          <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.2rem' }}>समीक्षा तथा प्रमाणीकरण आवश्यक</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>स्वीकृत संकलित कोष (Approved)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2E7D32', marginTop: '0.25rem' }}>
            रु. {summary.totalCollectedAmount}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2E7D32', marginTop: '0.2rem' }}>{summary.approvedCount} वटा भुक्तानी स्वीकृत</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल आवेदनहरू</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#333', marginTop: '0.25rem' }}>
            {summary.totalPaymentsCount} वटा
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'Pending', label: `प्रतीक्षारत (${summary.pendingCount})`, color: '#F57F17' },
            { key: 'Approved', label: `स्वीकृत (${summary.approvedCount})`, color: '#2E7D32' },
            { key: 'Rejected', label: `अस्वीकृत (${summary.rejectedCount})`, color: '#C62828' },
            { key: 'all', label: 'सबै भुक्तानी', color: '#555' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '20px',
                border: statusFilter === tab.key ? `2px solid ${tab.color}` : '1px solid #D0C9BE',
                backgroundColor: statusFilter === tab.key ? '#FAF7F2' : '#FFFFFF',
                color: statusFilter === tab.key ? tab.color : '#666',
                fontWeight: statusFilter === tab.key ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '260px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="नाम, घर नं., फोन वा ID खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Payments Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>भुक्तानी ID</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>घर नं.</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>सदस्यको नाम / फोन</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>महिना (Month)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>रकम</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>माध्यम / भौचर</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>स्थिति</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)', textAlign: 'right' }}>कार्य</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    भुक्तानी विवरण लोड हुँदैछ...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    कुनै भुक्तानी विवरण फेला परेन।
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {p.paymentId}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700' }}>
                      {p.house?.houseNumber || p.houseNumber}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: '600' }}>{p.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#777' }}>{p.phone}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: '600', color: '#333' }}>
                        {p.campaignMonth} {p.campaignYear}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#2E7D32', fontSize: '0.95rem' }}>
                      रु. {p.amount}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontSize: '0.85rem' }}>{p.paymentMethod}</div>
                      {p.transactionId && <div style={{ fontSize: '0.72rem', color: '#777' }}>TXN: {p.transactionId}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: p.status === 'Approved' || p.status === 'स्वीकृत' ? '#E8F5E9' : p.status === 'Pending' || p.status === 'प्रतीक्षारत' ? '#FFF8E1' : '#FFEBEE',
                          color: p.status === 'Approved' || p.status === 'स्वीकृत' ? '#2E7D32' : p.status === 'Pending' || p.status === 'प्रतीक्षारत' ? '#F57F17' : '#C62828'
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        {p.status === 'Pending' || p.status === 'प्रतीक्षारत' ? (
                          <button
                            onClick={() => openReviewModal(p)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'var(--color-primary)',
                              color: '#FFF',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Eye size={14} />
                            <span>समीक्षा र स्वीकृति</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openReceiptModal(p)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-gold)',
                              backgroundColor: '#FAF7F2',
                              color: 'var(--color-primary)',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <Printer size={14} />
                            <span>रसिद</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review and Approval Modal */}
      {showReviewModal && selectedPayment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', position: 'relative' }}>
            <button onClick={() => setShowReviewModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              मासिक कोष भुक्तानी प्रमाणीकरण
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              भुक्तानी विवरण र संलग्न भौचर जाँच गरी स्वीकृत वा अस्वीकृत गर्नुहोस्
            </p>

            <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-gold)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><strong>भुक्तानी ID:</strong> {selectedPayment.paymentId}</div>
                <div><strong>घर नम्बर:</strong> {selectedPayment.house?.houseNumber || selectedPayment.houseNumber}</div>
                <div><strong>सदस्यको नाम:</strong> {selectedPayment.memberName}</div>
                <div><strong>फोन नम्बर:</strong> {selectedPayment.phone}</div>
                <div><strong>अभियान महिना:</strong> {selectedPayment.campaignMonth} {selectedPayment.campaignYear}</div>
                <div><strong>भुक्तानी रकम:</strong> <span style={{ color: '#2E7D32', fontWeight: '700', fontSize: '1.05rem' }}>रु. {selectedPayment.amount}</span></div>
                <div><strong>भुक्तानी माध्यम:</strong> {selectedPayment.paymentMethod}</div>
                <div><strong>कारोबार नं (TXN):</strong> {selectedPayment.transactionId || '-'}</div>
              </div>
            </div>

            {/* Voucher Proof Image Preview */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                संलग्न भौचर / भुक्तानी स्क्रिनसट (Payment Proof)
              </label>
              <div style={{ width: '100%', maxHeight: '250px', backgroundColor: '#F0ECE4', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D0C9BE' }}>
                {selectedPayment.receiptVoucherImage ? (
                  <img
                    src={selectedPayment.receiptVoucherImage}
                    alt="Payment Voucher"
                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: '0.85rem' }}>
                    <ImageIcon size={32} style={{ display: 'block', margin: '0 auto 0.5rem auto', color: '#888' }} />
                    भौचर तस्बिर संलग्न गरिएको छैन (अनलाइन वालेट कारोबार ID: {selectedPayment.transactionId || 'छैन'})
                  </div>
                )}
              </div>
            </div>

            {/* Admin Remarks */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                प्रशासकीय टिप्पणी (Admin Remarks)
              </label>
              <input
                type="text"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                disabled={processing}
                onClick={handleReject}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #FFCDD2', backgroundColor: '#FFEBEE', color: '#C62828', cursor: 'pointer', fontWeight: '700' }}
              >
                ✕ अस्वीकृत गर्नुहोस् (Reject)
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
                >
                  बन्द
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={handleApprove}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#2E7D32', color: '#FFF', cursor: 'pointer', fontWeight: '700' }}
                >
                  {processing ? 'स्वीकृत हुँदैछ...' : '✓ भुक्तानी स्वीकृत गर्नुहोस् (Approve)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {showReceiptModal && selectedPayment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowReceiptModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }} className="no-print">
              <X size={24} />
            </button>

            {/* Official Printable Receipt Card */}
            <div style={{ border: '2px solid var(--color-gold)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FAF7F2', position: 'relative' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-gold)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '700' }}>ॐ श्री विश्वकर्मणे नमः</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.4rem', margin: '0.2rem 0' }}>
                  विश्वकर्मा मन्दिर तथा छापकी टोल विकास समिति
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  छापकी (वडा नं. ५), अग्निसाइर कृष्णासवरण गाउँपालिका, सप्तरी, मधेश प्रदेश, नेपाल
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#D9531E', marginTop: '0.4rem', textTransform: 'uppercase' }}>
                  मासिक टोल कोष भुक्तानी रसिद (Tole Fund Receipt)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div><strong>रसिद नं (Receipt No):</strong> {selectedPayment.receiptNumber || `REC-${selectedPayment.paymentId.replace('TFC-', '')}`}</div>
                <div><strong>भुक्तानी मिति:</strong> {new Date(selectedPayment.submittedDate).toLocaleDateString()}</div>
                <div><strong>घरधुरी नं:</strong> {selectedPayment.house?.houseNumber || selectedPayment.houseNumber} ({selectedPayment.houseId})</div>
                <div><strong>सदस्यको नाम:</strong> {selectedPayment.memberName}</div>
                <div><strong>सम्पर्क नम्बर:</strong> {selectedPayment.phone}</div>
                <div><strong>अभियान महिना:</strong> {selectedPayment.campaignMonth} {selectedPayment.campaignYear}</div>
                <div><strong>भुक्तानी माध्यम:</strong> {selectedPayment.paymentMethod}</div>
                <div><strong>कारोबार नं (TXN):</strong> {selectedPayment.transactionId || '-'}</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E8E2D9', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>प्राप्त रकम (Amount Received):</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                  रु. {selectedPayment.amount} /-
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: '700', marginTop: '0.2rem' }}>
                  स्थिति: चुक्ता (PAID & APPROVED)
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', fontSize: '0.8rem', color: '#555' }}>
                <div>
                  <div>प्रमाणीकरणकर्ता: <strong>{selectedPayment.approvedBy || 'कोषाध्यक्ष / प्रशासन'}</strong></div>
                  <div>स्वीकृत मिति: {selectedPayment.approvedDate ? new Date(selectedPayment.approvedDate).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '120px', borderTop: '1px dashed #666', paddingTop: '0.2rem' }}>
                    आधिकारिक छाप
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }} className="no-print">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
              >
                बन्द
              </button>
              <button
                type="button"
                onClick={printReceipt}
                style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={16} />
                <span>प्रिन्ट गर्नुहोस् (Print Receipt)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundApprovalsView;
