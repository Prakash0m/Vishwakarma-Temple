import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Home,
  Users,
  CheckSquare,
  AlertTriangle,
  Heart,
  Award,
  FileCheck,
  FileText,
  Droplets,
  HeartHandshake,
  Receipt,
  PieChart,
  Flame,
  CalendarCheck,
  Calendar,
  Image,
  Video,
  Mail,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navSections = [
    {
      title: language === 'ne' ? 'मुख्य ड्यासबोर्ड' : 'Overview',
      items: [
        {
          label: language === 'ne' ? 'प्रशासनिक ड्यासबोर्ड' : 'Admin Dashboard',
          path: '/admin',
          icon: <LayoutDashboard size={18} />
        }
      ]
    },
    {
      title: language === 'ne' ? 'टोल व्यवस्थापन' : 'Tole Management',
      items: [
        {
          label: language === 'ne' ? 'घरधुरी लगत (Houses)' : 'House Directory',
          path: '/admin/tole/houses',
          icon: <Home size={18} />
        },
        {
          label: language === 'ne' ? 'बैठक तथा उपस्थिति' : 'Meetings & Attendance',
          path: '/admin/tole/meetings',
          icon: <CheckSquare size={18} />
        },
        {
          label: language === 'ne' ? 'जरिवाना व्यवस्थापन' : 'Fines & Penalties',
          path: '/admin/tole/fines',
          icon: <AlertTriangle size={18} />
        },
        {
          label: language === 'ne' ? 'विवाह अभिलेख' : 'Wedding Registry',
          path: '/admin/tole/weddings',
          icon: <Heart size={18} />
        },
        {
          label: language === 'ne' ? '५ नेतृत्व उम्मेदवार' : '5 Leadership Candidates',
          path: '/admin/tole/leadership',
          icon: <Award size={18} />
        }
      ]
    },
    {
      title: language === 'ne' ? 'टोल कोष तथा वित्तीय' : 'Funds & Finance',
      items: [
        {
          label: language === 'ne' ? 'मासिक कोष अभियान' : 'Monthly Campaigns',
          path: '/admin/tole/fund-campaigns',
          icon: <Calendar size={18} />
        },
        {
          label: language === 'ne' ? 'भुक्तानी स्वीकृति' : 'Fund Approvals',
          path: '/admin/tole/fund-approvals',
          icon: <FileCheck size={18} />
        },
        {
          label: language === 'ne' ? 'घरधुरी हिसाब प्रतिवेदन' : 'House Due Reports',
          path: '/admin/tole/fund-reports',
          icon: <FileText size={18} />
        },
        {
          label: language === 'ne' ? 'पोखरी १ र २ आम्दानी' : 'Pokhari 1 & 2 Income',
          path: '/admin/tole/temple-income',
          icon: <Droplets size={18} />
        }
      ]
    },
    {
      title: language === 'ne' ? 'मन्दिर व्यवस्थापन' : 'Temple Operations',
      items: [
        {
          label: language === 'ne' ? 'सदस्य तथा समिति' : 'Members & Committee',
          path: '/admin/members',
          icon: <Users size={18} />
        },
        {
          label: language === 'ne' ? 'दान तथा सहयोग' : 'Donations & Chanda',
          path: '/admin/donations',
          icon: <HeartHandshake size={18} />
        },
        {
          label: language === 'ne' ? 'खर्च व्यवस्थापन' : 'Expenses',
          path: '/admin/expenses',
          icon: <Receipt size={18} />
        },
        {
          label: language === 'ne' ? 'वार्षिक बजेट' : 'Annual Budgets',
          path: '/admin/budgets',
          icon: <PieChart size={18} />
        },
        {
          label: language === 'ne' ? 'पूजा सेवाहरू' : 'Pooja Services',
          path: '/admin/poojas',
          icon: <Flame size={18} />
        },
        {
          label: language === 'ne' ? 'पूजा बुकिङ' : 'Pooja Bookings',
          path: '/admin/bookings',
          icon: <CalendarCheck size={18} />
        },
        {
          label: language === 'ne' ? 'कार्यक्रम क्यालेन्डर' : 'Events Calendar',
          path: '/admin/events',
          icon: <Calendar size={18} />
        },
        {
          label: language === 'ne' ? 'तस्बिर ग्यालरी' : 'Photo Gallery',
          path: '/admin/gallery',
          icon: <Image size={18} />
        },
        {
          label: language === 'ne' ? 'प्रत्यक्ष प्रसारण' : 'Live Darshan & Meet',
          path: '/admin/meetings',
          icon: <Video size={18} />
        },
        {
          label: language === 'ne' ? 'सन्देशहरू' : 'Public Messages',
          path: '/admin/messages',
          icon: <Mail size={18} />
        },
        {
          label: language === 'ne' ? 'सेटिङहरू' : 'System Settings',
          path: '/admin/settings',
          icon: <Settings size={18} />
        }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F6F3ED', position: 'relative' }}>
      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 940,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)'
          }}
          className="admin-backdrop"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          width: '270px',
          backgroundColor: '#38060D',
          color: '#FAF7F2',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 950,
          transition: 'transform 0.25s ease-in-out',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          borderRight: '1px solid var(--border-gold)'
        }}
        className={`admin-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
      >
        {/* Brand Header */}
        <div style={{
          padding: '1.15rem 1.25rem',
          borderBottom: '1px solid rgba(197, 155, 39, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#2E050A'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', minWidth: 0 }}>
            <img
              src="/assets/images/temple-logo.svg"
              alt="Logo"
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--color-gold)', flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#FFD166',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                विश्वकर्मा मन्दिर
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap' }}>
                छापकी टोल व्यवस्थापन
              </div>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'none',
              padding: '6px',
              minHeight: '36px',
              minWidth: '36px'
            }}
            className="sidebar-close-btn"
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items (Grouped Categories) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem 0.65rem', WebkitOverflowScrolling: 'touch' }}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '1.15rem' }}>
              {section.title && (
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 209, 102, 0.8)',
                  letterSpacing: '0.6px',
                  padding: '0 0.75rem 0.35rem 0.75rem'
                }}>
                  {section.title}
                </div>
              )}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: 0, margin: 0 }}>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.7rem',
                          padding: '0.6rem 0.75rem',
                          minHeight: '40px',
                          borderRadius: '8px',
                          color: isActive ? '#FFFFFF' : 'rgba(250, 247, 242, 0.85)',
                          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                          borderLeft: isActive ? '3.5px solid var(--color-gold)' : '3.5px solid transparent',
                          fontWeight: isActive ? '700' : '500',
                          fontSize: '0.84rem',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ color: isActive ? '#FFD166' : 'rgba(250, 247, 242, 0.75)', display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </span>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer User Profile & Action */}
        <div style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid rgba(197, 155, 39, 0.25)',
          backgroundColor: '#2E050A'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD166',
                fontWeight: '700',
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div style={{ overflow: 'hidden', minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.fullName || 'Temple Admin'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#FFD166', whiteSpace: 'nowrap' }}>
                  छापकी टोल प्रशासन
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="लग आउट (Logout)"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B6B'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: '270px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: '100vh'
      }} className="admin-main-container">
        {/* Top Navbar */}
        <header style={{
          height: '58px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E2D9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(0.75rem, 2vw, 1.5rem)',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: '1px solid #D0C9BE',
                borderRadius: '8px',
                padding: '6px',
                minHeight: '38px',
                minWidth: '38px',
                color: '#333',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              className="sidebar-toggle-btn"
              aria-label="Toggle Admin Menu"
            >
              <Menu size={20} />
            </button>
            <div style={{ fontSize: '0.88rem', color: '#444', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span className="desktop-admin-title">श्री विश्वकर्मा मन्दिर तथा छापकी टोल विकास समिति</span>
              <span className="mobile-admin-title" style={{ display: 'none' }}>छापकी टोल प्रशासन</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={toggleLanguage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                minHeight: '34px',
                borderRadius: '6px',
                border: '1px solid #D0C9BE',
                backgroundColor: '#FAF7F2',
                color: 'var(--color-primary-dark)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Globe size={13} />
              <span>{language === 'ne' ? 'EN' : 'नेपाली'}</span>
            </button>

            <Link
              to="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                minHeight: '34px',
                borderRadius: '6px',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid rgba(122, 18, 29, 0.15)',
                whiteSpace: 'nowrap'
              }}
            >
              <span>वेबसाइट</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main style={{ flex: 1, padding: 'clamp(0.85rem, 2vw, 1.5rem)', maxWidth: '100%', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      {/* Responsive Media Queries */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%) !important;
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0) !important;
          }
          .admin-main-container {
            margin-left: 0 !important;
          }
          .sidebar-toggle-btn {
            display: flex !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
          .admin-backdrop {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          .desktop-admin-title {
            display: none !important;
          }
          .mobile-admin-title {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
