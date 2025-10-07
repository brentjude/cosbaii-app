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
  displayName: string;
  bio: string | null;
  cosplayerType: CosplayerType;
  specialization: string;
  skillLevel: SkillLevel;
  profilePicture: string;
  coverImage: string;
  yearsOfExperience: number | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
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
