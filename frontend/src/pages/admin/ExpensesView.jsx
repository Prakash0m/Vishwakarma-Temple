import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  Receipt,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Filter,
  DollarSign
} from 'lucide-react';

const ExpensesView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [filteredTotal, setFilteredTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [formData, setFormData] = useState({
    voucherNumber: '',
    title: '',
    category: 'पूजा सामग्री',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    description: ''
  });

  const categories = [
    'मन्दिर मर्मत',
    'पूजा सामग्री',
    'बिजुली',
    'पानी',
    'कार्यक्रम',
    'तलब',
    'सामाजिक सेवा',
    'अन्य'
  ];

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/expenses', {
        params: { search, category: categoryFilter, paymentMethod: paymentFilter }
      });
      if (res.data.success) {
        setExpenses(res.data.data);
        setFilteredTotal(res.data.filteredTotalAmount || 0);
      }
    } catch (err) {
      addToast('खर्च विवरण लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [search, categoryFilter, paymentFilter]);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setFormData({
      voucherNumber: '',
      title: '',
      category: 'पूजा सामग्री',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingExpense(exp);
    setFormData({
      voucherNumber: exp.voucherNumber,
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      date: exp.date ? new Date(exp.date).toISOString().split('T')[0] : '',
      paymentMethod: exp.paymentMethod,
      description: exp.description || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || Number(formData.amount) <= 0) {
      addToast('कृपया खर्च शीर्षक र वैध रकम प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    try {
      if (editingExpense) {
        const res = await api.put(`/expenses/${editingExpense._id}`, formData);
        if (res.data.success) {
          addToast('खर्च विवरण अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchExpenses();
        }
      } else {
        const res = await api.post('/expenses', formData);
        if (res.data.success) {
          addToast('खर्च सफलतापूर्वक दर्ता गरियो।', 'success');
          setIsModalOpen(false);
          fetchExpenses();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'खर्च रेकर्ड सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('के तपाईं यो खर्च रेकर्ड मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/expenses/${id}`);
        if (res.data.success) {
          addToast('खर्च रेकर्ड हटाइयो।', 'success');
          fetchExpenses();
        }
      } catch (err) {
        addToast('खर्च रेकर्ड हटाउन सकिएन।', 'error');
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
          <Receipt size={24} color="#D9531E" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            मन्दिर खर्च व्यवस्थापन (Temple Expenses)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-saffron">
          <Plus size={16} />
          <span>नयाँ खर्च प्रविष्टि (Record Expense)</span>
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
              placeholder="खर्च शीर्षक, भौचर नं. बाट खोज्नुहोस्..."
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '160px' }}
          >
            <option value="All">सबै खर्च शीर्षक (All Categories)</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="All">सबै भुक्तानी माध्यम</option>
            <option value="Cash">Cash (नगद)</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="eSewa">eSewa</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div style={{
          backgroundColor: 'var(--color-saffron-subtle)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(217, 83, 30, 0.3)'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-saffron-dark)' }}>फिल्टर गरिएको कुल खर्च: </span>
          <strong style={{ fontSize: '1.15rem', color: 'var(--color-saffron-dark)' }}>
            रु. {filteredTotal.toLocaleString('ne-NP')}
          </strong>
        </div>
      </div>

      {/* Expenses Data Table */}
      <div className="temple-card">
        <div className="temple-table-wrapper">
          <table className="temple-table">
            <thead>
              <tr>
                <th>भौचर नं.</th>
                <th>मिति</th>
                <th>खर्च शीर्षक</th>
                <th>वर्ग (Category)</th>
                <th>रकम (रु.)</th>
                <th>भुक्तानी माध्यम</th>
                <th style={{ textAlign: 'right' }}>कार्यहरू</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    लोड हुँदैछ...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((e) => (
                  <tr key={e._id}>
                    <td><code style={{ fontWeight: '700', color: 'var(--color-saffron-dark)' }}>{e.voucherNumber}</code></td>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                        {e.title}
                      </div>
                      {e.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.description}</div>}
                    </td>
                    <td>
                      <span className="badge badge-saffron">{e.category}</span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-saffron-dark)', fontSize: '0.98rem' }}>
                        रु. {e.amount?.toLocaleString('ne-NP')}
                      </strong>
                    </td>
                    <td><span className="badge badge-gold">{e.paymentMethod}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenEditModal(e)}
                          className="btn btn-sm btn-outline"
                          title="Edit Record"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(e._id)}
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    कुनै खर्च रेकर्ड फेला परेन।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingExpense ? 'खर्च विवरण सम्पादन (Edit Expense)' : 'नयाँ खर्च प्रविष्टि (Record Expense)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">खर्चको शीर्षक (Title/Details) *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-control"
                    placeholder="उदा. दैनिक पूजा सामग्री खरिद"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">खर्च शीर्षक (Category) *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-control"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">खर्च रकम (रु.) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="form-control"
                      placeholder="उदा. ५०००"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">भुक्तानी माध्यम (Payment Method)</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="form-control"
                    >
                      <option value="Cash">Cash (नगद)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="eSewa">eSewa</option>
                      <option value="Cheque">Cheque</option>
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
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">खर्चको विस्तृत विवरण (Description/Notes)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-control"
                    placeholder="बिल नम्बर, सामानको सूची वा थप विवरण..."
                    rows={3}
                  />
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-saffron">
                    {editingExpense ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'खर्च दर्ता गर्नुहोस्'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesView;
