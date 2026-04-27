import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ctse-gateway-555972249634.asia-south1.run.app',
	timeout: 10000,
});

export default api;
