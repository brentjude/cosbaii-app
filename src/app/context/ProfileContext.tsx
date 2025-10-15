"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { 
  Profile as ProfileType, 
  EditProfileData,
  ProfileSetupData, // ✅ Import ProfileSetupData
  FeaturedItem 
} from "@/types/profile";

interface ProfileContextType {
  profile: ProfileType | null;
  featuredItems: FeaturedItem[];
  hasProfile: boolean;
  loading: boolean;
  updateProfile: (data: EditProfileData) => Promise<boolean>;
  setupProfile: (data: ProfileSetupData) => Promise<boolean>; // ✅ Changed to ProfileSetupData
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setFeaturedItems(data.featured || []);
        setHasProfile(!!data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const updateProfile = async (data: EditProfileData): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  // ✅ Accept ProfileSetupData and convert it internally
  const setupProfile = async (data: ProfileSetupData): Promise<boolean> => {
    try {
      // Convert ProfileSetupData to EditProfileData by adding empty featured array
      const dataWithFeatured: EditProfileData = {
        ...data,
        featured: [], // Initialize with empty featured items
      };

      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithFeatured),
      });

      if (response.ok) {
        await fetchProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error setting up profile:", error);
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