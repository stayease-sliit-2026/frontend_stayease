import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ctse-gateway-555972249634.asia-south1.run.app/users',
});

api.interceptors.request.use(
  (config) => {
    // Use adminAuthToken for admin endpoints, fallback to user token otherwise
    const adminToken = sessionStorage.getItem('adminAuthToken');
    const userToken = localStorage.getItem('token');
    console.log('full url for request:', api.defaults.baseURL + config.url);
    if (config.url && config.url.startsWith('/api/users/admin')) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    console.log('Request config:', config);

    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllUsers = async () => {
  console.log('Fetching all users with admin token:', sessionStorage.getItem('adminAuthToken'));
  try {
    console.log('API full url for getAllUsers:', api.defaults.baseURL + '/api/users/admin/all');
    const response = await api.get('/api/users/admin/all');
    console.log('getAllUsers response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
export const getUserById = (id) => api.get(`/api/users/admin/${id}`);
export const updateUserById = (id, data) => api.put(`/api/users/admin/${id}`, data);
export const deleteUserById = (id) => api.delete(`/api/users/admin/${id}`);