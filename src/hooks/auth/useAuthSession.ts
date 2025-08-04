"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  role: string;
}

interface ExtendedSession {
  user: SessionUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuthSession = (): ExtendedSession => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const loading = status === 'loading';
  const isAuthenticated = !!session?.user;
  
  // Role checking functions
  const hasRole = (role: string): boolean => {
    return session?.user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.includes(session?.user?.role || '');
  };

  const isAdmin = hasRole('ADMIN');
  const isModerator = hasRole('MODERATOR');

  // Clear error when session changes
  useEffect(() => {
    if (session) {
      setError(null);
    }
  }, [session]);

  return {
    user: session?.user || null,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isModerator,
    hasRole,
    hasAnyRole,
  };
};