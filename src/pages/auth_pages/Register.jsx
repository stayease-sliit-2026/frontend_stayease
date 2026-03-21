
import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useRegister from '../../hooks/useRegister';
import ImageConstant from '../../utils/imageConstant';


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { registerRequest, loading, error, setError } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email and password required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    const result = await registerRequest(name, email, password);
    if (result) {
      login(email);
      navigate('/', { replace: true });
    }
    // error is handled by the hook
  };

  if (isAuthenticated) return <Navigate to="/" replace />;
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #2563eb 0%, #4f8cff 100%)',
      }}>
        <video
          src="https://assets.mixkit.co/videos/preview/mixkit-loading-animation-313.mp4"
          autoPlay
          loop
          muted
          style={{ width: 120, height: 120, borderRadius: 16, boxShadow: '0 4px 24px rgba(37,99,235,0.18)' }}
        />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'stretch',
      background: 'linear-gradient(120deg, #2563eb 0%, #4f8cff 100%)',
      overflow: 'hidden',
    }}>
    <div style={{
        flex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'relative',
        minWidth: 0,
        overflow: 'hidden',
        maxHeight: '100vh',
      }}>
        <img
          src={ImageConstant.registerHero}
          alt="Hotel booking illustration"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      {/* Left: Form Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 7vw',
        background: 'rgba(255,255,255,0.07)',
        minWidth: 0,
      }}>
        <div style={{ maxWidth: 420, width: '100%' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '1px', marginBottom: 18 }}>STAYEASE</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.2rem', margin: 0, lineHeight: 1.15 }}>Create your account</h1>
          <div style={{ color: '#e0e7ff', margin: '18px 0 28px', fontSize: '1.1rem' }}>Register to start booking your stay.</div>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {error && <div style={{ color: '#b91c1c', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: 18,
                border: 'none',
                borderRadius: 8,
                fontSize: '1.08rem',
                background: '#f3f6fd',
                color: '#222',
                boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: 18,
                border: 'none',
                borderRadius: 8,
                fontSize: '1.08rem',
                background: '#f3f6fd',
                color: '#222',
                boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: 10,
                border: 'none',
                borderRadius: 8,
                fontSize: '1.08rem',
                background: '#f3f6fd',
                color: '#222',
                boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: 20,
                border: 'none',
                borderRadius: 8,
                fontSize: '1.08rem',
                background: '#f3f6fd',
                color: '#222',
                boxShadow: '0 1px 4px rgba(37,99,235,0.07)',
              }}
            />
            <button type="submit" style={{
              width: '100%',
              borderRadius: 8,
              padding: '13px',
              background: 'linear-gradient(90deg, #1e40af 0%, #2563eb 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: 'none',
              boxShadow: '0 2px 8px rgba(37,99,235,0.13)',
              marginTop: 6,
            }}>Register</button>
            <div style={{ marginTop: 22, textAlign: 'center', fontSize: '1.04rem', color: '#e0e7ff' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline' }}>Login</Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right: Illustration Section */}
    
    </div>
  );
}
