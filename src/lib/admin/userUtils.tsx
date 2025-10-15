import { UserStatus, UserRole } from "@/types/admin";
import { CheckIcon, XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

export const getStatusBadge = (status: UserStatus): string => {
  const badges = {
    INACTIVE: "badge badge-warning",
    ACTIVE: "badge badge-success",
    BANNED: "badge badge-error",
  };
  return badges[status];
};

export const getStatusIcon = (status: UserStatus) => {
  const iconProps = { className: "w-4 h-4" };
  switch (status) {
    case "INACTIVE":
      return <ClockIcon {...iconProps} />;
    case "ACTIVE":
      return <CheckIcon {...iconProps} />;
    case "BANNED":
      return <XMarkIcon {...iconProps} />;
  }
};

export const getRoleBadge = (role: UserRole): string => {
  const badges = {
    USER: "badge badge-outline",
    MODERATOR: "badge badge-info",
    ADMIN: "badge badge-secondary",
  };
  return badges[role];
};

export const formatRegistrationDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export const formatTime = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const getStatusRowClass = (status: UserStatus): string => {
  switch (status) {
    case "INACTIVE":
      return "bg-warning/10 hover:bg-warning/20";
    case "BANNED":
      return "bg-error/10 hover:bg-error/20";
    case "ACTIVE":
      return "hover:bg-base-200";
    default:
      return "hover:bg-base-200";
  }
};