'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// ✅ Define types
interface Profile {
  id: number;
  displayName: string;
  bio: string;
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

interface ProfileContextType {
  profile: Profile | null;
  hasProfile: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
}

// ✅ Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ✅ Provider component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/user/profile/setup');
      const data = await response.json();
      
      setProfile(data.profile);
      setHasProfile(!!data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      const response = await fetch('/api/user/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const responseData = await response.json();

      if (response.ok) {
        // ✅ Update context state immediately
        setProfile(responseData.profile);
        setHasProfile(true);
        return true;
      } else {
        throw new Error(responseData.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // ✅ Fetch profile when user is authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      // Reset profile state when logged out
      setProfile(null);
      setHasProfile(false);
    }
  }, [session, status]);

  const value = {
    profile,
    hasProfile,
    loading,
    refreshProfile,
    updateProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// ✅ Custom hook to use profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};