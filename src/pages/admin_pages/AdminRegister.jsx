import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/admin.css';
import api from '../../services/api';
import useRegister from '../../hooks/useRegister';

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {adminRegisterRequest} = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required.');
      return;
    }
    // Simple mobile validation (10-15 digits)
    if (!/^\d{10,15}$/.test(mobile.trim())) {
      setError('Enter a valid mobile number (10-15 digits).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await adminRegisterRequest(name, email, mobile, password);
      setLoading(false);
      if (response == 201) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(response?.message || 'Registration failed.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.message || 'Registration failed.');
    }
  };

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="grid-overlay" />
        <div className="left-logo">
          <div className="logo-icon">🏨</div>
          <span className="logo-text">HotelAdmin</span>
        </div>
        <div className="left-body">
          <div className="left-eyebrow">Admin Registration</div>
          <h1 className="left-headline">
            Create your<br />
            admin account
          </h1>
          <p className="left-desc">
            Register to manage your hotel platform with full control and security.
          </p>
        </div>
        <div className="left-footer">
          © 2025 HotelAdmin Platform. All rights reserved.
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="card-eyebrow">Admin Registration</div>
          <h2 className="card-title">Sign Up</h2>
          <p className="card-subtitle">
            Fill in your details to create an admin account.
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
                  <label className="field-label">Full Name</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
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
                  <label className="field-label">Mobile Number</label>
                  <div className="input-wrap">
                    <span className="input-icon">📱</span>
                    <input
                      className="field-input"
                      type="tel"
                      placeholder="0712345678"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>
              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="field-wrap">
                <label className="field-label">Confirm Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Registering…
                </>
              ) : (
                <>
                  Register
                  <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>→</span>
                </>
              )}
            </button>
          </form>
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
          <div style={{ marginTop: 18, textAlign: 'center', fontSize: '1.01rem' }}>
            <Link to="/admin/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}>
              Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
