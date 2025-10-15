// Create: src/hooks/user/useUserCredentials.ts
import { useState, useEffect, useCallback } from 'react'; // ✅ Added useCallback
import { useSession } from 'next-auth/react';
import { CompetitionCredential } from "@/types/profile";

export function useUserCredentials() {
  const { data: session } = useSession();
  const [credentials, setCredentials] = useState<CompetitionCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Wrapped fetchCredentials with useCallback
  const fetchCredentials = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/credentials');
      
      if (response.ok) {
        const data = await response.json();
        setCredentials(data.credentials || []);
        setError(null);
      } else {
        setError('Failed to fetch credentials');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching credentials:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]); // ✅ Added session?.user?.id as dependency

  // ✅ Added fetchCredentials to dependency array
  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]); // ✅ Now includes fetchCredentials

  return {
    credentials,
    loading,
    error,
    refetch: fetchCredentials,
  };
};