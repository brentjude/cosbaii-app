// src/app/components/admin/AdminHeader.tsx
"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react"; // ✅ Added useCallback
// ✅ Removed unused imports: usePathname, HomeIcon, MagnifyingGlassIcon

//icons
import {
  ArrowRightEndOnRectangleIcon,
  UserIcon,
  Bars3Icon,
  BellIcon,
  // ✅ Add notification type icons
  BugAntIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellSolidIcon } from "@heroicons/react/24/solid";
import UserLogout from "../user/UserLogout";

interface AdminHeaderProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: number;
}

const AdminHeader = ({ isMinimized, setIsMinimized }: AdminHeaderProps) => {
  const { data: session, status } = useSession();

  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Get notification icon and color
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "FEEDBACK":
        return { icon: BugAntIcon, color: "text-red-500 bg-red-50" };
      case "FEATURE_REQUEST":
        return { icon: LightBulbIcon, color: "text-blue-500 bg-blue-50" };
      case "IMPROVEMENT":
        return {
          icon: WrenchScrewdriverIcon,
          color: "text-green-500 bg-green-50",
        };
      case "USER_REGISTRATION":
        return { icon: UserPlusIcon, color: "text-purple-500 bg-purple-50" };
      default:
        return {
          icon: ExclamationTriangleIcon,
          color: "text-gray-500 bg-gray-50",
        };
    }
  };

  // ✅ Get feedback type text
  const getFeedbackTypeText = (type: string) => {
    switch (type) {
      case "BUG":
        return "bug report";
      case "FEATURE_REQUEST":
        return "feature request";
      case "IMPROVEMENT":
        return "improvement";
      default:
        return type.toLowerCase().replace("_", " ");
    }
  };

  // ✅ Extract username from message
  const extractUsernameFromMessage = (message: string) => {
    // Extract username from messages like "John Doe submitted: 'Bug in login'"
    const match = message.match(/^(.+?)\s+submitted:/);
    return match ? match[1] : "Someone";
  };

  // ✅ Fetch notifications - wrapped with useCallback
  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated" || session?.user?.role !== "ADMIN") return;

    try {
      setLoading(true);
      const response = await fetch("/api/admin/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [status, session?.user?.role]); // ✅ Added dependencies

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(
        `/api/admin/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/admin/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // ✅ Fetch notifications on mount and periodically - added fetchNotifications to deps
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]); // ✅ Added fetchNotifications as dependency

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="w-full shadow-xs">
      <div className="navbar max-w-full mx-auto px-6">
        <div className="navbar-start flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          {setIsMinimized && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="btn btn-ghost btn-sm"
              title="Toggle Sidebar"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          )}

          {/* Logo - only show when sidebar is minimized */}
          {isMinimized && (
            <Link href="/admin" className="btn btn-ghost text-xl">
              <Image
                src={"/images/cosbaii-colored-wordmark.svg"}
                alt="Cosbaii Logo"
                width={120}
                height={24}
              />
            </Link>
          )}

          <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Search" />
          </label>
        </div>

      
        <div className="navbar-end flex items-center gap-4">
          {/* ✅ Updated: Notification Bell with new styling */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle relative"
            >
              {unreadCount > 0 ? (
                <BellSolidIcon className="w-6 h-6 text-primary" />
              ) : (
                <BellIcon className="w-6 h-6" />
              )}
              {unreadCount > 0 && (
                <span className="badge badge-sm badge-error absolute -top-1 -right-1 min-w-[1.2rem] h-5">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            {/* ✅ Updated: New notification dropdown design */}
            <div
              tabIndex={0}
              className="dropdown-content bg-white rounded-md z-[1] mt-3 w-80 max-h-96 p-0 shadow-lg border border-gray-200"
            >
              {/* Notification Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center w-full">
                  <span className="text-base font-semibold text-gray-900">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      className="text-xs text-primary hover:bg-base-200 hover:cursor-pointer font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="px-4 py-8 text-center">
                    <span className="loading loading-spinner loading-sm"></span>
                    <p className="text-sm text-gray-500 mt-2">Loading...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.slice(0, 10).map((notification) => {
                      const { icon: IconComponent, color } =
                        getNotificationIcon(notification.type);
                      const username = extractUsernameFromMessage(
                        notification.message
                      );

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 flex flex-row justify-center cursor-pointer transition-all bg-white hover:bg-gray-50 ${
                            !notification.isRead ? "bg-blue-50/50" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!notification.isRead) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* ✅ Icon with colored background */}
                            <div
                              className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>

                            {/* ✅ Notification content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-900 font-medium">
                                  {username} submitted a{" "}
                                  {getFeedbackTypeText(notification.type)}{" "}
                                  feedback
                                </p>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                )}
                              </div>

                              {/* ✅ Time at bottom */}
                              <p className="text-xs text-gray-500 mt-1">
                                {formatRelativeTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* View All Link */}
              {notifications.length > 0 && (
                <div className="border-t border-gray-200 p-3">
                  <Link
                    href="/admin/notifications"
                    className="block text-center text-sm text-primary hover:bg-base-200 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* User Info & Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <div className="flex items-center gap-3">
              {session?.user ? (
                <span className="text-sm font-medium hidden sm:block">
                  {session.user.username || session.user.name}
                </span>
              ) : (
                <span className="text-sm text-base-content/70">Guest</span>
              )}

              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {/* ✅ Replaced <img> with <Image /> */}
                  <Image
                    src={
                      session?.user?.image ||
                      "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                    }
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-lg z-[1] mt-2 w-52 p-2 shadow-lg border border-base-300"
            >
              <li>
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2 w-full text-left"
                >
                  <UserIcon className="w-4 h-4" /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const modal = document.getElementById(
                      "logoutModal"
                    ) as HTMLDialogElement;
                    if (modal) {
                      modal.showModal();
                    }
                  }}
                  className="flex items-center gap-2 w-full text-left text-error hover:bg-error hover:text-error-content"
                >
                  <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        <UserLogout />
      </div>
    </div>
  );
};

export default AdminHeader;