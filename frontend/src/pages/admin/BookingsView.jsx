import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  User,
  Calendar,
  Trash2,
  Edit2
} from 'lucide-react';

const BookingsView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pooja-bookings', {
        params: { search, status: statusFilter }
      });
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      addToast('पूजा अनुरोधहरू लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/pooja-bookings/${id}`, { status });
      if (res.data.success) {
        addToast(`स्थिति अद्यावधिक गरियो: ${status}`, 'success');
        fetchBookings();
      }
    } catch (err) {
      addToast('स्थिति परिवर्तन गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('के तपाईं यो पूजा अनुरोध मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/pooja-bookings/${id}`);
        if (res.data.success) {
          addToast('पूजा अनुरोध हटाइयो।', 'success');
          fetchBookings();
        }
      } catch (err) {
        addToast('अनुरोध हटाउन सकिएन।', 'error');
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
          <CalendarCheck size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            अनलाइन पूजा अनुरोध व्यवस्थापन (Pooja Bookings)
          </h2>
        </div>
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
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            placeholder="अनुरोध नम्बर, श्रद्धालुको नाम वा फोन..."
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="All">सबै स्थिति (All Status)</option>
          <option value="Pending">विचाराधीन (Pending)</option>
          <option value="Approved">स्वीकृत (Approved)</option>
          <option value="Completed">सम्पन्न (Completed)</option>
          <option value="Cancelled">रद्द (Cancelled)</option>
        </select>
      </div>

      {/* Bookings List Table */}
      <div className="temple-card">
        <div className="temple-table-wrapper">
          <table className="temple-table">
            <thead>
              <tr>
                <th>अनुरोध नं.</th>
                <th>मिति र समय</th>
                <th>श्रद्धालुको नाम</th>
                <th>पूजाको नाम</th>
                <th>सम्पर्क</th>
                <th>गोत्र / संकल्प</th>
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
              ) : bookings.length > 0 ? (
                bookings.map((b) => (
                  <tr key={b._id}>
                    <td><code style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{b.bookingNumber}</code></td>
                    <td>
                      <div><strong>{new Date(b.requestedDate).toLocaleDateString()}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.requestedTime}</div>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-primary-dark)' }}>{b.devoteeName}</strong>
                    </td>
                    <td>
                      <span className="badge badge-gold">{b.poojaName}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>📞 {b.devoteePhone}</div>
                      {b.devoteeEmail && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.devoteeEmail}</div>}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{b.gotra ? `गोत्र: ${b.gotra}` : 'गोत्र उल्लेख छैन'}</div>
                      {b.sankalpaNotes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{b.sankalpaNotes}"</div>}
                    </td>
                    <td>
                      <span className={`badge ${
                        b.status === 'Approved' ? 'badge-green' :
                        b.status === 'Completed' ? 'badge-gold' :
                        b.status === 'Cancelled' ? 'badge-maroon' : 'badge-saffron'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Approved')}
                            className="btn btn-sm btn-green"
                            title="Approve Booking"
                          >
                            <CheckCircle2 size={13} />
                            <span>स्वीकृत</span>
                          </button>
                        )}

                        {b.status === 'Approved' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Completed')}
                            className="btn btn-sm btn-gold"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 size={13} />
                            <span>सम्पन्न</span>
                          </button>
                        )}

                        {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'Cancelled')}
                            className="btn btn-sm btn-outline"
                            title="Cancel Booking"
                          >
                            <XCircle size={13} />
                            <span>रद्द</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: '1px solid #F87171',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            cursor: 'pointer'
                          }}
                          title="Delete Booking"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    कुनै पूजा अनुरोध फेला परेन।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsView;
