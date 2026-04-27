import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('stayease_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, token) => {
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('Valid auth token is required to login');
    }

    const nextUser = { email };
    localStorage.setItem('stayease_user', JSON.stringify(nextUser));
    sessionStorage.setItem('authToken', token);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('stayease_user');
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  const authToken = sessionStorage.getItem('authToken');
  const hasValidToken = Boolean(authToken && authToken !== 'undefined' && authToken !== 'null');

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user) && hasValidToken,
      login,
      logout,
    }),
    [user, hasValidToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
