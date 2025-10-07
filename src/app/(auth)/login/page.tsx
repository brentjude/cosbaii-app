// Update: src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function LoginContent() {
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log("=== Login Page Status ===");
    console.log("Session status:", status);
    console.log("Has session:", !!session);
    console.log("User role:", session?.user?.role);
    console.log("Is redirecting:", isRedirecting);

    if (status === "authenticated" && session?.user && !isRedirecting) {
      setIsRedirecting(true);

      const user = session.user as {
        id: string;
        email: string;
        name?: string | null;
        role: string;
        username?: string | null;
      };

      // ✅ Simple role-based redirect
      const redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";

      console.log("User authenticated, role:", user.role);
      console.log("Redirecting to:", redirectPath);

      // ✅ Use window.location.href for hard redirect
      setTimeout(() => {
        console.log("Executing redirect now...");
        window.location.href = redirectPath;
      }, 500);
    }
  }, [session, status, isRedirecting]);

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
}

const LoginPage = () => {
  return <LoginContent />;
};

export default LoginPage;
