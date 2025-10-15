// Update: src/app/(public)/(legal)/layout.tsx
import { ReactNode } from "react";
import Header from "@/app/components/home/Header";

interface LegalLayoutProps {
  children: ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {children}
      </main>
    </>
  );
}