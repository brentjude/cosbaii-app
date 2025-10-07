// Update: src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // ✅ Only redirect once when authenticated
    if (status === "authenticated" && session?.user && !isRedirecting) {
      setIsRedirecting(true);

      const user = session.user as {
        id: string;
        email: string;
        name?: string | null;
        role: string;
        username?: string | null;
      };

      console.log("User authenticated:", user.email, "Role:", user.role);

      const redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
      console.log("Redirecting to:", redirectPath);

      // ✅ Use replace instead of push to avoid back button issues
      router.replace(redirectPath);
    }
  }, [session, status, router, isRedirecting]);

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

  // ✅ Show redirecting message for authenticated users
  if (status === "authenticated" || isRedirecting) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-primary">Redirecting...</p>
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
