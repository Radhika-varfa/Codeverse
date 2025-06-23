import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (token) {
          const { data } = await axios.get('https://dummyjson.com/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(data);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
        expiresInMins: 30,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const { data } = await axios.post('https://dummyjson.com/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
        expiresInMins: 30,
      });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      return data.token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);