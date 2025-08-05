"use client";

import React from "react";
import { useProfile } from "@/app/context/ProfileContext"; // ✅ Import context
import Image from "next/image";
import { useSession } from "next-auth/react";
import { UserIcon, CameraIcon } from "@heroicons/react/24/outline";

interface ProfileCardProps {
  champions?: number;
  placed?: number;
  joined?: number;
}

const UserProfileCard: React.FC<ProfileCardProps> = ({
  champions = 0,
  placed = 0,
  joined = 0,
}) => {
  const { data: session } = useSession();
  const { profile, hasProfile, loading } = useProfile(); // ✅ Use context

  // ✅ Show loading skeleton with DaisyUI classes
  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="skeleton h-32 w-full"></div>
        <div className="card-body items-center text-center">
          <div className="skeleton w-24 h-24 rounded-full -mt-16"></div>
          <div className="skeleton h-6 w-32 mt-4"></div>
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-4 w-16"></div>
        </div>
      </div>
    );
  }

  // ✅ Show setup prompt if no profile
  if (!hasProfile || !profile) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <Image
            src={"/images/cosbaii-logo-black.webp"}
            alt="Cosbaii Logo Black"
            className="mx-auto p-2 rounded-full bg-gray-200"
            width={80}
            height={80}
          />
          <h3 className="card-title justify-center">Setup Your Profile</h3>
          <p className="text-sm opacity-70">
            Complete your profile to get started!
          </p>
          <div className="card-actions justify-center mt-4">
            <div className="badge badge-primary badge-outline rounded-lg">
              Profile Incomplete
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Get display values
  const displayName = profile.displayName || session?.user?.name || "User";
  const username = session?.user?.username || "username";
  const avatar = profile.profilePicture || "/images/default-avatar.png";
  const coverImage = profile.coverImage || "/images/default-cover.jpg";

  // ✅ Handle all cosplayer types including PROFESSIONAL
  const getCosplayerTypeDisplay = () => {
    switch (profile.cosplayerType) {
      case "COMPETITIVE":
        return { text: "🏆 Competitive Cosplayer", class: "badge-primary" };
      case "HOBBY":
        return { text: "🎨 Hobby Cosplayer", class: "badge-secondary" };
      case "PROFESSIONAL":
        return { text: "💼 Professional Cosplayer", class: "badge-accent" };
      default:
        return { text: "Cosplayer", class: "badge-outline" };
    }
  };

  const cosplayerTypeInfo = getCosplayerTypeDisplay();

  return (
    <div className="card bg-base-100 rounded-xl shadow-lg">
      {/* Cover Image */}
      <figure className="h-32 relative bg-gradient-to-r from-primary to-secondary">
        {coverImage ? (
          <Image src={coverImage} alt="Cover" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <CameraIcon className="w-8 h-8 text-white opacity-50" />
          </div>
        )}
      </figure>

      {/* Profile Content */}
      <div className="card-body items-center text-center">
        {/* Profile Picture */}
        <div className="avatar -mt-16 mb-2">
          <div className="w-24 rounded-full border-4 border-base-100 bg-base-200">
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-base-content opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h2 className="card-title text-lg justify-center">{displayName}</h2>
          <p className="text-sm opacity-70">@{username}</p>

          {/* Cosplayer Type Badge */}
          <div className={`badge ${cosplayerTypeInfo.class} badge-sm mt-2`}>
            {cosplayerTypeInfo.text}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-center opacity-80 line-clamp-3 mb-4">
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="w-full stats stats-horizontal shadow-sm mb-4 rounded-md bg-base-200">
          <div className="stat py-2 px-3">
            <div className="stat-value text-lg">{champions}</div>
            <div className="stat-title text-xs">Champions</div>
          </div>
          <div className="stat py-2 px-3">
            <div className="stat-value text-lg">{placed}</div>
            <div className="stat-title text-xs">Placed</div>
          </div>
          <div className="stat py-2 px-3">
            <div className="stat-value text-lg">{joined}</div>
            <div className="stat-title text-xs">Joined</div>
          </div>
        </div>

        {/* Experience & Skills */}
        {(profile.yearsOfExperience ||
          profile.specialization ||
          profile.skillLevel) && (
          <div className="mb-4 w-full">
            <div className="grid grid-cols-1 gap-2 text-xs">
              {profile.yearsOfExperience && (
                <div className="flex justify-between">
                  <span className="opacity-70">Experience:</span>
                  <span className="font-medium">
                    {profile.yearsOfExperience}{" "}
                    {profile.yearsOfExperience === 1 ? "year" : "years"}
                  </span>
                </div>
              )}
              {profile.specialization && (
                <div className="flex justify-between">
                  <span className="opacity-70">Specializes in:</span>
                  <span className="font-medium">{profile.specialization}</span>
                </div>
              )}
              {profile.skillLevel && (
                <div className="flex justify-between">
                  <span className="opacity-70">Skill Level:</span>
                  <div
                    className={`badge badge-xs ${
                      profile.skillLevel === "advanced"
                        ? "badge-success"
                        : profile.skillLevel === "intermediate"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {profile.skillLevel.charAt(0).toUpperCase() +
                      profile.skillLevel.slice(1)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-center w-full">
          <button className="btn btn-primary btn-sm w-full">SEE PROFILE</button>
          <button className="btn btn-outline btn-sm w-full">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
