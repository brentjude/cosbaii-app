import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { CompetitionCredential } from '@/types/profile';

interface UseUserCredentialsReturn {
  credentials: CompetitionCredential[];
  loading: boolean;
  error: string | null;
  fetchCredentials: () => Promise<void>;
}

export function useUserCredentials(): UseUserCredentialsReturn {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState<CompetitionCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching credentials for user:', session.user.id);

      const response = await fetch('/api/user/credentials');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch credentials');
      }

      const data = await response.json();
      console.log('Credentials fetched:', data.credentials?.length || 0);
      
      setCredentials(data.credentials || []);
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch credentials');
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Initial fetch when hook mounts or session changes
  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  return {
    credentials,
    loading,
    error,
    fetchCredentials,
  };
}