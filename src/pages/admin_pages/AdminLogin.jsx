import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';
import useLogin from '../../hooks/useLogin';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const { loginRequest } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginRequest(email, password);
      setLoading(false);
      const token = response?.token || response?.accessToken || response?.data?.token || response?.data?.accessToken;
      if (token) {
        sessionStorage.setItem('adminAuthToken', token);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Invalid credentials or server error.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };


  return (
    <>
      {/* Styles are now imported via admin.css */}
      <div className="login-root">

        {/* ── Left branding panel ── */}
        <div className="login-left">
          <div className="grid-overlay" />

          <div className="left-logo">
            <div className="logo-icon">🏨</div>
            <span className="logo-text">HotelAdmin</span>
          </div>

          <div className="left-body">
            <div className="left-eyebrow">Admin Control Center</div>
            <h1 className="left-headline">
              Manage your<br />
              properties <span>smarter</span>
            </h1>
            <p className="left-desc">
              A unified platform for hotel operations, bookings, and analytics —
              built for administrators who move fast.
            </p>

            <div className="left-stats">
              <div className="stat-chip">
                <span className="stat-chip-value">8,240</span>
                <span className="stat-chip-label">Active Users</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-chip">
                <span className="stat-chip-value">142</span>
                <span className="stat-chip-label">Hotels Listed</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-chip">
                <span className="stat-chip-value">99.9%</span>
                <span className="stat-chip-label">Uptime</span>
              </div>
            </div>
          </div>

          <div className="left-footer">
            © 2025 HotelAdmin Platform. All rights reserved.
          </div>
        </div>

        {/* ── Right login panel ── */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-eyebrow">Secure Access</div>
            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">
              Sign in to your admin account to continue managing your platform.
            </p>

            {error && (
              <div className="error-box">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <div className="field-wrap">
                  <label className="field-label">Email Address</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="admin@hotelco.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Password</label>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                    <input
                      className="field-input"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: 42 }}
                    />
                    <button
                      type="button"
                      className="pwd-toggle"
                      onClick={() => setShowPwd(v => !v)}
                      tabIndex={-1}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <div className="field-footer">
                    <button type="button" className="forgot-link">Forgot password?</button>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>→</span>
                  </>
                )}
              </button>

            </form>
            <div style={{ marginTop: 18, textAlign: 'center', fontSize: '0.88rem' }}>
              <Link to="/login" style={{ color: '#bcbcbd', fontWeight: 300, textDecoration: 'underline', marginRight: 16 }}>
                User Login
              </Link>
              <Link to="/admin/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}>
                Register Admin
              </Link>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Secured by HotelAdmin</span>
              <div className="divider-line" />
            </div>

            <div className="trust-row">
              <div className="trust-badge">
                <span className="trust-icon">🔐</span>
                SSL Encrypted
              </div>
              <div className="trust-badge">
                <span className="trust-icon">🛡️</span>
                2FA Ready
              </div>
              <div className="trust-badge">
                <span className="trust-icon">✅</span>
                SOC 2 Compliant
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}