// src/types/profile.ts
export type CosplayerType = "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

// updated to add types competition or cosplay
export interface FeaturedItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  character?: string;
  series?: string;
  
  // Add type field to distinguish between competition and custom cosplay
  type: 'competition' | 'cosplay';
  
  // Competition-related fields (only used when type is 'competition')
  competitionId?: number;
  competition?: {
    id: number;
    name: string;
    eventDate: string;
    location?: string;
    competitionType: string;
    rivalryType: string;
    level: string;
  };
  
  // Additional fields for competition results
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
  // Add social media fields
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null; // or xUrl
}

export interface Profile {
  id: number;
  displayName: string;
  bio: string | null;
  cosplayerType: 'COMPETITIVE' | 'HOBBY' | 'PROFESSIONAL';
  specialization: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  profilePicture: string;
  coverImage: string;
  yearsOfExperience: number | null;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
}

export interface ProfileSetupData {
  cosplayerType: "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
  yearsOfExperience: number | null;
  specialization: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  displayName: string;
  bio: string;
  profilePicture: string;
  coverImage: string;
}