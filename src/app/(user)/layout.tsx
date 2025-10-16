import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UserHeader from "@/app/components/user/UserHeader";
import MobileBottomNav from "@/app/components/user/MobileBottomNav";
import { ProfileProvider } from "@/app/context/ProfileContext";

export const metadata: Metadata = {
  title: "Dashboard - Cosbaii",
  description: "User dashboard for Cosbaii platform",
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen flex flex-col">
        <UserHeader />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <MobileBottomNav />
      </div>
    </ProfileProvider>
  );
}