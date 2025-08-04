"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  TrophyIcon,
  PhotoIcon,
  DocumentTextIcon,
  BellIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Competitions", href: "/admin/competitions", icon: TrophyIcon },
  { name: "Photos", href: "/admin/photos", icon: PhotoIcon },
  { name: "Blogs", href: "/admin/blogs", icon: DocumentTextIcon },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: BellIcon,
    badge: 5,
  },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Moderation", href: "/admin/moderation", icon: ShieldCheckIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];

interface AdminSidebarProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

const AdminSidebar = ({ isMinimized, setIsMinimized }: AdminSidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={`
      bg-base-200 h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out
      ${isMinimized ? "w-20" : "w-64"}
    `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {!isMinimized && (
          <div className="flex items-center space-x-2">
            <Image
              src="/images/cosbaii-colored-wordmark.svg"
              alt="Cosbaii Logo"
              width={120}
              height={24}
            />
          </div>
        )}

        {isMinimized && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <span className="text-primary-content font-bold text-lg">C</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-primary text-primary-content"
                        : "text-base-content hover:bg-base-300"
                    }
                    ${isMinimized ? "justify-center" : ""}
                  `}
                  title={isMinimized ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />

                  {!isMinimized && (
                    <>
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="badge badge-error badge-sm text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {isMinimized && item.badge && (
                    <span className="absolute left-12 top-1 badge badge-error badge-xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div
          className={`
          bg-base-300 rounded-lg p-3 text-center
          ${isMinimized ? "px-2" : ""}
        `}
        >
          {!isMinimized ? (
            <div>
              <p className="text-sm font-medium text-base-content">
                Admin Panel
              </p>
              <p className="text-xs text-base-content/70">v1.0.0</p>
            </div>
          ) : (
            <div className="w-6 h-6 bg-accent rounded-full mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
