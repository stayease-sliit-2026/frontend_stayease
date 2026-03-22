import ImageConstant from '../../utils/imageConstant';
import useLogin from '../../hooks/useLogin';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { loginRequest, loading, error, setError } = useLogin();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Email and password required');
            return;
        }
        const result = await loginRequest(email, password);
        if (result && result.token) {
            let isAdmin = false;
            try {
                const decoded = jwtDecode(result.token);
                // Adjust this according to your backend's JWT payload structure
                isAdmin = decoded.role === 'admin' || (decoded.roles && decoded.roles.includes('admin'));
            } catch (e) {
                // fallback: not admin
            }
            login(email); // Optionally pass result if your login expects it
            if (isAdmin) {
                navigate('/hotel-admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
        // error is handled by the hook
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

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
                {/* Animation or video loader */}
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
                    <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2.2rem', margin: 0, lineHeight: 1.15 }}>Book your stay<br />for a better journey</h1>
                    <div style={{ color: '#e0e7ff', margin: '18px 0 28px', fontSize: '1.1rem' }}>Welcome Back. Please login to your account.</div>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {error && <div style={{ color: '#b91c1c', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                            <label style={{ color: '#fff', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input type="checkbox" style={{ accentColor: '#2563eb', marginRight: 4 }} /> Remember me
                            </label>
                            <Link to="#" style={{ color: '#e0e7ff', fontSize: '0.98rem', textDecoration: 'underline', fontWeight: 500 }}>Forgot password?</Link>
                        </div>
                        <button type="submit" disabled={loading} style={{
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
                        }}>{loading ? 'Logging in...' : 'Log in'}</button>
                        <div style={{ marginTop: 22, textAlign: 'center', fontSize: '1.04rem', color: '#e0e7ff' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline' }}>Create your account</Link>
                        </div>
                    </form>
                </div>
            </div>
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
                    src={ImageConstant.loginHero1}
                    alt="Hotel booking illustration"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'fill',
                    }}

                />
            </div>
        </div>
    );
}

export default Login;

