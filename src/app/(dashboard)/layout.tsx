"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import AdminHeader from "@/app/components/admin/AdminHeader";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-base-100">
        {/* Sidebar */}
        <AdminSidebar
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
        />

        {/* Main Content Area */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${isMinimized ? "ml-20" : "ml-64"}
          `}
        >
          {/* Header */}
          <AdminHeader
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
          />

          {/* Dynamic Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
