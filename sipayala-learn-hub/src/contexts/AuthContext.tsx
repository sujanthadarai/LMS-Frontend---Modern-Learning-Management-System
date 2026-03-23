import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  phone_number?: string;
  gender?: string;
  avatar?: string;
  date_joined: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  full_name: string;
  password: string;
  phone_number?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: 'ADMIN' | 'TEACHER' | 'STUDENT') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser && apiService.isAuthenticated()) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token and get fresh user data
          await refreshUser();
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        apiService.clearTokens();
        localStorage.removeItem('auth_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!apiService.isAuthenticated()) {
      setUser(null);
      return;
    }

    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      apiService.clearTokens();
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Login to get tokens
      await apiService.login(credentials);
      
      // Fetch user data
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      toast({
        title: 'Welcome back! 👋',
        description: `Successfully logged in as ${userData.full_name}`,
      });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Register the user
      const newUser = await apiService.register(userData);
      
      toast({
        title: 'Account Created! 🎉',
        description: 'Please log in with your credentials',
      });

      // Auto-login after successful registration
      await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    apiService.clearTokens();
    localStorage.removeItem('auth_user');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  }, [toast]);

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateProfile(userData);
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const hasRole = (role: 'ADMIN' | 'TEACHER' | 'STUDENT'): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};