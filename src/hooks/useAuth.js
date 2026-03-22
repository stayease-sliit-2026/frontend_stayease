import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	// Token verification function
	const verifyAuthToken = async (token) => {
		try {
			const response = await api.post('/auth/verify', { token });
			return response.data && response.data.valid;
		} catch (err) {
			return false;
		}
	};

	return {
		...context,
		verifyAuthToken,
	};
   

}
