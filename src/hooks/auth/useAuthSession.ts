"use client";

import { useSession } from 'next-auth/react';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
  image?: string | null;
}

interface ExtendedSession {
  user: ExtendedUser | null;
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

  return {
    user: session?.user as ExtendedUser || null,
    loading,
    error: null,
    isAuthenticated,
    isAdmin,
    isModerator,
    hasRole,
    hasAnyRole,
  };
};