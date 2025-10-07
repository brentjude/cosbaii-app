// Update: src/app/(user)/settings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

// Import modals (we'll create these)
import ChangeEmailModal from "@/app/components/user/settings/ChangeEmailModal";
import ChangePasswordModal from "@/app/components/user/settings/ChangePasswordModal";
import ChangeDisplayNameModal from "@/app/components/user/settings/ChangeDisplayNameModal";
import DeleteAccountModal from "@/app/components/user/settings/DeleteAccountModal";
import EditProfileModal from "@/app/components/user/modals/EditProfileModal";
import { useProfile } from "@/app/context/ProfileContext";

import {
  EditProfileData,
} from "@/app/types/profile";

interface UserSettings {
  id?: number;
  userId?: number;
  showCompetitionCounter: boolean;
  showBadges: boolean;
  lastDisplayNameChange?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const SettingsPage = () => {
  const { data: session } = useSession();
  const { profile, updateProfile } = useProfile(); // ✅ Add updateProfile here
  const [activeTab, setActiveTab] = useState<"account" | "profile">("account");

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    showCompetitionCounter: true,
    showBadges: true,
  });

  // Modal states
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeDisplayName, setShowChangeDisplayName] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  ///loading state
  const [editLoading, setEditLoading] = useState(false);

  // Load user settings on mount
  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };


  //Handle save profile data
  const handleSaveProfile = async (data: EditProfileData) => {
    setEditLoading(true);
    try {
      if (!updateProfile) {
        console.error("updateProfile function not available");
        return;
      }

      const success = await updateProfile(data);
      if (success) {
        setShowEditProfile(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
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
      cosplayerType: profile.cosplayerType || "HOBBY",
      yearsOfExperience: profile.yearsOfExperience || 0,
      specialization: profile.specialization || "",
      skillLevel: (profile.skillLevel?.toLowerCase() as "beginner" | "intermediate" | "advanced") || "beginner", // ✅ Provide proper type
      facebookUrl: profile.facebookUrl || null,
      instagramUrl: profile.instagramUrl || null,
      twitterUrl: profile.twitterUrl || null,
      featured: [],
    };
  };

  const updateSetting = async (key: keyof UserSettings, value: boolean) => { // ✅ Changed from 'any' to 'boolean'
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (response.ok) {
        setSettings((prev) => ({ ...prev, [key]: value }));
        console.log(`Updated ${key} to ${value}`);
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  // Check if display name can be changed (7 day cooldown)
  const canChangeDisplayName = () => {
    if (!settings.lastDisplayNameChange) return true;
    const lastChange = new Date(settings.lastDisplayNameChange);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff >= 7;
  };

  const getDisplayNameCooldown = () => {
    if (!settings.lastDisplayNameChange) return 0;
    const lastChange = new Date(settings.lastDisplayNameChange);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, 7 - daysDiff);
  };

    return (
    <>
      <div className="max-w-[800px] mx-auto p-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="tabs tabs-bordered mt-4">
            {/* Account Tab */}
            <input
              type="radio"
              name="settings_tabs"
              className="tab"
              aria-label="Account"
              checked={activeTab === "account"}
              onChange={() => setActiveTab("account")}
            />
            <div className="tab-content border-base-300 bg-base-100 py-10 px-4 rounded-md mt-4">
              <h2 className="text-lg font-bold mb-4">General</h2>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Email Address</h3>
                  <small className="text-xs text-gray-500">
                    {session?.user?.email}
                  </small>
                </div>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={() => setShowChangeEmail(true)}
                >
                  <ChevronRightIcon className="w-8 h-8 text-black" />
                </button>
              </div>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Change Password</h3>
                  <small className="text-xs text-gray-500">
                    Update your account password
                  </small>
                </div>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={() => setShowChangePassword(true)}
                >
                  <ChevronRightIcon className="w-8 h-8 text-black" />
                </button>
              </div>

              <h2 className="text-lg font-bold mt-4 mb-4">
                Account Authorization
              </h2>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Google</h3>
                  <small className="text-xs text-gray-500">
                    Connect to log in to Cosbaii with your Google Account
                  </small>
                </div>
                <button className="btn font-bold">Connect</button>
              </div>

              <h2 className="text-lg font-bold mt-4 mb-4">Advanced</h2>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Delete account</h3>
                  <small className="text-xs text-warning">
                    This will delete all of your Cosbaii media and data
                  </small>
                </div>
                <button
                  className="btn btn-error"
                  onClick={() => setShowDeleteAccount(true)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Profile Tab */}
            <input
              type="radio"
              name="settings_tabs"
              className="tab"
              aria-label="Profile"
              checked={activeTab === "profile"}
              onChange={() => setActiveTab("profile")}
            />
            <div className="tab-content border-base-300 bg-base-100 py-10 px-4 rounded-md mt-4">
              <h2 className="text-lg font-bold mb-4">General</h2>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Display Name</h3>
                  <small className="text-xs text-gray-500">
                    {profile?.displayName || "Not set"}
                    <br />
                    {!canChangeDisplayName() && (
                      <span className="text-warning">
                        Can change in {getDisplayNameCooldown()} day(s)
                      </span>
                    )}
                    {canChangeDisplayName() &&
                      "You can change your display name once every 7 days"}
                  </small>
                </div>
                <button
                  className={`btn btn-ghost btn-circle ${
                    !canChangeDisplayName() ? "btn-disabled" : ""
                  }`}
                  onClick={() =>
                    canChangeDisplayName() && setShowChangeDisplayName(true)
                  }
                  disabled={!canChangeDisplayName()}
                >
                  <ChevronRightIcon className="w-8 h-8 text-black" />
                </button>
              </div>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Edit Profile</h3>
                  <small className="text-xs text-gray-500">
                    Update your bio, specialization, and profile images
                  </small>
                </div>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={() => setShowEditProfile(true)}
                >
                  <ChevronRightIcon className="w-8 h-8 text-black" />
                </button>
              </div>

              <h2 className="text-lg font-bold mb-4 mt-4">
                Curate your profile
              </h2>
              <small className="text-sm mb-8 block">
                Manage what content shows on your Cosbaii profile
              </small>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Competition Counter</h3>
                  <small className="text-xs text-gray-500">
                    Show competition counter on my profile
                  </small>
                </div>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={settings.showCompetitionCounter}
                  onChange={(e) =>
                    updateSetting("showCompetitionCounter", e.target.checked)
                  }
                />
              </div>

              <div className="py-4 flex flex-row justify-between">
                <div>
                  <h3 className="text-sm">Badges</h3>
                  <small className="text-xs text-gray-500">
                    Show badges on your profile
                  </small>
                </div>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={settings.showBadges}
                  onChange={(e) =>
                    updateSetting("showBadges", e.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangeEmailModal
        isOpen={showChangeEmail}
        onClose={() => setShowChangeEmail(false)}
        currentEmail={session?.user?.email || ""}
      />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <ChangeDisplayNameModal
        isOpen={showChangeDisplayName}
        onClose={() => setShowChangeDisplayName(false)}
        currentDisplayName={profile?.displayName || ""}
        onSuccess={() => {
          fetchUserSettings();
          setShowChangeDisplayName(false);
        }}
      />

      <DeleteAccountModal
        isOpen={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
        profileData={getEditableProfileData()}
        loading={editLoading}
      />
    </>
  );
};

export default SettingsPage;