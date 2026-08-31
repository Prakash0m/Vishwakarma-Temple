import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  PieChart,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const BudgetsView = () => {
  const { language, t } = useLanguage();
  const { addToast } = useToast();

  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [formData, setFormData] = useState({
    category: 'मन्दिर मर्मत',
    categoryEnglish: 'Temple Renovation',
    allocatedAmount: '',
    fiscalYear: '2081/82 (2026)',
    notes: ''
  });

  const categories = [
    { ne: 'मन्दिर मर्मत', en: 'Temple Renovation' },
    { ne: 'पूजा सामग्री', en: 'Pooja Materials' },
    { ne: 'कार्यक्रम', en: 'Events & Festivals' },
    { ne: 'तलब', en: 'Staff & Priest Salary' },
    { ne: 'सामाजिक सेवा', en: 'Community Welfare' },
    { ne: 'बिजुली', en: 'Electricity' },
    { ne: 'पानी', en: 'Water & Sanitation' },
    { ne: 'अन्य', en: 'Miscellaneous' }
  ];

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/budgets');
      if (res.data.success) {
        setBudgets(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      addToast('बजेट विवरण लोड गर्न सकिएन।', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleOpenAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: 'मन्दिर मर्मत',
      categoryEnglish: 'Temple Renovation',
      allocatedAmount: '',
      fiscalYear: '2081/82 (2026)',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b) => {
    setEditingBudget(b);
    setFormData({
      category: b.category,
      categoryEnglish: b.categoryEnglish || '',
      allocatedAmount: b.allocatedAmount,
      fiscalYear: b.fiscalYear,
      notes: b.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const selected = categories.find(c => c.ne === e.target.value);
    setFormData(prev => ({
      ...prev,
      category: selected ? selected.ne : e.target.value,
      categoryEnglish: selected ? selected.en : ''
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.allocatedAmount || Number(formData.allocatedAmount) < 0) {
      addToast('कृपया वैध बजेट रकम प्रविष्ट गर्नुहोस्।', 'error');
      return;
    }

    try {
      if (editingBudget) {
        const res = await api.put(`/budgets/${editingBudget._id}`, formData);
        if (res.data.success) {
          addToast('बजेट योजना अद्यावधिक गरियो।', 'success');
          setIsModalOpen(false);
          fetchBudgets();
        }
      } else {
        const res = await api.post('/budgets', formData);
        if (res.data.success) {
          addToast('नयाँ बजेट शीर्षक सफलतापूर्वक थपियो।', 'success');
          setIsModalOpen(false);
          fetchBudgets();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'बजेट सुरक्षित गर्न सकिएन।', 'error');
    }
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('के तपाईं यो बजेट शीर्षक मेटाउन निश्चित हुनुहुन्छ?')) {
      try {
        const res = await api.delete(`/budgets/${id}`);
        if (res.data.success) {
          addToast('बजेट शीर्षक हटाइयो।', 'success');
          fetchBudgets();
        }
      } catch (err) {
        addToast('बजेट शीर्षक हटाउन सकिएन।', 'error');
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
          <PieChart size={24} color="#C59B27" />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
            बजेट योजना तथा खर्च प्रगति (Budget Management)
          </h2>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-gold">
          <Plus size={16} />
          <span>नयाँ बजेट शीर्षक थप्नुहोस् (Allocate Budget)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="temple-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>कुल विनियोजित बजेट</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-gold-dark)' }}>
              रु. {summary.totalAllocated?.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>आ.व. २०८१/८२</div>
          </div>

          <div className="temple-card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>हालसम्म भएको खर्च</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-saffron-dark)' }}>
              रु. {summary.totalSpent?.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{summary.overallPercentage}% प्रयोग भएको</div>
          </div>

          <div className="temple-card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-green-subtle)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-green-dark)', fontWeight: '700' }}>बाँकी बजेट रकम</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-green-dark)' }}>
              रु. {summary.totalRemaining?.toLocaleString('ne-NP')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-green-dark)' }}>सुरक्षित उपलब्ध रकम</div>
          </div>
        </div>
      )}

      {/* Budgets Cards Grid with Progress Bars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>बजेट लोड हुँदैछ...</div>
        ) : budgets.length > 0 ? (
          budgets.map((b) => (
            <div
              key={b._id}
              className="temple-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--color-primary-dark)' }}>
                      {b.category}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {b.categoryEnglish} • {b.fiscalYear}
                    </div>
                  </div>

                  <span className={`badge ${b.statusColor === 'red' ? 'badge-maroon' : b.statusColor === 'orange' ? 'badge-saffron' : 'badge-green'}`}>
                    {b.percentageUsed}% प्रयोग
                  </span>
                </div>

                {b.notes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {b.notes}
                  </p>
                )}

                {/* Visual Progress Bar */}
                <div className="progress-bar-bg" style={{ marginBottom: '1rem', height: '10px' }}>
                  <div
                    className={`progress-bar-fill ${b.statusColor}`}
                    style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                  />
                </div>

                {/* Stats Table */}
                <div style={{
                  backgroundColor: 'var(--bg-cream-alt)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>विनियोजित बजेट:</span>
                    <strong>रु. {b.allocatedAmount?.toLocaleString('ne-NP')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>वास्तविक खर्च:</span>
                    <span style={{ color: 'var(--color-saffron-dark)', fontWeight: '700' }}>
                      रु. {b.spent?.toLocaleString('ne-NP')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '4px', marginTop: '2px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>बाँकी मौज्दात:</span>
                    <strong style={{ color: b.remaining < 0 ? 'var(--color-danger)' : 'var(--color-green)' }}>
                      रु. {b.remaining?.toLocaleString('ne-NP')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => handleOpenEditModal(b)}
                  className="btn btn-sm btn-outline"
                >
                  <Edit2 size={14} />
                  <span>सम्पादन</span>
                </button>
                <button
                  onClick={() => handleDeleteBudget(b._id)}
                  style={{
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #F87171',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.85rem'
                  }}
                >
                  <Trash2 size={14} />
                  <span>हटाउनुहोस्</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            कुनै बजेट शीर्षक फेला परेन।
          </div>
        )}
      </div>

      {/* Add / Edit Budget Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {editingBudget ? 'बजेट शीर्षक सम्पादन (Edit Budget)' : 'नयाँ बजेट विनियोजन (Allocate Budget)'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">बजेट शीर्षक (Category) *</label>
                  <select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="form-control"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.ne} value={c.ne}>
                        {c.ne} ({c.en})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">विनियोजित रकम (रु.) *</label>
                    <input
                      type="number"
                      name="allocatedAmount"
                      value={formData.allocatedAmount}
                      onChange={(e) => setFormData({ ...formData, allocatedAmount: e.target.value })}
                      className="form-control"
                      placeholder="उदा. २०००००"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">आर्थिक वर्ष (Fiscal Year)</label>
                    <input
                      type="text"
                      name="fiscalYear"
                      value={formData.fiscalYear}
                      onChange={(e) => setFormData({ ...formData, fiscalYear: e.target.value })}
                      className="form-control"
                      placeholder="2081/82 (2026)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">योजना तथा टिप्पणी (Notes)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="form-control"
                    placeholder="उद्देश्य, कार्य विवरण वा प्राथमिकता..."
                    rows={3}
                  />
                </div>

                <div className="modal-footer" style={{ margin: '1rem -1.5rem -1.5rem -1.5rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    रद्द गर्नुहोस्
                  </button>
                  <button type="submit" className="btn btn-gold">
                    {editingBudget ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'बजेट विनियोजन गर्नुहोस्'}
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

export default BudgetsView;
