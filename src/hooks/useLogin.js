import { useState } from 'react';
import AppUrl from '../utils/AppUrl';
import api from '../services/api';

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginRequest = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(AppUrl.APP_URL_MAIN+AppUrl.LOGIN_URL, { email, password });
      setLoading(false);
      if (response.data && response.data.token) {
        sessionStorage.setItem('authToken', response.data.token);
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
      return null;
    }
  };

  const handleAdminLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(AppUrl.APP_URL_MAIN + AppUrl.LOGIN_URL, { email, password });
      console.log('Admin login response:', response);
      setLoading(false);  
      if (response.data && response.data.token) {
        sessionStorage.setItem('adminAuthToken', response.data.token);
      }
      return response;
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || 'Admin login failed. Please try again.');
      setLoading(false);
      return null;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('adminAuthToken');
    window.location.href = '/admin/login';
  }

  return { loginRequest, handleAdminLogin, loading, error, setError };
}
