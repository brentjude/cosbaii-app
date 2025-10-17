// Update: src/app/components/user/UserHeader.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightEndOnRectangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useProfile } from "@/app/context/ProfileContext";
import ProfileSetupModal from "./modals/ProfileSetupModal";
import UserLogout from "./UserLogout";
import NotificationCard from "./NotificationCard";
import { ProfileSetupData } from "@/types/profile";
import UserHeaderSkeleton from "../skeletons/user/UserHeaderSkeleton";
import { Notification } from "@/types/notification";

export default function UserHeader() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  // ✅ Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 5; // Load 5 at a time

  const { profile, hasProfile, setupProfile } = useProfile();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Load initial notifications
  useEffect(() => {
    if (session?.user) {
      loadNotifications(true);
    }
  }, [session?.user]);

  const loadNotifications = async (isInitial = false) => {
    if (isInitial) {
      setNotificationsLoading(true);
      setSkip(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentSkip = isInitial ? 0 : skip;
      const response = await fetch(
        `/api/user/notifications?take=${take}&skip=${currentSkip}`
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();

      if (isInitial) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      setSkip(currentSkip + take);
      setHasMore(data.notifications.length === take);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setNotificationsLoading(false);
      setLoadingMore(false);
    }
  };

  const markAsRead = async (ids: number[]) => {
    try {
      const response = await fetch("/api/user/notifications/mark-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: ids }),
      });

      if (!response.ok) throw new Error("Failed to mark as read");

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/user/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to mark all as read");

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const closeDropdown = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleProfileSetupComplete = async (profileData: ProfileSetupData) => {
    setSetupLoading(true);
    try {
      const result = await setupProfile(profileData);

      if (result) {
        setShowProfileSetup(false);
        console.log("Profile setup successful!");
      } else {
        throw new Error("Failed to setup profile");
      }
    } catch (error) {
      console.error("Profile setup error:", error);
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

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard");
    }
    return pathname === route;
  };

  // ✅ Handle load more without closing dropdown
  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    loadNotifications(false);
  };

  // ✅ Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ✅ Show skeleton while loading
  if (status === "loading") {
    return <UserHeaderSkeleton />;
  }

  return (
    <>
      <header className="w-full shadow-xs bg-base-100">
        <div className="navbar max-w-[1240px] mx-auto">
          <div className="navbar-start">
            <Link
              className="ml-2 hover:bg-gray-50 cursor-pointer"
              href="/dashboard"
            >
              <Image
                src={"/images/cosbaii-colored-wordmark.svg"}
                alt="Logo"
                width={150}
                height={30}
              />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on Mobile */}
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
                  <HomeIcon className="text-base-400 size-7" />
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`!p-0 flex flex-col hover:bg-white hover:text-primary ${
                    isActiveRoute("/profile") ? "text-primary" : "text-base-400"
                  }`}
                >
                  <UserIcon className="text-base-400 size-7" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-end flex items-center gap-2">
            {/* ✅ Notification Dropdown - Visible on all screens */}
            <div className="dropdown dropdown-bottom dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                aria-label="Notifications"
              >
                <div className="indicator">
                  <BellIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="badge badge-xs badge-primary indicator-item">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              </div>

              {/* ✅ Remove tabIndex from dropdown content */}
              <div className="dropdown-content bg-base-100 rounded-lg z-[1] mt-3 w-80 sm:w-96 shadow-lg border border-gray-200">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          markAllAsRead();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                {/* ✅ Notifications List with Fixed Height and Scroll */}
                <div className="h-[400px] overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="p-4 space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-gray-300 rounded"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notifications.length > 0 ? (
                    <>
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-3 hover:bg-gray-50 transition-colors"
                          >
                            <NotificationCard
                              notification={notification}
                              onMarkAsRead={(id) => {
                                markAsRead([id]);
                              }}
                              compact={true}
                            />
                          </div>
                        ))}
                      </div>

                      {/* ✅ Load More Button with preventDefault */}
                      {hasMore && (
                        <div className="p-4 border-t border-gray-100">
                          <button
                            onClick={handleLoadMore}
                            onMouseDown={(e) => e.preventDefault()}
                            disabled={loadingMore}
                            className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors py-2 px-4 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingMore ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="loading loading-spinner loading-sm"></span>
                                Loading...
                              </span>
                            ) : (
                              "See previous notifications"
                            )}
                          </button>
                        </div>
                      )}

                      {/* ✅ End of notifications message */}
                      {!hasMore && notifications.length > 0 && (
                        <div className="p-4 text-center border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            No more notifications
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <BellIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 text-sm">
                          No notifications yet
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Username - Hidden on Mobile */}
            {session?.user && (
              <span className="text-sm hidden lg:inline-block">
                {session.user.username}
              </span>
            )}

            {/* Complete Profile Button */}
            {isClient && session?.user && !hasProfile && (
              <button
                className="btn btn-primary btn-sm hidden lg:flex"
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

            {/* Desktop Avatar Dropdown - Hidden on Mobile */}
            {session?.user && (
              <div className="dropdown dropdown-bottom dropdown-end hidden lg:block">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200">
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
                      href="/settings"
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
            )}
          </div>

          <UserLogout />
        </div>
      </header>

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
}