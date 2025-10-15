"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
// ✅ Rename the import to avoid conflict
import { 
  Profile as ProfileType, 
  EditProfileData, 
  FeaturedItem 
} from "@/types/profile";

interface ProfileContextType {
  profile: ProfileType | null; // ✅ Use ProfileType instead of Profile
  featuredItems: FeaturedItem[];
  hasProfile: boolean;
  loading: boolean;
  updateProfile: (data: EditProfileData) => Promise<boolean>;
  setupProfile: (data: EditProfileData) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileType | null>(null); // ✅ Use ProfileType
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
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
  };

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

  const setupProfile = async (data: EditProfileData): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
  }, [session?.user?.id]); // ✅ Use dependency instead of fetchProfile

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