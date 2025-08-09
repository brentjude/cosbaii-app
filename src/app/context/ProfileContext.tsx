// Update: src/app/context/ProfileContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Profile {
  id: number;
  userId: number;
  cosplayerType: 'COMPETITIVE' | 'HOBBY' | 'PROFESSIONAL';
  yearsOfExperience: number | null;
  specialization: string | null;
  skillLevel: string | null;
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

interface ProfileContextType {
  profile: Profile | null;
  hasProfile: boolean;
  loading: boolean;
  updateProfile: (profileData: any) => Promise<boolean>;
  setupProfile: (profileData: any) => Promise<{ success: boolean; error?: string; profile?: Profile }>;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else if (response.status === 404) {
        // Profile doesn't exist yet
        setProfile(null);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed updateProfile method
  const updateProfile = async (profileData: any): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Updating profile with data:', profileData);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile update response:', data);
        setProfile(data.profile);
        return true;
      } else {
        // Log error details
        const errorData = await response.json();
        console.error('Profile update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setupProfile = async (profileData: any): Promise<{ success: boolean; error?: string; profile?: Profile }> => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to setup profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      
      return { success: true, profile: data.profile };
    } catch (error: any) {
      console.error('Setup profile error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      setProfile(null);
      setLoading(false);
    }
  }, [session, status]);

  const hasProfile = profile !== null;

  const contextValue: ProfileContextType = {
    profile,
    hasProfile,
    loading,
    updateProfile,
    setupProfile,
    fetchProfile,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};