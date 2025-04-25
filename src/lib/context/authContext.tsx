import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthState,
} from "@/lib/types";

// Create an interface for the auth context
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
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
        const token = localStorage.getItem("token");

        if (token) {
          // In a real app, you would verify the token with your backend
          // For now, we'll just set isAuthenticated to true

          // Mock user data (in a real app, this would come from the API)
          const user: User = {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          };

          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: "Failed to authenticate",
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // In a real app, you would call your API for authentication
      // For the demo, we'll simulate a successful login after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data (in a real app, this would come from the API)
      const user: User = {
        id: "1",
        name: "John Doe",
        email: credentials.email,
      };

      // Store the token in localStorage
      localStorage.setItem("token", "mock-jwt-token");

      // Update auth state
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Invalid email or password",
      }));
    }
  }, []);

  // Signup function
  const signup = useCallback(async (credentials: SignupCredentials) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // In a real app, you would call your API for user registration
      // For the demo, we'll simulate a successful signup after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data (in a real app, this would come from the API)
      const user: User = {
        id: "1",
        name: credentials.name,
        email: credentials.email,
      };

      // Store the token in localStorage
      localStorage.setItem("token", "mock-jwt-token");

      // Update auth state
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to create account",
      }));
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Remove token from localStorage
    localStorage.removeItem("token");

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
