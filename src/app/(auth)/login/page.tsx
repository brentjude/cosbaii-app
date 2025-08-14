// Update: src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // ✅ Only redirect if user is authenticated and we have session data
    if (status === "authenticated" && session?.user?.id) {
      console.log(
        "User authenticated:",
        session.user.email,
        "Role:",
        session.user.role
      );

      const redirectPath =
        session.user.role === "ADMIN" ? "/admin" : "/dashboard";
      console.log("Redirecting to:", redirectPath);

      // ✅ Use replace instead of push to avoid back button issues
      //router.replace(redirectPath);
      //window.location.href = redirectPath; // Using window.location.href for immediate redirect
      router.push(redirectPath); // Use router.push for Next.js navigation
    }
  }, [session?.user?.id, session?.user?.role, status, router]); // ✅ More specific dependencies

  // ✅ Show loading only during initial session check
  if (status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-primary">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Don't show loading for authenticated users - let the redirect happen
  if (status === "authenticated") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-primary">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show login form for unauthenticated users
  return (
    <div className="w-full h-screen flex">
      <div className="basis-[50vw] max-md:basis-[100vw] flex items-center justify-center">
        <LoginForm />
      </div>
      <div className="basis-[50vw] h-full items-center justify-center bg-primary flex max-md:hidden">
        <Image
          src={"/images/loginimage.webp"}
          alt="image in login"
          width={509}
          height={582}
        />
      </div>
    </div>
  );
};

export default LoginPage;
