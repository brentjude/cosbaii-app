"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/app/context/ProfileContext";
import { useUserCredentials } from "@/hooks/user/useUserCredentials";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import ProfileFeatured from "./components/ProfileFeatured";
import ProfileCompetitions from "./components/ProfileCompetitions";
import EditProfileModal from "@/app/components/user/modals/EditProfileModal";
import AddCredentialsModal from "@/app/components/user/modals/AddCredentialsModal";
import FeaturedCosplaysEditor from "@/app/components/user/modals/FeaturedCosplaysEditor";
import { getPositionInfo } from "@/lib/user/profile/position";
import { formatDate, eventYear } from "@/lib/user/profile/format";
import { getCosplayerTypeDisplay } from "@/lib/user/profile/cosplayer-type";
import { EditProfileData, FeaturedItem, SkillLevel } from "@/types/profile";
import { UserSettings } from "@/types/settings";

const ProfilePage = () => {
  const { data: session } = useSession();
  const { profile, featuredItems, loading, updateProfile } = useProfile();
  const {
    credentials,
    loading: credentialsLoading,
    refetch: refetchCredentials,
  } = useUserCredentials();

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [showAddCredentialsModal, setShowAddCredentialsModal] = useState(false);
  const [showFeaturedEditor, setShowFeaturedEditor] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // Featured cosplays state
  const [featuredCosplays, setFeaturedCosplays] = useState<FeaturedItem[]>([
    { title: "", description: "", imageUrl: "", character: "", series: "", type: "cosplay" },
    { title: "", description: "", imageUrl: "", character: "", series: "", type: "cosplay" },
    { title: "", description: "", imageUrl: "", character: "", series: "", type: "cosplay" },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          setUserSettings(data.settings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (featuredItems.length > 0) {
      const paddedItems = [...featuredItems];
      while (paddedItems.length < 3) {
        paddedItems.push({
          title: "",
          description: "",
          imageUrl: "",
          character: "",
          series: "",
          type: "cosplay",
        });
      }
      setFeaturedCosplays(paddedItems);
    } else {
      setFeaturedCosplays([
        { title: "", description: "", imageUrl: "", character: "", series: "", type: "cosplay" },
        { title: "", description: "", imageUrl: "", character: "", series: "", type: "cosplay" },
        { title: "", description: "", imageUrl: "", character: "", series: "", type: "cosplay" },
      ]);
    }
  }, [featuredItems]);

  const handleFeaturedSave = async (featured: FeaturedItem[]) => {
    try {
      const response = await fetch("/api/user/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      });

      if (!response.ok) {
        throw new Error("Failed to save featured items");
      }

      setFeaturedCosplays(featured);
      setShowFeaturedEditor(false);

      console.log("Featured items saved successfully");
    } catch (error) {
      console.error("Error saving featured items:", error);
      alert("Failed to save featured items. Please try again.");
    }
  };

  // Stats calculations
  const championCount = credentials.filter((c) => c.position === "CHAMPION").length;
  const placedCount = credentials.filter((c) =>
    ["CHAMPION", "FIRST_PLACE", "SECOND_PLACE", "THIRD_PLACE"].includes(c.position)
  ).length;
  const totalCompetitions = credentials.length;

  const cosplayerTypeInfo = getCosplayerTypeDisplay(profile?.cosplayerType);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (editedData: EditProfileData) => {
    setEditLoading(true);
    try {
      const success = await updateProfile(editedData);
      if (success) {
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setEditLoading(false);
    }
  };

  const getEditableProfileData = (): EditProfileData | null => {
    if (!profile) return null;

    return {
      displayName: profile.displayName || "",
      bio: profile.bio || "",
      profilePicture: profile.profilePicture || "/images/default-avatar.png",
      coverImage: profile.coverImage || "/images/default-cover.jpg",
      cosplayerType: profile.cosplayerType,
      yearsOfExperience: profile.yearsOfExperience,
      specialization: profile.specialization || "",
      skillLevel: (profile.skillLevel as SkillLevel) || "beginner",
      featured: featuredCosplays,
      facebookUrl: profile.facebookUrl,
      instagramUrl: profile.instagramUrl,
      twitterUrl: profile.twitterUrl,
    };
  };

  if (loading) {
    return (
      <main className="max-w-[1240px] mx-auto h-screen p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="w-full bg-primary/5 p-6">
        <div className="max-w-[1240px] mx-auto">
          <ProfileHeader
            profile={profile}
            session={session}
            cosplayerTypeInfo={cosplayerTypeInfo}
            userSettings={userSettings}
            championCount={championCount}
            placedCount={placedCount}
            totalCompetitions={totalCompetitions}
            onEditProfile={handleEditProfile}
          />

          <div className="flex flex-row items-start gap-4 mt-4">
            <ProfileInfo profile={profile} session={session} userSettings={userSettings} />

            <div className="basis-2/3 flex flex-col gap-4">
              <ProfileFeatured
                featuredCosplays={featuredCosplays}
                onEdit={() => setShowFeaturedEditor(true)}
              />

              <ProfileCompetitions
                credentials={credentials}
                loading={credentialsLoading}
                onAddCredential={() => setShowAddCredentialsModal(true)}
                getPositionInfo={getPositionInfo}
                formatDate={formatDate}
                eventYear={eventYear}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
        profileData={getEditableProfileData()}
        loading={editLoading}
      />

      <AddCredentialsModal
        isOpen={showAddCredentialsModal}
        onClose={() => setShowAddCredentialsModal(false)}
        onSuccess={() => {
          setShowAddCredentialsModal(false);
          refetchCredentials();
        }}
      />

      <FeaturedCosplaysEditor
        isOpen={showFeaturedEditor}
        onClose={() => setShowFeaturedEditor(false)}
        onSave={handleFeaturedSave}
        initialFeatured={featuredCosplays}
      />
    </>
  );
};

export default ProfilePage;