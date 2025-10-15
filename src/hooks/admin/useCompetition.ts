import { useState, useEffect, useCallback } from "react";
import {
  Competition,
  CompetitionStats,
  CompetitionStatus,
  NewCompetitionData,
  EditCompetitionData,
} from "@/types/competition";

export const useCompetitions = (isAdmin: boolean, authLoading: boolean) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stats, setStats] = useState<CompetitionStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCompetitions = useCallback(
    async (status?: CompetitionStatus) => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (status) params.append("status", status);

        const response = await fetch(
          `/api/admin/competitions?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch competitions");
        }

        const data = await response.json();
        setCompetitions(data.competitions || []);
        setStats(
          data.stats || { total: 0, pending: 0, accepted: 0, rejected: 0 }
        );
      } catch (err) {
        console.error("Error fetching competitions:", err);
        setError("Failed to load competitions");
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchCompetitions();
    }
  }, [authLoading, isAdmin, fetchCompetitions]);

  const createCompetition = async (
    data: NewCompetitionData
  ): Promise<{ success: boolean; error?: string }> => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/admin/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchCompetitions();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to create competition",
        };
      }
    } catch {
      return { success: false, error: "Failed to create competition" };
    } finally {
      setActionLoading(false);
    }
  };

  const updateCompetition = async (
    id: number,
    data: EditCompetitionData
  ): Promise<{ success: boolean; error?: string }> => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/competitions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchCompetitions();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to update competition",
        };
      }
    } catch {
      return { success: false, error: "Failed to update competition" };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCompetition = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/competitions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCompetitions();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to delete competition",
        };
      }
    } catch {
      return { success: false, error: "Failed to delete competition" };
    } finally {
      setActionLoading(false);
    }
  };

  const reviewCompetition = async (
    id: number,
    action: "ACCEPT" | "REJECT",
    rejectionReason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/competitions/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          rejectionReason: action === "REJECT" ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        await fetchCompetitions();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Failed to review competition",
        };
      }
    } catch {
      return { success: false, error: "Failed to review competition" };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    competitions,
    stats,
    loading,
    error,
    actionLoading,
    setError,
    fetchCompetitions,
    createCompetition,
    updateCompetition,
    deleteCompetition,
    reviewCompetition,
  };
};