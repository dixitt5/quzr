import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

// Create auth context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load user data on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (AuthService.isAuthenticated()) {
        try {
          const userData = await AuthService.getCurrentUser();
          setCurrentUser(userData);
        } catch (err) {
          console.error('Failed to load user', err);
          AuthService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      setError('');
      await AuthService.register(userData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  // Log in a user
  const login = async (email, password) => {
    try {
      setError('');
      // Call login service
      await AuthService.login(email, password);
      
      // Get user profile after successful login
      const userData = await AuthService.getCurrentUser();
      setCurrentUser(userData);
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Log out a user
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    isAuthenticated: AuthService.isAuthenticated(),
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 