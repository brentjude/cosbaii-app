"use client";

import { SessionProvider } from "next-auth/react";
import { ProfileProvider } from "@/app/context/ProfileContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </SessionProvider>
  );
}
