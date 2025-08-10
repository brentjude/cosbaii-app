// Update: src/app/(user)/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import UserDashboardSkeleton from "@/app/components/skeletons/user/UserDashboardSkeleton";
import UserProfileCard from "@/app/components/user/UserProfileCard";
import { useProfile } from "@/app/context/ProfileContext";
import SubmitFeedbackCard from "@/app/components/user/SubmitFeedbackCard";
import NotificationCard from "@/app/components/user/NotificationCard";
import { useNotifications } from "@/hooks/user/useNotifications";
import BadgesSection from "@/app/components/user/BadgeSection";

//Hero icons
import { CheckBadgeIcon, BellIcon } from "@heroicons/react/16/solid";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { hasProfile, loading } = useProfile();
  const { notifications, loading: notificationsLoading, markAsRead, markAllAsRead } = useNotifications(5);

  // Get display name
  const displayName = session?.user?.username || session?.user?.name;

  // Show skeleton while session or profile is loading
  if (status === "loading" || loading) {
    return <UserDashboardSkeleton />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <div className="alert alert-info mb-4 rounded-lg text-gray-700">
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
              Set up your cosplay profile to get the most out of COSBAII.
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
          <br /> You may experience bugs and glitches. Don't forget to submit a
          feedback!
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

          {/* ✅ Updated Recent Activity with Notifications */}
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
            
            <div className="p-6">
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
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={(id) => { markAsRead([id]); }}
                    />
                  ))}
                  
                  {notifications.length === 5 && (
                    <div className="text-center pt-4">
                      <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        View all notifications →
                      </button>
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
  );
};

export default DashboardPage;