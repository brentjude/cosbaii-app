// src/app/context/ProfileContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  id: number;
  displayName: string;
  bio: string | null;
  cosplayerType: "COMPETITIVE" | "HOBBY" | "PROFESSIONAL";
  specialization: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  profilePicture: string;
  coverImage: string;
  yearsOfExperience: number | null;
}

interface ProfileContextType {
  profile: Profile | null;
  hasProfile: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (status !== "authenticated" || !session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // ✅ Fix: Use absolute API path
      const response = await fetch("/api/user/profile/setup", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Include credentials for auth
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
          setHasProfile(true);
        } else {
          setProfile(null);
          setHasProfile(false);
        }
      } else if (response.status === 404) {
        // Profile doesn't exist yet
        setProfile(null);
        setHasProfile(false);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      // ✅ Fix: Use absolute API path
      const response = await fetch("/api/user/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Include credentials for auth
        body: JSON.stringify(profileData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setProfile(responseData.profile);
        setHasProfile(true);
        return true;
      } else {
        console.error("Profile update failed:", responseData);
        throw new Error(responseData.message || "Profile update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  // ✅ Only fetch profile when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setProfile(null);
      setHasProfile(false);
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        hasProfile,
        loading,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
