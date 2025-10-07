// Update: src/app/context/ProfileContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSession } from "next-auth/react";

interface Profile {
  id: number;
  userId: number;
  cosplayerType: "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
  yearsOfExperience: number | null;
  specialization: string | null;
  skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | undefined;
  displayName: string | null;
  bio: string | null;
  profilePicture: string | null;
  coverImage: string | null;
  profilePicturePublicId: string | null;
  coverImagePublicId: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  receiveEmailUpdates: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FeaturedItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  character?: string;
  series?: string;
  type: "competition" | "cosplay";
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
  position?: string;
  award?: string;
}

interface ProfileUpdateData {
  displayName?: string;
  bio?: string;
  profilePicture?: string;
  coverImage?: string;
  cosplayerType?: "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
  yearsOfExperience?: number | null;
  specialization?: string;
  skillLevel?: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  receiveEmailUpdates?: boolean;
  [key: string]: unknown;
}

interface ProfileSetupData extends ProfileUpdateData {
  displayName: string;
  cosplayerType: "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
}

interface ProfileContextType {
  profile: Profile | null;
  featuredItems: FeaturedItem[];
  hasProfile: boolean;
  loading: boolean;
  updateProfile: (profileData: ProfileUpdateData) => Promise<boolean>;
  setupProfile: (
    profileData: ProfileSetupData
  ) => Promise<{ success: boolean; error?: string; profile?: Profile }>;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    // ✅ Don't fetch if no session or still loading
    if (status === "loading") {
      return;
    }

    if (!session?.user?.id) {
      setLoading(false);
      setProfile(null);
      setHasProfile(false);
      return;
    }

    try {
      setLoading(true);

      // ✅ Fetch profile data with error handling
      const profileResponse = await fetch("/api/user/profile", {
        credentials: "include", // ✅ Include credentials
      });

      // ✅ Check content type before parsing
      const contentType = profileResponse.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        console.error("Profile API returned non-JSON response");
        throw new Error("Invalid response from profile API");
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);
        setHasProfile(!!profileData.profile);
      } else {
        console.error("Profile fetch failed:", profileResponse.status);
        setProfile(null);
        setHasProfile(false);
      }

      // ✅ Fetch featured items with error handling
      const featuredResponse = await fetch("/api/user/featured", {
        credentials: "include", // ✅ Include credentials
      });

      const featuredContentType = featuredResponse.headers.get("content-type");

      if (
        featuredResponse.ok &&
        featuredContentType?.includes("application/json")
      ) {
        const featuredData = await featuredResponse.json();
        setFeaturedItems(featuredData.featured || []);
      } else {
        setFeaturedItems([]);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfile(null);
      setHasProfile(false);
      setFeaturedItems([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, status]); // ✅ Added status to dependencies

  const setupProfile = async (
    profileData: ProfileSetupData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/user/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Include credentials
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to setup profile");
      }

      const data = await response.json();

      // Update context state
      setProfile(data.profile);
      setHasProfile(true);

      return { success: true };
    } catch (error) {
      console.error("Error setting up profile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Setup failed",
      };
    }
  };

  const updateProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Include credentials
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchProfile(); // Refresh profile data
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const value = {
    profile,
    featuredItems,
    hasProfile,
    loading,
    updateProfile,
    setupProfile,
    fetchProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const ProfileProvider = ProfileContextProvider;

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
