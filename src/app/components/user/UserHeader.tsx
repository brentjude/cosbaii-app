"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UserLogout from "./UserLogout";
import ProfileSetupModal from "../skeletons/user/ProfileSetupModal";
import { useProfile } from "@/app/context/ProfileContext"; // ✅ Import context

//icons
import {
  UserIcon,
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/16/solid";

const UserHeader = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // ✅ Use profile context instead of local state
  const { hasProfile, updateProfile, loading } = useProfile();

  const closeDropdown = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  // ✅ Simplified handler using context
  const handleProfileSetupComplete = async (profileData: any) => {
    const success = await updateProfile(profileData);

    if (success) {
      setShowProfileSetup(false);
      console.log("Profile setup successful!");
    } else {
      alert("Profile setup failed. Please try again.");
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

  return (
    <>
      <header className="w-full shadow-xs">
        <div className="navbar max-w-[1240px] mx-auto">
          <div className="navbar-start">
            <a className="btn btn-ghost">
              <Image
                src={"/images/cosbaii-colored-wordmark.svg"}
                alt="Logo"
                width={150}
                height={30}
              />
            </a>
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
            {session?.user && !hasProfile && (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleOpenProfileSetup}
              >
                Complete Profile
              </button>
            )}

            {session?.user ? (
              <div className="dropdown dropdown-bottom dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
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

      <ProfileSetupModal
        isOpen={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
        onComplete={handleProfileSetupComplete}
        loading={loading}
      />
    </>
  );
};

export default UserHeader;
