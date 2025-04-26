import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, SignupCredentials, AuthState } from '@/lib/types';
import { authApi } from '@/lib/utils/api';

// Create an interface for the auth context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize auth state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
          return;
        }
        
        // Verify token with backend
        const response = await authApi.getCurrentUser();
        
        if (response.success && response.data && response.data.user) {
          setAuthState({
            user: {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
            },
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear token in case of error
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: 'Failed to authenticate',
        });
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    debugger
    try {
      const response = await authApi.login(credentials.email, credentials.password);
      
      if (response.success && response.data && response.data.user) {
        setAuthState({
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
          },
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: response.error || 'Invalid email or password',
        }));
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      }));
      return false;
    }
  }, []);

  // Signup function
  const signup = useCallback(async (credentials: SignupCredentials): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authApi.signup(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.confirmPassword
      );
      
      if (response.success && response.data && response.data.user) {
        setAuthState({
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
          },
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to create account',
        }));
        return false;
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create account',
      }));
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Remove token from localStorage
    authApi.logout();
    
    // Update auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  // Provide the auth context to children components
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;