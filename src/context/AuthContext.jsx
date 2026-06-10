import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import useAsync from '../hooks/useAsync';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('alfa_auth');
    return saved === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('alfa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const { loading, error, execute } = useAsync();

  useEffect(() => {
    localStorage.setItem('alfa_auth', isAuthenticated);
    if (user) {
      localStorage.setItem('alfa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alfa_user');
    }
  }, [isAuthenticated, user]);

  // Verify token on mount if authenticated
  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        try {
          const response = await authService.getMe();
          if (response.success) {
            setUser(response.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      }
    };

    verifyAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await execute(() => authService.register(userData));
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await execute(() => authService.login(credentials));
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('alfa_user', JSON.stringify(updatedUser));
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
