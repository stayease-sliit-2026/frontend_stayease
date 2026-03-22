import { useState } from 'react';
import AppUrl from '../utils/AppUrl';
import api from '../services/api';

function buildAuthUrl(path) {
  const base = (import.meta.env.VITE_AUTH_SERVICE_URL || AppUrl.APP_URL_MAIN || '').replace(/\/$/, '');
  const normalizedPath = `/${String(path || '').replace(/^\/+/, '')}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginRequest = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(buildAuthUrl(AppUrl.LOGIN_URL), { email, password });
      setLoading(false);
      if (response.data && response.data.token) {
        sessionStorage.setItem('authToken', response.data.token);
      }
      console.log('Login successful:', response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
      return null;
    }
  };

  return { loginRequest, loading, error, setError };
}
