import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Mail,
  Search,
  CheckCircle2,
  Trash2,
  Phone,
  MessageSquare,
  Clock
} from 'lucide-react';

const MessagesView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact', {
        params: { search, status: statusFilter }
      });
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      addToast('सन्देशहरू लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/contact/${id}`, { status });
      if (res.data.success) {
        addToast(`स्थिति परिवर्तन गरियो: ${status}`, 'success');
        fetchMessages();
      }
    } catch (err) {
      addToast('स्थिति परिवर्तन गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('के तपाईं यो सन्देश मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/contact/${id}`);
        if (res.data.success) {
          addToast('सन्देश हटाइयो।', 'success');
          fetchMessages();
        }
      } catch (err) {
        addToast('सन्देश हटाउन सकिएन।', 'error');
      }
    }
  };

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
          <Mail size={24} color="#7A121D" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            श्रद्धालु सोधपुछ सन्देशहरू (Inquiries Inbox)
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
            placeholder="नाम, फोन वा सन्देशबाट खोज्नुहोस्..."
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="All">सबै स्थिति (All Status)</option>
          <option value="New">नयाँ (New)</option>
          <option value="Read">पढिएको (Read)</option>
          <option value="Replied">जवाफ पठाइएको (Replied)</option>
          <option value="Closed">बन्द (Closed)</option>
        </select>
      </div>

      {/* Messages List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>सन्देशहरू लोड हुँदैछन्...</div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="temple-card"
              style={{
                padding: '1.25rem 1.5rem',
                borderLeft: msg.status === 'New' ? '4px solid var(--color-primary)' : '1px solid var(--border-gold)',
                backgroundColor: msg.status === 'New' ? '#FFFFFF' : 'var(--bg-cream)'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                      {msg.name}
                    </strong>
                    <span className={`badge ${msg.status === 'New' ? 'badge-maroon' : msg.status === 'Replied' ? 'badge-green' : 'badge-gold'}`}>
                      {msg.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '1rem' }}>
                    <span>📞 {msg.phone}</span>
                    {msg.email && <span>✉️ {msg.email}</span>}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Message Content */}
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--text-brown)',
                lineHeight: 1.6,
                backgroundColor: '#FFFFFF',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem'
              }}>
                {msg.message}
              </p>

              {/* Actions Strip */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                {msg.status !== 'Read' && (
                  <button
                    onClick={() => handleUpdateStatus(msg._id, 'Read')}
                    className="btn btn-sm btn-outline"
                  >
                    पढिएको चिन्ह लगाउनुहोस्
                  </button>
                )}
                {msg.status !== 'Replied' && (
                  <button
                    onClick={() => handleUpdateStatus(msg._id, 'Replied')}
                    className="btn btn-sm btn-green"
                  >
                    जवाफ पठाइयो (Replied)
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  style={{
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #F87171',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '0.82rem'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="temple-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            कुनै सोधपुछ सन्देश फेला परेन।
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
