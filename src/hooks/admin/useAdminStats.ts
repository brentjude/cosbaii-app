"use client";

import { useState, useEffect } from 'react';

interface AdminStats {
  users: {
    total: number;
    inactive: number;
    active: number;
    banned: number;
  };
  competitions: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
  };
  photos: {
    total: number;
    uploaded_today: number;
    pending_review: number;
  };
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all stats in parallel
      const [userStats, competitionStats, photoStats] = await Promise.all([
        fetch('/api/admin/users/stats').then(res => res.json()),
        fetch('/api/admin/competitions/stats').then(res => res.json()).catch(() => ({ stats: { total: 0, active: 0, upcoming: 0, completed: 0 } })),
        fetch('/api/admin/photos/stats').then(res => res.json()).catch(() => ({ stats: { total: 0, uploaded_today: 0, pending_review: 0 } })),
      ]);

      setStats({
        users: userStats.stats,
        competitions: competitionStats.stats,
        photos: photoStats.stats,
      });
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin stats');
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};