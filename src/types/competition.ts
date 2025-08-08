// Create this new file for competition types
export type CompetitionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACCEPTED"
  | "ONGOING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

// Also export the other types if you want to use them elsewhere
export type CompetitionType = "GENERAL" | "ARMOR" | "CLOTH" | "SINGING";
export type RivalryType = "SOLO" | "DUO" | "GROUP";
export type CompetitionLevel = "BARANGAY" | "LOCAL" | "REGIONAL" | "NATIONAL" | "WORLDWIDE";

export interface Competition {
  id: number;
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  // Competition categorization
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  // Media and references
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
  // System fields
  submittedById: number;
  submittedBy: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
    role: string;
  };
  status: CompetitionStatus;
  reviewedById: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    participants: number;
    awards: number;
  };
}

export interface NewCompetitionData {
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  // NEW: Logo and reference links
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
}

export interface CompetitionStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  ongoing: number;
  completed: number;
}