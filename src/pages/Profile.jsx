import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Example: decode token or fetch user details from API
    const token = sessionStorage.getItem('authToken');
    if (token) {
      // For demo, decode JWT payload (base64) to get user info if available
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        setUser({ email: 'Unknown', id: 'Unknown' });
      }
    }
  }, []);

  if (!user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(37,99,235,0.08)', padding: 32 }}>
      <h2 style={{ color: '#2563eb', fontWeight: 800, marginBottom: 18 }}>My Profile</h2>
      <div style={{ fontSize: '1.1rem', marginBottom: 12 }}><strong>User ID:</strong> {user.id || 'N/A'}</div>
      <div style={{ fontSize: '1.1rem', marginBottom: 12 }}><strong>Email:</strong> {user.email || 'N/A'}</div>
      {/* Add more fields as needed */}
    </div>
  );
}
