"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole, UserStatus } from "@/types";


interface ExtendedUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  username?: string | null;
  status: UserStatus;
  emailVerified: boolean;
}

function LoginContent() {
  const router = useRouter();
  const { data: session, status, update } = useSession(); // ✅ Add update function
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log("=== Login Page Status ===");
    console.log("Session status:", status);
    console.log("Has session:", !!session);
    console.log("User data:", session?.user);

    if (status === "authenticated" && session?.user && !isRedirecting) {
      // ✅ Force session refresh to get latest data
      update().then(() => {
        setIsRedirecting(true);

        const user = session.user as ExtendedUser;

        console.log("User authenticated, checking status...");
        console.log("User role:", user.role);
        console.log("User status:", user.status);
        console.log("Email verified:", user.emailVerified);

        // ✅ Check if user is INACTIVE and not verified
        if (user.status === "INACTIVE" && !user.emailVerified) {
          console.log("User is inactive and not verified, redirecting to email verification");
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
          }, 500);
          return;
        }

        // ✅ Check if user is INACTIVE but verified (waiting for admin approval)
        if (user.status === "INACTIVE" && user.emailVerified) {
          console.log("User is verified but account is inactive (pending admin approval)");
          setTimeout(() => {
            router.push("/not-authorized?reason=pending-approval");
          }, 500);
          return;
        }

        // ✅ Check if user is BANNED or SUSPENDED
        if (user.status === "BANNED") {
          console.log("User account is banned or suspended");
          setTimeout(() => {
            router.push(`/not-authorized?reason=${user.status.toLowerCase()}`);
          }, 500);
          return;
        }

        // ✅ User is ACTIVE, redirect based on role
        if (user.status === "ACTIVE") {
          const redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
          console.log("User is active, role:", user.role);
          console.log("Redirecting to:", redirectPath);

          setTimeout(() => {
            console.log("Executing redirect now...");
            window.location.href = redirectPath;
          }, 500);
        }
      });
    }
  }, [session, status, isRedirecting, router, update]);

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