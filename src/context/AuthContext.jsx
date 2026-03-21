import { createContext, useMemo, useState } from 'react';

// Named export for context
export const AuthContext = createContext(null);

// Named export for provider
export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem('stayease_user');
		return saved ? JSON.parse(saved) : null;
	});

	const login = (email, token) => {
		console.log('Logging in with email:', email, 'and token:', token); // ✅ Debug log
		const nextUser = { email };
		localStorage.setItem('stayease_user', JSON.stringify(nextUser));
		sessionStorage.setItem('authToken', token); // ✅ sync token=
		setUser(nextUser);
	};

	const logout = () => {
		localStorage.removeItem('stayease_user');
		sessionStorage.removeItem('authToken'); // ✅ cleanup
		setUser(null);
	};

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: Boolean(user),
			login,
			logout,
		}),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Default export for provider for compatibility
export default AuthProvider;