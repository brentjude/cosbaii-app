export type CompetitionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACCEPTED"
  | "ONGOING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type CompetitionType = "GENERAL" | "ARMOR" | "CLOTH" | "SINGING";
export type RivalryType = "SOLO" | "DUO" | "GROUP";
export type CompetitionLevel =
  | "BARANGAY"
  | "LOCAL"
  | "REGIONAL"
  | "NATIONAL"
  | "WORLDWIDE";

// ✅ Add Review Action Enum
export type ReviewAction = "ACCEPT" | "REJECT";

// ✅ Add Participant Status Type
export type ParticipantStatus = "PENDING" | "APPROVED" | "REJECTED";

// ✅ Add Review Action Enum
export const REVIEW_ACTIONS = {
  ACCEPT: "ACCEPT",
  REJECT: "REJECT",
} as const;

// ✅ Add Participant Review Action
export const PARTICIPANT_REVIEW_ACTIONS = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
} as const;

export interface Competition {
  id: number;
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
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
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
}

export interface EditCompetitionData {
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
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
}

export interface CompetitionParticipant {
  id: number;
  userId: number;
  competitionId: number;
  cosplayTitle: string | null;
  characterName: string | null;
  seriesName: string | null;
  status: ParticipantStatus;
  submittedAt: string;
  reviewedAt: string | null;
  user: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
    profile: {
      displayName: string;
      profilePicture: string;
    } | null;
  };
}

// ✅ Add Review Request Interface
export interface ReviewCompetitionRequest {
  action: ReviewAction;
  rejectionReason?: string;
}

// ✅ Add Participant Review Request Interface
export interface ReviewParticipantRequest {
  action: keyof typeof PARTICIPANT_REVIEW_ACTIONS;
}