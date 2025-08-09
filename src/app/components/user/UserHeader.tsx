"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UserLogout from "./UserLogout";
import ProfileSetupModal from "./modals/ProfileSetupModal";
import { useProfile } from "@/app/context/ProfileContext";

//icons
import {
  UserIcon,
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/16/solid";

const UserHeader = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // ✅ Add missing setupLoading state
  const [setupLoading, setSetupLoading] = useState(false);

  // ✅ Use profile context - get profile to access profilePicture
  const { profile, hasProfile, updateProfile, setupProfile, loading } = useProfile();

  // ✅ Ensure component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const closeDropdown = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  // ✅ Fix handler to use setupProfile instead of updateProfile for setup
  const handleProfileSetupComplete = async (profileData: any) => {
    setSetupLoading(true);
    try {
      const result = await setupProfile(profileData);
      
      if (result.success) {
        setShowProfileSetup(false);
        console.log("Profile setup successful!");
      } else {
        throw new Error(result.error || 'Failed to setup profile');
      }
    } catch (error) {
      console.error('Profile setup error:', error);
      alert("Profile setup failed. Please try again.");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleOpenProfileSetup = () => {
    closeDropdown();
    setShowProfileSetup(true);
  };

  const handleLogoutClick = () => {
    closeDropdown();
    const modal = document.getElementById("logoutModal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  // Check if route is active
  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard");
    }
    return pathname === route;
  };

  // ✅ Get avatar image source with fallback
  const getAvatarSrc = () => {
    if (profile?.profilePicture && profile.profilePicture !== "/images/default-avatar.png") {
      return profile.profilePicture;
    }
    return "/images/cosbaii-logo-black.webp";
  };

  return (
    <>
      <header className="w-full shadow-xs sticky top-0 z-50 bg-base-100">
        <div className="navbar max-w-[1240px] mx-auto">
          <div className="navbar-start">
            <Link className="ml-2 hover:bg-gray-50 cursor-pointer" href="/dashboard">
              <Image
                src={"/images/cosbaii-colored-wordmark.svg"}
                alt="Logo"
                width={150}
                height={30}
              />
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal flex items-center gap-10 !p-0">
              <li>
                <Link
                  href="/dashboard"
                  className={`!p-0 flex flex-col hover:bg-white hover:text-primary ${
                    isActiveRoute("/dashboard")
                      ? "text-primary"
                      : "text-base-400"
                  }`}
                >
                  <HomeIcon className="text-base-400 size-8" />
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`!p-0 flex flex-col hover:bg-white hover:text-primary ${
                    isActiveRoute("/profile") ? "text-primary" : "text-base-400"
                  }`}
                >
                  <UserIcon className="text-base-400 size-8" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-end flex items-center gap-2">
            {session?.user && (
              <span className="text-sm">{session.user.username}</span>
            )}

            {/* ✅ Uses context hasProfile state */}
            {isClient && status !== "loading" && session?.user && !hasProfile && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOpenProfileSetup}
                disabled={setupLoading}
              >
                {setupLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Setting up...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
            )}

            {session?.user ? (
              <div className="dropdown dropdown-bottom dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  {/* ✅ Updated avatar with user profile picture or fallback */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200">
                    {profile?.profilePicture && profile.profilePicture !== "/images/default-avatar.png" ? (
                      <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${profile.profilePicture})`
                        }}
                      />
                    ) : (
                      <Image
                        src="/images/cosbaii-logo-black.webp"
                        alt="Default Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-md z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <UserIcon className="w-4 h-4" /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <Cog6ToothIcon className="w-4 h-4" /> Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 w-full text-left text-error hover:bg-error hover:text-error-content"
                    >
                      <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <span className="text-sm">Guest</span>
            )}
          </div>

          <UserLogout />
        </div>
      </header>

      {/* ✅ Only render modal after client mount */}
      {isClient && (
        <ProfileSetupModal
          isOpen={showProfileSetup}
          onClose={() => setShowProfileSetup(false)}
          onComplete={handleProfileSetupComplete}
          loading={setupLoading}
        />
      )}
    </>
  );
};

export default UserHeader;