import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import {
  Heart,
  TrendingDown,
  Wallet,
  PieChart as PieIcon,
  Users,
  UserCheck,
  CalendarCheck,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Home,
  CheckSquare,
  AlertTriangle,
  Heart as HeartIcon,
  Droplets,
  Calendar,
  DollarSign
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardView = () => {
  const { language, t, getLocalized } = useLanguage();
  const [data, setData] = useState(null);
  const [toleStats, setToleStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [templeRes, toleRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/tole/dashboard/stats')
      ]);

      if (templeRes.data.success) {
        setData(templeRes.data.data);
      }
      if (toleRes.data.success) {
        setToleStats(toleRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="diya-flame" style={{ margin: '0 auto 1rem auto' }} />
        <p>ड्यासबोर्ड तथ्याङ्क लोड हुँदैछ...</p>
      </div>
    );
  }

  // Monthly Chart Data Setup
  const monthlyLabels = data.monthlyTrends?.map(m => language === 'ne' ? m.monthNepali : m.month) || [];
  const donationTrends = data.monthlyTrends?.map(m => m.donations) || [];
  const expenseTrends = data.monthlyTrends?.map(m => m.expenses) || [];

  const barChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: language === 'ne' ? 'चन्दा आम्दानी (Donations)' : 'Donations',
        data: donationTrends,
        backgroundColor: '#7A121D',
        borderRadius: 6
      },
      {
        label: language === 'ne' ? 'मन्दिर खर्च (Expenses)' : 'Expenses',
        data: expenseTrends,
        backgroundColor: '#D9531E',
        borderRadius: 6
      }
    ]
  };

  // Payment Method Doughnut Setup
  const paymentLabels = data.paymentMethods?.map(p => p._id) || [];
  const paymentValues = data.paymentMethods?.map(p => p.total) || [];

  const doughnutData = {
    labels: paymentLabels,
    datasets: [
      {
        data: paymentValues,
        backgroundColor: ['#2D6A4F', '#7A121D', '#D9531E', '#C59B27', '#3B82F6', '#8B5CF6'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    ]
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Welcome Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            color: 'var(--color-primary-dark)',
            lineHeight: 1.2,
            margin: 0
          }}>
            विश्वकर्मा मन्दिर तथा छापकी टोल एकीकृत ड्यासबोर्ड
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            टोल घरधुरी जनसांख्यिकी, बैठक उपस्थिति, मासिक कोष तथा मन्दिर पोखरी आम्दानी अनुगमन
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            border: '1px solid #D0C9BE',
            backgroundColor: '#FAF7F2',
            color: 'var(--color-primary-dark)',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} />
          <span>ताजा गर्नुहोस्</span>
        </button>
      </div>

      {/* TOLE COMMUNITY HIGHLIGHT SECTION */}
      {toleStats && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ width: '4px', height: '18px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
              छापकी टोल जनसांख्यिकी तथा समुदाय विश्लेषण (Tole Demographics & Funds)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
            {/* Houses & Residents */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-gold)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल घरधुरी लगत</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--color-primary-dark)', marginTop: '0.2rem' }}>
                    {toleStats.demographics?.totalHouses || 0} घर
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.25rem' }}>
                    एकल: {toleStats.demographics?.singleFamilyHouses} | संयुक्त: {toleStats.demographics?.jointFamilyHouses}
                  </div>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Home size={22} />
                </div>
              </div>
            </div>

            {/* Total Population Demographics */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E8E2D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>टोल जनसंख्या विवरण</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#1B4332', marginTop: '0.2rem' }}>
                    {toleStats.demographics?.totalResidents || 0} जना
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    ज्येष्ठ: {toleStats.demographics?.seniors} | युवा: {toleStats.demographics?.youths} | बालबालिका: {toleStats.demographics?.children}
                  </div>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                  <Users size={22} />
                </div>
              </div>
            </div>

            {/* Meeting Attendance Rate */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E8E2D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>बैठक उपस्थिति दर</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0077B6', marginTop: '0.2rem' }}>
                    {toleStats.meetings?.overallAttendanceRate || 0}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    कुल {toleStats.meetings?.completedMeetings} बैठक सम्पन्न
                  </div>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077B6' }}>
                  <CheckSquare size={22} />
                </div>
              </div>
            </div>

            {/* Monthly Fund Collection */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E8E2D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>मासिक कोष संकलन दर</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#D9531E', marginTop: '0.2rem' }}>
                    {toleStats.fundCollection?.collectionRate || 0}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                    संकलित: रु. {toleStats.fundCollection?.collectedAmount || 0}
                  </div>
                </div>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FDF0EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D9531E' }}>
                  <DollarSign size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLE POKHARI INCOME CARDS */}
      {toleStats && toleStats.templeIncome && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ width: '4px', height: '18px', backgroundColor: '#0077B6', borderRadius: '2px' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
              मन्दिर पोखरी ठेक्का तथा स्रोत आम्दानी (Pokhari 1 & 2 Income)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E8E2D9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0077B6' }}>
                <Droplets size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>जलाहवा पोखरी आम्दानी (Pokhari 1)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0077B6' }}>
                  रु. {toleStats.templeIncome.jalahawaPokhariIncome?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#777' }}>मत्स्यपालन तथा ठेक्का आम्दानी</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E8E2D9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D6A4F' }}>
                <Droplets size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>गोसाइँ पोखरी आम्दानी (Pokhari 2)</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2D6A4F' }}>
                  रु. {toleStats.templeIncome.gosaiPokhariIncome?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#777' }}>वार्षिक ठेक्का किस्ता</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E8E2D9', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Wallet size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600' }}>कुल मन्दिर आम्दानी</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                  रु. {toleStats.templeIncome.totalTempleIncome?.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#777' }}>पोखरी, भेटी तथा अन्य स्रोत</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLE CORE FINANCIAL METRICS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ width: '4px', height: '18px', backgroundColor: 'var(--color-gold)', borderRadius: '2px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
          मन्दिर वित्तीय तथा सञ्चालन सारांश (Temple Operations)
        </h2>
      </div>

      {/* 4 Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Donations */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {language === 'ne' ? 'कुल चन्दा संकलन' : 'Total Donations'}
              </p>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: 'var(--color-primary-dark)',
                margin: '0.35rem 0'
              }}>
                रु. {data.totalDonations?.toLocaleString()}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#2E7D32', fontWeight: '600' }}>
                <ArrowUpRight size={15} />
                <span>{data.donationsCount} वटा रसिद जारी</span>
              </div>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={24} />
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #E8E2D9',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {language === 'ne' ? 'कुल मन्दिर खर्च' : 'Total Expenses'}
              </p>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: '#D9531E',
                margin: '0.35rem 0'
              }}>
                रु. {data.totalExpenses?.toLocaleString()}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#D9531E', fontWeight: '600' }}>
                <ArrowDownRight size={15} />
                <span>{data.expensesCount} शीर्षकमा खर्च</span>
              </div>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FDF0EA',
              color: '#D9531E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        {/* Net Balance */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #E8E2D9',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {language === 'ne' ? 'बचत मौज्दात (Net Balance)' : 'Net Balance'}
              </p>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: data.netBalance >= 0 ? '#2E7D32' : '#C62828',
                margin: '0.35rem 0'
              }}>
                रु. {data.netBalance?.toLocaleString()}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                कोष सुरक्षित तथा पारदर्शी
              </div>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={24} />
            </div>
          </div>
        </div>

        {/* Active Members & Bookings */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #E8E2D9',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {language === 'ne' ? 'पूजा बुकिङ र सदस्य' : 'Bookings & Members'}
              </p>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: 'var(--color-primary-dark)',
                margin: '0.35rem 0'
              }}>
                {data.activeMembers} जना
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {data.upcomingBookings} पूजा बुकिङ बाँकी
              </div>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#FAF7F2',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserCheck size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Income vs Expense Monthly Bar Chart */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #E8E2D9',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            color: 'var(--color-primary-dark)',
            marginBottom: '1rem'
          }}>
            {language === 'ne' ? 'मासिक चन्दा तथा खर्च तुलना (२०८३)' : 'Monthly Donations vs Expenses (2026)'}
          </h3>
          <div style={{ height: '280px' }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' }
                }
              }}
            />
          </div>
        </div>

        {/* Payment Methods Doughnut */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid #E8E2D9',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            color: 'var(--color-primary-dark)',
            marginBottom: '1rem'
          }}>
            {language === 'ne' ? 'भुक्तानी माध्यम अनुसार चन्दा' : 'Donations by Payment Method'}
          </h3>
          <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
