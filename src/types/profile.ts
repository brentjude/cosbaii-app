// src/types/profile.ts
export type CosplayerType = "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface FeaturedItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  character?: string;
  series?: string;
  competitionId?: number;
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