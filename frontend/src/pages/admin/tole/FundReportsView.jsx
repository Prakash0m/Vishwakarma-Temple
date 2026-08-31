import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useLanguage } from '../../../context/LanguageContext';
import {
  FileText,
  DollarSign,
  Printer,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';

const FundReportsView = () => {
  const { t } = useLanguage();
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({
    totalExpected: 0,
    totalCollected: 0,
    totalDue: 0,
    collectionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Printable Statement Modal
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [selectedHouseStatement, setSelectedHouseStatement] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [year]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tole/fund-payments/reports/house-due', {
        params: { year }
      });
      if (res.data.success) {
        setReport(res.data.data);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching fund report:', err);
    } finally {
      setLoading(false);
    }
  };

  const openStatement = (houseRow) => {
    setSelectedHouseStatement(houseRow);
    setShowStatementModal(true);
  };

  const filteredData = report.filter(item => {
    const matchesSearch = search === '' ||
      item.houseNumber.includes(search) ||
      item.representativeName.toLowerCase().includes(search.toLowerCase()) ||
      item.representativePhone.includes(search);

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'Fully Paid' && item.totalDue === 0) ||
      (statusFilter === 'Due' && item.totalDue > 0);

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
            घरधुरी टोल कोष हिसाब तथा बक्यौता प्रतिवेदन (Due Report & Statement)
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            छापकी टोलका प्रत्येक घरको कुल तोकिएको रकम, चुक्ता गरेको रकम र बाँकी बक्यौता हिसाब विवरण
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>वर्ष (Year):</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontWeight: '700' }}
          >
            <option value="2026">२०८३ (2026)</option>
            <option value="2025">२०८२ (2025)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल अपेक्षित कोष (Total Expected)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
            रु. {summary.totalExpected.toLocaleString()}
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल संकलित कोष (Total Collected)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2E7D32', marginTop: '0.25rem' }}>
            रु. {summary.totalCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2E7D32', marginTop: '0.2rem' }}>संकलन दर: {summary.collectionRate}%</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल बाँकी बक्यौता (Total Due)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#C62828', marginTop: '0.25rem' }}>
            रु. {summary.totalDue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E8E2D9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="घर नं., नाम वा फोन नम्बर खोज्नुहोस्..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>भुक्तानी स्थिति:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #D0C9BE', fontSize: '0.85rem' }}
          >
            <option value="all">सबै घरधुरी (All)</option>
            <option value="Fully Paid">पूरा चुक्ता (Fully Paid)</option>
            <option value="Due">बक्यौता बाँकी (Due)</option>
          </select>
        </div>
      </div>

      {/* Report Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E8E2D9', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9' }}>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>घर नं.</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>मुख्य अभिभावक</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>सम्पर्क नम्बर</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>तोकिएको रकम (Required)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>चुक्ता रकम (Paid)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>बाँकी बक्यौता (Due)</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)' }}>स्थिति</th>
                <th style={{ padding: '0.9rem 1rem', fontWeight: '700', color: 'var(--color-primary-dark)', textAlign: 'right' }}>विवरण / बिल</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    प्रतिवेदन लोड हुँदैछ...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    कुनै विवरण फेला परेन।
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F0ECE4' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#111' }}>
                      घर नं. {row.houseNumber} ({row.houseId})
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                      {row.representativeName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#444' }}>
                      {row.representativePhone}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>
                      रु. {row.totalRequired}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#2E7D32' }}>
                      रु. {row.totalPaid}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: row.totalDue > 0 ? '#C62828' : '#2E7D32' }}>
                      रु. {row.totalDue}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: row.totalDue === 0 ? '#E8F5E9' : '#FFEBEE',
                          color: row.totalDue === 0 ? '#2E7D32' : '#C62828'
                        }}
                      >
                        {row.totalDue === 0 ? '✓ पूरा चुक्ता' : `रु. ${row.totalDue} बाँकी`}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openStatement(row)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-gold)',
                          backgroundColor: '#FAF7F2',
                          color: 'var(--color-primary)',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <FileText size={14} />
                        <span>वार्षिक हिसाब बिल</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Annual Statement Bill Modal */}
      {showStatementModal && selectedHouseStatement && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowStatementModal(false)} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }} className="no-print">
              <X size={24} />
            </button>

            <div style={{ border: '2px solid var(--color-gold)', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#FAF7F2' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-gold)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '700' }}>ॐ श्री विश्वकर्मणे नमः</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary-dark)', fontSize: '1.35rem', margin: '0.2rem 0' }}>
                  छापकी टोल विकास समिति
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  अग्निसाइर कृष्णासवरण गाउँपालिका वडा नं. ५, छापकी, सप्तरी
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#D9531E', marginTop: '0.4rem' }}>
                  वार्षिक टोल कोष हिसाब विवरण (Annual Statement {year})
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div><strong>घर नम्बर:</strong> {selectedHouseStatement.houseNumber} ({selectedHouseStatement.houseId})</div>
                <div><strong>मुख्य अभिभावक:</strong> {selectedHouseStatement.representativeName}</div>
                <div><strong>सम्पर्क नम्बर:</strong> {selectedHouseStatement.representativePhone}</div>
                <div><strong>हिसाब वर्ष:</strong> सन् {year} (वि.सं. २०८३)</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E8E2D9', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #EEE' }}>
                  <span>कुल तोकिएको कोष रकम (Total Required):</span>
                  <strong>रु. {selectedHouseStatement.totalRequired}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #EEE', color: '#2E7D32' }}>
                  <span>कुल चुक्ता गरेको रकम (Total Paid):</span>
                  <strong>रु. {selectedHouseStatement.totalPaid}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0 0 0', color: selectedHouseStatement.totalDue > 0 ? '#C62828' : '#2E7D32', fontSize: '1.1rem' }}>
                  <span>बाँकी बक्यौता रकम (Net Balance Due):</span>
                  <strong>रु. {selectedHouseStatement.totalDue}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', fontSize: '0.8rem', color: '#555' }}>
                <div>
                  <div>प्रमाणीकरण: <strong>कोषाध्यक्ष / अध्यक्ष</strong></div>
                  <div>मिति: {new Date().toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '120px', borderTop: '1px dashed #666', paddingTop: '0.2rem' }}>
                    हस्ताक्षर / छाप
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }} className="no-print">
              <button
                type="button"
                onClick={() => setShowStatementModal(false)}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #D0C9BE', backgroundColor: '#FFF', cursor: 'pointer', fontWeight: '600' }}
              >
                बन्द
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#FFF', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={16} />
                <span>प्रिन्ट गर्नुहोस् (Print Statement)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundReportsView;
