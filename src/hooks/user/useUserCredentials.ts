// Create: src/hooks/user/useUserCredentials.ts
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface CompetitionCredential {
  id: number;
  position: string;
  cosplayTitle: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  verified: boolean;
  verifiedAt?: string;
  competition: {
    id: number;
    name: string;
    eventDate: string;
    location?: string;
    logoUrl?: string;
    competitionType: string;
    rivalryType: string;
    level: string;
  };
  createdAt: string;
}

export const useUserCredentials = () => {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState<CompetitionCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch('/api/user/credentials');
      
      if (response.ok) {
        const data = await response.json();
        setCredentials(data.credentials || []);
      } else {
        setError('Failed to fetch credentials');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [session?.user?.id]);

  return {
    credentials,
    loading,
    error,
    refetch: fetchCredentials,
  };
};