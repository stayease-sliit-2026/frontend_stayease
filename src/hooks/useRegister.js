import { useState } from 'react';
import api from '../services/api';
import AppUrl from '../utils/AppUrl';

function buildAuthUrl(path) {
  const base = (import.meta.env.VITE_AUTH_SERVICE_URL || AppUrl.APP_URL_MAIN || '').replace(/\/$/, '');
  const normalizedPath = `/${String(path || '').replace(/^\/+/, '')}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerRequest = async (name, email, password, mobile) => {
    setLoading(true);
    setError('');
    try {
      const registerUrl = buildAuthUrl(AppUrl.REGISTER_URL);
      console.log('Attempting registration with:', { name, email, password, mobile, url: registerUrl });
      const response = await api.post(registerUrl, {
        name,
        email,
        mobile,
        password,
        mobile,
      });
      setLoading(false);
      if (response.data && response.data.token) {
        sessionStorage.setItem('authToken', response.data.token);
      }
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
      return null;
    }
  };

  // Admin registration
  const adminRegisterRequest = async (name, email, mobile, password) => {
    setLoading(true);
    setError('');
    try {
      const adminToken = sessionStorage.getItem('adminAuthToken');
      const response = await api.post(
        AppUrl.APP_URL_USERS + AppUrl.ADMIN_REGISTER,
        {
          name,
          email,
          mobile,
          password,
        },
        {
          headers: {
            Authorization: adminToken ? `Bearer ${adminToken}` : undefined,
          },
        }
      );
      setLoading(false);
      console.log('Admin registration successful:', response.status);
      return response.status;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 'Admin registration failed. Please try again.'
      );
      return err.response?.data || null;
    }
  };

  return { registerRequest, adminRegisterRequest, loading, error, setError };
}
