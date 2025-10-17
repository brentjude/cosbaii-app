// Update: src/hooks/admin/useAdminUsers.ts
import { useState, useEffect, useCallback } from "react";
import { User, UserStats, NewUserData } from "@/types/admin";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    reviewed: 0,
    unreviewed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (statusFilter?: string) => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/admin/users?status=${statusFilter}`
        : "/api/admin/users";

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch users" }));
        throw new Error(errorData.error || errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      
      // ✅ Normalize users data
      const normalizedUsers = data.users.map((user: User) => ({
        ...user,
        reviewedBy: user.reviewedBy ?? null,
        reviewed: Boolean(user.reviewed),
        isPremiumUser: Boolean(user.isPremiumUser),
      }));
      
      setUsers(normalizedUsers);
      
      // ✅ Set stats if available
      if (data.stats) {
        setStats(data.stats);
      }
      
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = async (userId: number): Promise<User | null> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      return {
        ...data.user,
        reviewedBy: data.user.reviewedBy ?? null,
        reviewed: Boolean(data.user.reviewed),
        isPremiumUser: Boolean(data.user.isPremiumUser),
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching user:", err);
      return null;
    }
  };

  const createUser = async (userData: NewUserData): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(() => ({ error: "Invalid response" }));

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error creating user:", err);
      return false;
    }
  };

  const updateUser = async (
    userId: number,
    userData: Partial<User>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(() => ({ error: "Invalid response" }));

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error updating user:", err);
      return false;
    }
  };

  const reviewUser = async (
    userId: number,
    action: "APPROVE" | "BAN"
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json().catch(() => ({ error: "Invalid response" }));

      if (!response.ok) {
        throw new Error(data.error || "Failed to review user");
      }

      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error reviewing user:", err);
      return false;
    }
  };

  const deleteUser = async (userId: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({ error: "Invalid response" }));

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      await fetchUsers();
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error deleting user:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    reviewUser,
    deleteUser,
    setError,
  };
};