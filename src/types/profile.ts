// src/types/profile.ts
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