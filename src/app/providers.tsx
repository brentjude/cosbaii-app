// Update: src/app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ProfileProvider } from "./context/ProfileContext";
import { ToastProvider } from "./context/ToastContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // ✅ Refetch session every 5 minutes
      refetchOnWindowFocus={true} // ✅ Refetch when window regains focus
    >
      <ProfileProvider>
        <ToastProvider>
        {children}
        </ToastProvider>
      </ProfileProvider>
    </SessionProvider>
  );
}
