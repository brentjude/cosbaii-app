import { CompetitionStatus } from "@/types/competition";

export const getStatusBadgeClass = (status: CompetitionStatus): string => {
  const statusClasses: Record<CompetitionStatus, string> = {
    DRAFT: "badge-ghost",
    SUBMITTED: "badge-warning",
    ACCEPTED: "badge-success",
    ONGOING: "badge-info",
    COMPLETED: "badge-primary",
    REJECTED: "badge-error",
    CANCELLED: "badge-ghost",
  };
  return statusClasses[status] || "badge-ghost";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatEnumValue = (value: string): string => {
  return value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getCompetitionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    GENERAL: "General",
    ARMOR: "Armor",
    CLOTH: "Cloth",
    SINGING: "Singing",
  };
  return labels[type] || type;
};

export const getRivalryTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    SOLO: "Solo",
    DUO: "Duo",
    GROUP: "Group",
  };
  return labels[type] || type;
};

export const getLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    BARANGAY: "Barangay",
    LOCAL: "Local",
    REGIONAL: "Regional",
    NATIONAL: "National",
    WORLDWIDE: "Worldwide",
  };
  return labels[level] || level;
};