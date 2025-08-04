"use client";

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
  status: "INACTIVE" | "ACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string | null;
}

interface UserStats {
  total: number;
  inactive: number;
  active: number;
  banned: number;
}

interface NewUserData {
  name: string | null;
  email: string;
  username: string | null;
  password: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  status: "INACTIVE" | "ACTIVE" | "BANNED";
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, inactive: 0, active: 0, banned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async (status?: string) => {
    try {
      setLoading(true);
      const url = status && status !== 'ALL' 
        ? `/api/admin/users?status=${status}` 
        : '/api/admin/users';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/users/stats');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch stats: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Get single user
  const getUser = async (id: number): Promise<User | null> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch user: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.user;
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      return null;
    }
  };

  // Update user
  const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...data.user } : user
      ));
      
      // Refresh stats after update
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      console.error('Error updating user:', err);
      return false;
    }
  };

  // Review user (approve/ban)
  const reviewUser = async (id: number, action: 'APPROVE' | 'BAN'): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action.toLowerCase()} user`);
      }

      const data = await response.json();
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, ...data.user } : user
      ));
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action.toLowerCase()} user`);
      console.error(`Error ${action.toLowerCase()}ing user:`, err);
      return false;
    }
  };

  // Delete user
  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      // Update local state
      setUsers(users.filter(user => user.id !== id));
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
      return false;
    }
  };

  // Create new user - ✅ Updated to handle NewUserData type
  const createUser = async (userData: NewUserData): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const data = await response.json();
      
      // Add to local state (prepend to show new user at top)
      setUsers([data.user, ...users]);
      
      // Refresh stats
      await fetchStats();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchUsers(),
        fetchStats(),
      ]);
    };
    
    loadData();
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    fetchStats,
    getUser,
    updateUser,
    reviewUser,
    deleteUser,
    createUser,
    setError, // Allow clearing errors
  };
};