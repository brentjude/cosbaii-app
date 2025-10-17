"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/app/context/ProfileContext";
import { useDashboardNotifications } from "@/hooks/user/useDashboardNotifications";
import UserDashboardSkeleton from "@/app/components/skeletons/user/UserDashboardSkeleton";
import WelcomeHeader from "./components/WelcomeHeader";
import ProfileSetupAlert from "./components/ProfileSetupAlert";
import BetaBanner from "./components/BetaBanner";
import SidebarContent from "./components/SidebarContent";
import StatsGrid from "./components/StatsGrid";
import BadgesSection from "@/app/components/user/BadgeSection";
import NotificationList from "./components/NotificationList";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { hasProfile, loading } = useProfile();

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      window.location.href = "/admin";
    }
  }, [session, status]);

  // Use custom hook for notifications
  const {
    notifications,
    loading: notificationsLoading,
    loadingMore,
    hasMore,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useDashboardNotifications(session?.user?.id ?? undefined);

  // ✅ Get display name from profile, fallback to username or name
  const displayName = 
    session?.user?.displayName || 
    session?.user?.username || 
    session?.user?.name || 
    undefined;

  // TODO: Replace with real data from API
  const stats = {
    badgesCount: 24,
    likesCount: 156,
    followingCount: 12,
  };

  // Show skeleton while session or profile is loading
  if (status === "loading" || loading) {
    return <UserDashboardSkeleton />;
  }

  return (
    <div className="p-6 max-w-[1240px] mx-auto">
      <WelcomeHeader displayName={displayName} />

      {!hasProfile && <ProfileSetupAlert />}

      <BetaBanner />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SidebarContent />

        <div className="lg:col-span-3">
          <StatsGrid
            badgesCount={stats.badgesCount}
            likesCount={stats.likesCount}
            followingCount={stats.followingCount}
          />

          <div className="mb-6">
            <BadgesSection />
          </div>

          <NotificationList
            notifications={notifications}
            loading={notificationsLoading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            unreadCount={unreadCount}
            hasProfile={hasProfile}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;