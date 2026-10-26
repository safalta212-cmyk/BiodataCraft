import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminPermission, hasPermission as checkPermission } from '../types/auth';
import { adminAuthService } from '../services/adminAuthService';

interface AdminAuthContextType {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  hasPermission: (permission: AdminPermission) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() =>
    adminAuthService.getCurrentUser()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = adminAuthService.subscribe((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await adminAuthService.login(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await adminAuthService.loginWithGoogle();
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await adminAuthService.logout();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    return await adminAuthService.sendPasswordReset(email);
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!currentUser) return false;
    return checkPermission(currentUser.role, permission);
  };

  const value: AdminAuthContextType = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    hasPermission
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
