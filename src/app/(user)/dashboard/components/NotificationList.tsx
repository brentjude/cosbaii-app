"use client";

import { BellIcon } from "@heroicons/react/16/solid";
import NotificationCard from "@/app/components/user/NotificationCard";
import { Notification } from "@/types/notification";

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  unreadCount: number;
  hasProfile: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onLoadMore: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  loadingMore,
  hasMore,
  unreadCount,
  hasProfile,
  onMarkAsRead,
  onMarkAllAsRead,
  onLoadMore,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
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
              onClick={onMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-h-[600px] overflow-y-auto">
          {loading ? (
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
                  onMarkAsRead={onMarkAsRead}
                  compact={false}
                />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4 mt-4 border-t border-gray-100">
                  <button
                    onClick={onLoadMore}
                    disabled={loadingMore}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors py-2 px-4 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loadingMore ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        Loading more...
                      </span>
                    ) : (
                      "See previous notifications"
                    )}
                  </button>
                </div>
              )}

              {/* End of notifications */}
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
  );
};

export default NotificationList;