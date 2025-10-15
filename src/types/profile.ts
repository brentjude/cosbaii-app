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
  competition: Competition;
  cosplayTitle?: string | null;
  position?: string;
  category?: string;
  imageUrl?: string | null;
}

export interface FeaturedItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  character?: string;
  series?: string;
  type: "competition" | "cosplay";
  competitionId?: number;
  competition?: Competition;
  position?: string;
  award?: string;
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
  displayName: string; // ✅ Changed from string | null to string
  bio: string | null;
  profilePicture: string | null;
  coverImage: string | null;
  cosplayerType: CosplayerType;
  yearsOfExperience: number | null;
  specialization: string | null;
  skillLevel: SkillLevel | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
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

// ✅ Use the same type as CompetitionCredential
export interface CompetitionCredential {
  id: number;
  position: string;
  verified: boolean;
  imageUrl: string | null;
  cosplayTitle: string | null;
  createdAt: Date;
  competition: {
    id: number;
    name: string;
    eventDate: string;
    competitionType: string;
    rivalryType: string;
    logoUrl: string | null;
  };
}

// ✅ Export alias for backward compatibility
export type Credential = CompetitionCredential;