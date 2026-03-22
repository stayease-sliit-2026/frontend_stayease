
import React, { useState, useEffect } from 'react';
import AdminUsersPage from '../../pages/admin_pages/userManagment/AdminUsersPage';
import AdminPage from '../admin/AdminPage';
import AdminHotelDetailsPage from '../admin/AdminHotelDetailsPage';
import '../../styles/admin-dashboard.css';

const STATS = [
  { icon: '👥', label: 'Total Users', value: '8,240', change: '+12%', dir: 'up', bg: '#eff6ff', iconBg: '#dbeafe', iconColor: '#2563eb' },
  { icon: '🏨', label: 'Active Hotels', value: '142', change: '+4%', dir: 'up', bg: '#f0fdf4', iconBg: '#dcfce7', iconColor: '#16a34a' },
  { icon: '📋', label: 'Bookings Today', value: '391', change: '-2%', dir: 'down', bg: '#fff7ed', iconBg: '#ffedd5', iconColor: '#ea580c' },
  { icon: '💰', label: 'Revenue (Mo.)', value: '$94.2k', change: '+18%', dir: 'up', bg: '#fdf4ff', iconBg: '#f3e8ff', iconColor: '#9333ea' },
];

const ACTIONS = [
  { icon: '👥', label: 'View All Users', desc: 'Browse & manage accounts', bg: '#eff6ff', iconBg: '#dbeafe', iconColor: '#2563eb' },
  { icon: '📋', label: 'Manage Bookings', desc: 'Review active reservations', bg: '#f0fdf4', iconBg: '#dcfce7', iconColor: '#16a34a' },
  { icon: '🏨', label: 'Add New Hotel', desc: 'List a new property', bg: '#fff7ed', iconBg: '#ffedd5', iconColor: '#ea580c' },
  { icon: '📊', label: 'View Reports', desc: 'Analytics & insights', bg: '#fdf4ff', iconBg: '#f3e8ff', iconColor: '#9333ea' },
];

const ACTIVITY = [
  { text: 'New user registered — priya@example.com', time: '2m ago', color: '#3b82f6' },
  { text: 'Booking #8821 confirmed at The Lakeview', time: '11m ago', color: '#22c55e' },
  { text: 'Hotel "Skyline Suites" marked for review', time: '34m ago', color: '#f59e0b' },
  { text: 'Report export completed (Q2 2025)', time: '1h ago', color: '#8b5cf6' },
  { text: 'Admin password updated successfully', time: '3h ago', color: '#64748b' },
];

const SYSTEMS = [
  { name: 'Booking Engine', status: 'Operational', cls: 'green' },
  { name: 'Payment Gateway', status: 'Operational', cls: 'green' },
  { name: 'Email Service', status: 'Degraded', cls: 'yellow' },
  { name: 'Search Index', status: 'Syncing', cls: 'blue' },
];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [selectedHotelId, setSelectedHotelId] = useState('');

  // Logout handler
    const handleLogout = () => {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('adminAuthToken');
      window.location.href = '/admin/login';
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdmin(payload);
      } catch (e) {
        setAdmin({ email: 'admin@hotelco.com', id: 'ADM-001', role: 'superadmin' });
      }
    } else {
      // Demo fallback
      setAdmin({ email: 'admin@hotelco.com', id: 'ADM-001', role: 'superadmin' });
    }
  }, []);

  const initials = admin?.email ? admin.email[0].toUpperCase() : 'A';
  const displayName = admin?.email?.split('@')[0] || 'Admin';

  return (
    <>
      <div className="dashboard-root">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🏨</div>
            <span className="logo-text">HotelAdmin</span>
          </div>

          <div className="sidebar-section-label">Main</div>
          <nav className="sidebar-nav">
            {[
              { icon: '⊞', label: 'Dashboard' },
              { icon: '👥', label: 'Users' },
              { icon: '🏨', label: 'Hotels' },
              { icon: '📋', label: 'Bookings' },
            ].map(item => (
              <button
                key={item.label}
                className={`nav-item${selectedSection === item.label ? ' active' : ''}`}
                onClick={() => {
                  if (item.label === 'Hotels') {
                    setSelectedHotelId('');
                  }
                  setSelectedSection(item.label);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-section-label">Analytics</div>
          <nav className="sidebar-nav">
            {[
              { icon: '📊', label: 'Reports' },
              { icon: '💰', label: 'Revenue' },
              { icon: '🔔', label: 'Notifications' },
            ].map(item => (
              <button key={item.label} className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-section-label">System</div>
          <nav className="sidebar-nav">
            {[
              { icon: '⚙️', label: 'Settings' },
              { icon: '🔒', label: 'Security' },
            ].map(item => (
              <button key={item.label} className="nav-item">
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            {admin && (
              <div className="admin-card">
                <div className="admin-avatar">{initials}</div>
                <div className="admin-info">
                  <div className="admin-name">{displayName}</div>
                  <div className="admin-role">{admin.role || 'admin'}</div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="main-content">
          <header className="topbar">
            <span className="topbar-title">{selectedSection}</span>
            <div className="topbar-right">
              <button className="topbar-badge">
                🔔
                <span className="badge-dot" />
              </button>
              <button className="topbar-badge">⚙️</button>
              <div className="topbar-avatar">{initials}</div>
              <button className="logout-btn" onClick={handleLogout} style={{ marginLeft: 16, padding: '6px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </header>

          <div className="page-body">
            {selectedSection === 'Dashboard' && (
              <>
                {/* Welcome Banner */}
                <div className="welcome-banner animate-in">
                  <div className="welcome-text">
                    <h2>Welcome back, {displayName} </h2>
                    <p>Here's what's happening across your platform today.</p>
                  </div>
                  {admin && (
                    <div className="welcome-meta">
                      <span className="meta-pill">{admin.role || 'admin'}</span>
                      <span className="meta-id">ID: {admin.id || 'N/A'}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="stats-grid">
                  {STATS.map((s, i) => (
                    <div key={s.label} className={`stat-card animate-in delay-${i + 1}`}>
                      <div className="stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>{s.icon}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className={`stat-change ${s.dir}`}>
                        {s.dir === 'up' ? '↑' : '↓'} {s.change} this month
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="section-title animate-in delay-5">Quick Actions</div>
                <div className="actions-grid">
                  {ACTIONS.map((a, i) => (
                    <button key={a.label} className={`action-card animate-in delay-${i + 1}`}>
                      <div className="action-icon" style={{ background: a.iconBg, color: a.iconColor }}>{a.icon}</div>
                      <div>
                        <div className="action-label">{a.label}</div>
                        <div className="action-desc">{a.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bottom panels */}
                <div className="bottom-grid">
                  <div className="panel animate-in delay-3">
                    <div className="panel-header">
                      <div className="section-title" style={{ margin: 0 }}>Recent Activity</div>
                      <button className="panel-action">View all</button>
                    </div>
                    {ACTIVITY.map((a, i) => (
                      <div key={i} className="activity-item">
                        <div className="activity-dot" style={{ background: a.color }} />
                        <div className="activity-text">{a.text}</div>
                        <div className="activity-time">{a.time}</div>
                      </div>
                    ))}
                  </div>

                  <div className="panel animate-in delay-4">
                    <div className="panel-header">
                      <div className="section-title" style={{ margin: 0 }}>System Status</div>
                      <button className="panel-action">Details</button>
                    </div>
                    {SYSTEMS.map((s, i) => (
                      <div key={i} className="status-row">
                        <span className="status-name">{s.name}</span>
                        <span className={`status-pill ${s.cls}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {selectedSection === 'Users' && (
              <div style={{ padding: 0, background: 'none' }}>
                {/* Render the full Admin User Management UI */}
                <AdminUsersPage />
              </div>
            )}
            {selectedSection === 'Hotels' && !selectedHotelId && (
              <div style={{ padding: 0, background: 'none' }}>
                <AdminPage
                  embedded
                  onManageHotel={(hotelId) => {
                    setSelectedHotelId(hotelId);
                  }}
                />
              </div>
            )}
            {selectedSection === 'Hotels' && selectedHotelId && (
              <div style={{ padding: 0, background: 'none' }}>
                <AdminHotelDetailsPage
                  hotelId={selectedHotelId}
                  embedded
                  onBack={() => setSelectedHotelId('')}
                />
              </div>
            )}
            {/* Add more sections as needed */}
          </div>
        </main>
      </div>
    </>
  );
}