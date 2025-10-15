// Update: src/types/profile.ts

export type CosplayerType = "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface Competition {
  id: number;
  name: string;
  eventDate: string;
  location?: string;
  competitionType: string;
  rivalryType: string;
  level: string;
  logoUrl?: string | null;
}

export interface UserCredential {
  id: number;
  cosplayTitle: string | null;
  characterName: string | null;
  seriesName: string | null;
  description: string | null;
  position: string;
  category: string | null;
  verified: boolean;
  imageUrl: string | null;
  competition: {
    id: number;
    name: string;
    organizer: string | null;
    eventDate: string;
    location: string | null;
    competitionType: string;
    rivalryType: string;
    level: string;
    logoUrl: string | null;
  };
  submittedAt: string;
  reviewedAt: string | null;
}

export interface FeaturedItem {
  id?: number;
  userId?: number;
  title: string;
  description: string;
  imageUrl: string;
  character: string;
  series: string;
  type: "competition" | "cosplay";
  competitionId?: number;
  competition?: {
    id: number;
    name: string;
    eventDate: string;
    location: string | null;
    competitionType: string;
    rivalryType: string;
    level: string;
    logoUrl: string | null;
  };
  position?: string;
  award?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface EditProfileData {
  displayName: string;
  bio: string;
  profilePicture: string;
  coverImage: string;
  cosplayerType: CosplayerType;
  yearsOfExperience: number | null;
  specialization: string;
  skillLevel: SkillLevel;
  featured: FeaturedItem[];
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  [key: string]: unknown;
}

export interface Profile {
  id: number;
  userId: number;
  displayName: string | null;
  bio: string | null;
  profilePicture: string | null;
  coverImage: string | null;
  cosplayerType: string;
  yearsOfExperience: number | null;
  specialization: string | null;
  skillLevel: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  receiveEmailUpdates: boolean;
  createdAt: string;
  updatedAt: string;
}

// ✅ Add index signature to ProfileSetupData
export interface ProfileSetupData {
  cosplayerType: CosplayerType;
  yearsOfExperience: number | null;
  specialization: string;
  skillLevel: SkillLevel;
  displayName: string;
  bio: string;
  profilePicture: string;
  coverImage: string;
  profilePicturePublicId?: string | null;
  coverImagePublicId?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  receiveEmailUpdates?: boolean;
  [key: string]: unknown; // ✅ Add this index signature
}

export interface CompetitionCredential {
  id: number;
  cosplayTitle: string | null;
  characterName: string | null;
  seriesName: string | null;
  description: string | null;
  position: string;
  category: string | null;
  verified: boolean;
  imageUrl: string | null;
  competition: {
    id: number;
    name: string;
    organizer: string | null;
    status: string;
    eventDate: string;
    location: string | null;
    competitionType: string;
    rivalryType: string;
    level: string;
    logoUrl: string | null;
  };
  awards: Array<{
    id: number;
    title: string;
    description: string | null;
    category: string | null;
  }>;
  submittedAt: string;
  reviewedAt: string | null;
}
// ✅ Export alias for backward compatibility
export type Credential = CompetitionCredential;