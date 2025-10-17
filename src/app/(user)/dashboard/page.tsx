// Update: src/app/(user)/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import UserDashboardSkeleton from "@/app/components/skeletons/user/UserDashboardSkeleton";
import UserProfileCard from "@/app/components/user/UserProfileCard";
import { useProfile } from "@/app/context/ProfileContext";
import SubmitFeedbackCard from "@/app/components/user/SubmitFeedbackCard";
import NotificationCard from "@/app/components/user/NotificationCard";
import BadgesSection from "@/app/components/user/BadgeSection";
import { Notification } from "@/types/notification";

//Hero icons
import { CheckBadgeIcon, BellIcon } from "@heroicons/react/16/solid";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  // ✅ Redirect admins to admin dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      window.location.href = "/admin";
    }
  }, [session, status]);

  const { hasProfile, loading } = useProfile();

  // ✅ Notification state with pagination
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // ✅ Use ref for page to avoid dependency issues
  const pageRef = useRef(0);
  const ITEMS_PER_PAGE = 5;

  // Get display name
  const displayName = session?.user?.username || session?.user?.name;

  // ✅ Fixed: Remove page from dependencies and use ref
  const loadNotifications = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setNotificationsLoading(true);
      pageRef.current = 0;
      setNotifications([]); // ✅ Clear existing notifications
    } else {
      setLoadingMore(true);
    }

    try {
      const currentPage = isInitial ? 0 : pageRef.current;
      const skip = currentPage * ITEMS_PER_PAGE;

      const response = await fetch(
        `/api/user/notifications?take=${ITEMS_PER_PAGE}&skip=${skip}`
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();

      if (isInitial) {
        setNotifications(data.notifications);
      } else {
        // ✅ Append to existing notifications
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      // ✅ Update ref instead of state
      pageRef.current = currentPage + 1;
      
      // ✅ If we got less than ITEMS_PER_PAGE, there are no more
      const shouldHaveMore = data.notifications.length === ITEMS_PER_PAGE;
      setHasMore(shouldHaveMore);
      
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
      setHasMore(false);
    } finally {
      setNotificationsLoading(false);
      setLoadingMore(false);
    }
  }, [ITEMS_PER_PAGE]); // ✅ Only ITEMS_PER_PAGE in dependencies

  useEffect(() => {
  if (session?.user?.id) {
    loadNotifications(true);
  }
}, [session?.user?.id, loadNotifications]);

  const markAsRead = async (notificationId: number) => {
  try {
    // ✅ Ensure notificationId is a number
    if (!notificationId || isNaN(Number(notificationId))) {
      console.error("Invalid notification ID:", notificationId);
      throw new Error("Invalid notification ID");
    }

    const response = await fetch("/api/user/notifications/mark-read", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        notificationId: Number(notificationId) // ✅ Ensure it's a number
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mark as read failed:", errorData);
      throw new Error(errorData.message || "Failed to mark as read");
    }

    const data = await response.json();
    console.log("Mark as read success:", data);

    // Update local state
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );

  
  } catch (err) {
    console.error("Error marking as read:", err);
    throw err;
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

  // Show skeleton while session or profile is loading
  if (status === "loading" || loading) {
    return <UserDashboardSkeleton />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{displayName ? `, ${displayName}` : ""}!
        </h1>
        <p className="text-gray-600 mt-2">Here is your Cosbaii dashboard</p>
      </div>

      {/* Profile Setup Prompt */}
      {!hasProfile && (
        <div className="alert alert-info mb-4 rounded-lg text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">Complete your profile setup!</h3>
            <div className="text-xs">
              You&apos;ve got 7 days to fully set up your Cosbaii profile.
              <br />
              We&apos;ll check if everything&apos;s complete, and if not, your
              profile will be removed to make space for new members.
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg mb-4 p-6 text-white">
        <h1 className="text-3xl mb-2 font-paytone">
          Cosbaii is still in Beta!
        </h1>
        <p className="text-white/90">
          Cosbaii is in early access. Features may change as we continue
          development
          <br /> You may experience bugs and glitches. Don&apos;t forget to
          submit a feedback!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <UserProfileCard />
          <SubmitFeedbackCard />
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-3">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckBadgeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Badges Earned
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Likes</p>
                  <p className="text-2xl font-semibold text-gray-900">156</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Following</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <BadgesSection />
          </div>

          {/* ✅ Updated Recent Activity with Pagination */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  {unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {/* ✅ Fixed Height Container with Scroll */}
            <div className="p-6">
              <div className="max-h-[600px] overflow-y-auto">
                {notificationsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg">
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
                  <div className="space-y-3">
                    {notifications.map((notification, index) => (
                      <NotificationCard
                        key={`${notification.id}-${index}`}
                        notification={notification}
                        onMarkAsRead={(id) => {
                          markAsRead(id);
                        }}
                        compact={false}
                      />
                    ))}

                    {/* ✅ Load More Button - Always shows if hasMore is true */}
                    {hasMore && (
                      <div className="text-center pt-4 mt-4 border-t border-gray-100">
                        <button
                          onClick={() => loadNotifications(false)}
                          disabled={loadingMore}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors py-2 px-4 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          {loadingMore ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="loading loading-spinner loading-sm"></span>
                              Loading more...
                            </span>
                          ) : (
                            `See previous notifications`
                          )}
                        </button>
                      </div>
                    )}

                    {/* ✅ End of notifications message */}
                    {!hasMore && (
                      <div className="text-center pt-4 mt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          No more notifications
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <BellIcon className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600">
                      {!hasProfile
                        ? "No activity yet. Start by completing your profile!"
                        : "No recent activity. Start exploring!"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;