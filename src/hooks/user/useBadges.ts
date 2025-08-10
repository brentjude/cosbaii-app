// Create: src/hooks/user/useBadges.ts
import { useState, useEffect } from 'react';

interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  type: string;
  requirement?: number;
}

interface UserBadge {
  id: number;
  badge: Badge;
  awardedAt: string;
}

interface BadgeProgress {
  badge: Badge;
  earned: boolean;
  awardedAt: string | null;
  currentProgress: number;
  progressPercentage: number;
}

export const useBadges = () => {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [progress, setProgress] = useState<BadgeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      console.log('Fetching user badges...');
      
      const response = await fetch('/api/user/badges');
      console.log('Badge API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch badges');
      }

      const data = await response.json();
      console.log('Badge API response data:', data);
      
      setBadges(data.badges || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      console.log('Fetching badge progress...');
      
      const response = await fetch('/api/user/badges?progress=true');
      console.log('Badge progress API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Badge progress API error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch badge progress');
      }

      const data = await response.json();
      console.log('Badge progress API response data:', data);
      
      setProgress(data.progress || []);
    } catch (err) {
      console.error('Error fetching badge progress:', err);
      // Don't set error here to avoid overriding badge fetch errors
    }
  };

  useEffect(() => {
    fetchBadges();
    fetchProgress();
  }, []);

  return {
    badges,
    progress,
    loading,
    error,
    refetch: () => {
      fetchBadges();
      fetchProgress();
    },
  };
};