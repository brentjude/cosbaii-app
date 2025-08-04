"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

//icons
import {
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import UserLogout from "../user/UserLogout";

interface AdminHeaderProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

const AdminHeader = ({ isMinimized, setIsMinimized }: AdminHeaderProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

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
        </div>

        <div className="navbar-center flex-1 max-w-lg mx-8">
          {/* Search Bar */}
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/60" />
            <input
              type="text"
              placeholder="Search users, competitions, photos..."
              className="input input-bordered w-full pl-10 bg-base-100"
            />
          </div>
        </div>

        <div className="navbar-end dropdown dropdown-bottom dropdown-end">
          {session?.user ? (
            <span className="mr-2 text-sm">{session.user.username}</span>
          ) : (
            "Guest"
          )}
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-md z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link
                href="#"
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
        <UserLogout />
      </div>
    </div>
  );
};

export default AdminHeader;
