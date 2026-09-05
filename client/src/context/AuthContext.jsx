import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('userInfo');
      return null;
    }
  });

  useEffect(() => {
    if (!user?.token) return;

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Session expired');
        const data = await response.json();
        return data.data.user;
      })
      .then((profile) => {
        const refreshedUser = { ...user, ...profile };
        setUser(refreshedUser);
        localStorage.setItem('userInfo', JSON.stringify(refreshedUser));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('userInfo');
      });
    // The stored token is the only dependency needed to refresh the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;