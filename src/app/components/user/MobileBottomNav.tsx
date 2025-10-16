"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  HomeIcon,
  NewspaperIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  PhotoIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";
import { useProfile } from "@/app/context/ProfileContext";
import AddCredentialsModal from "./modals/AddCredentialsModal";

export default function MobileBottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useProfile();
  const [isClient, setIsClient] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showAddCredentialsModal, setShowAddCredentialsModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCreateMenu(false);
      }
    };

    if (showCreateMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCreateMenu]);

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard");
    }
    return pathname === route;
  };

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleCreateAction = () => {
    setShowCreateMenu(!showCreateMenu);
  };

  const handlePostPhoto = () => {
    setShowCreateMenu(false);
    // Navigate to post photo page or open modal
    router.push("/dashboard/post");
  };

  const handleAddCredentials = () => {
    setShowCreateMenu(false);
    setShowAddCredentialsModal(true);
  };

  const handleCredentialsSuccess = () => {
    setShowAddCredentialsModal(false);
    // Optionally refresh profile data or show success message
    console.log("Credentials added successfully!");
  };

  if (!isClient) return null;

  return (
    <>
      {/* Backdrop overlay when menu is open */}
      {showCreateMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setShowCreateMenu(false)}
        />
      )}

      {/* Create Menu Dropdown */}
      {showCreateMenu && (
        <div 
          ref={menuRef}
          className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-64 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-200">
            <h3 className="font-semibold text-base">Create New</h3>
            <button
              onClick={() => setShowCreateMenu(false)}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Options */}
          <div className="p-2">
            {/* Post a Photo */}
            <button
              onClick={handlePostPhoto}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <PhotoIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Post a Photo</p>
                <p className="text-xs text-base-content/60">Coming soon</p>
              </div>
            </button>

            {/* Add Credentials */}
            <button
              onClick={handleAddCredentials}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                <TrophyIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Add Credentials</p>
                <p className="text-xs text-base-content/60">Competition achievements</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100 border-t border-base-200 shadow-lg">
        <nav className="max-w-screen-xl mx-auto">
          <ul className="flex items-center justify-around h-16 px-2">
            {/* Home Button */}
            <li className="flex-1 flex justify-center">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/dashboard")
                    ? "text-primary"
                    : "text-base-content/70 hover:text-primary"
                }`}
              >
                {isActiveRoute("/dashboard") ? (
                  <HomeIconSolid className="w-6 h-6" />
                ) : (
                  <HomeIcon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">Home</span>
              </button>
            </li>

            {/* Blog Button */}
            <li className="flex-1 flex justify-center">
              <button
                onClick={() => handleNavigation("/blog")}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/blog")
                    ? "text-primary"
                    : "text-base-content/70 hover:text-primary"
                }`}
              >
                {isActiveRoute("/blog") ? (
                  <NewspaperIconSolid className="w-6 h-6" />
                ) : (
                  <NewspaperIcon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">Blog</span>
              </button>
            </li>

            {/* Create/Add Button (Center) */}
            <li className="flex-1 flex justify-center">
              <button
                onClick={handleCreateAction}
                className={`relative flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-primary-focus active:scale-95 ${
                  showCreateMenu ? "scale-95 bg-primary-focus" : ""
                }`}
                aria-label="Create"
              >
                <PlusCircleIcon 
                  className={`w-8 h-8 text-white transition-transform duration-200 ${
                    showCreateMenu ? "rotate-45" : "rotate-0"
                  }`} 
                />
                {!showCreateMenu && (
                  <div className="absolute inset-0 rounded-full bg-primary/20"></div>
                )}
              </button>
            </li>

            {/* Settings Button */}
            <li className="flex-1 flex justify-center">
              <button
                onClick={() => handleNavigation("/settings")}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/settings")
                    ? "text-primary"
                    : "text-base-content/70 hover:text-primary"
                }`}
              >
                {isActiveRoute("/settings") ? (
                  <Cog6ToothIconSolid className="w-6 h-6" />
                ) : (
                  <Cog6ToothIcon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">Settings</span>
              </button>
            </li>

            {/* Profile Avatar Button */}
            <li className="flex-1 flex justify-center">
              <button
                onClick={() => handleNavigation("/profile")}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/profile")
                    ? "text-primary"
                    : "text-base-content/70"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-colors ${
                    isActiveRoute("/profile")
                      ? "border-primary"
                      : "border-base-300"
                  }`}
                >
                  {profile?.profilePicture &&
                  profile.profilePicture !== "/images/default-avatar.png" ? (
                    <div
                      className="w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${profile.profilePicture})`,
                      }}
                    />
                  ) : (
                    <Image
                      src="/images/cosbaii-logo-black.webp"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="text-xs font-medium">Profile</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Add Credentials Modal */}
      <AddCredentialsModal
        isOpen={showAddCredentialsModal}
        onClose={() => setShowAddCredentialsModal(false)}
        onSuccess={handleCredentialsSuccess}
      />
    </>
  );
}