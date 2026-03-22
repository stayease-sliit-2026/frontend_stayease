import { useState } from 'react';
import api from '../services/api';
import AppUrl from '../utils/AppUrl';

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerRequest = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
        console.log('Attempting registration with:', { name, email, password, url: AppUrl.APP_URL_MAIN+AppUrl.REGISTER_URL });
      const response = await api.post(AppUrl.APP_URL_MAIN+AppUrl.REGISTER_URL, {
        name,
        email,
        password,
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

  return { registerRequest, loading, error, setError };
}
