// Update: src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// ✅ Create a separate component for the login logic
function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !isRedirecting) {
      setIsRedirecting(true);

      const user = session.user as {
        id: string;
        email: string;
        name?: string | null;
        role: string;
        username?: string | null;
      };

      // ✅ Get callbackUrl and extract only the pathname
      let redirectPath: string;
      const callbackUrl = searchParams?.get("callbackUrl");

      if (callbackUrl) {
        try {
          // ✅ If it starts with /, use it directly
          if (callbackUrl.startsWith("/")) {
            redirectPath = callbackUrl;
          } else {
            // ✅ Parse the URL to extract just the pathname
            const url = new URL(callbackUrl);
            redirectPath = url.pathname;
          }

          console.log(
            "Parsed callback URL:",
            callbackUrl,
            "to path:",
            redirectPath
          );
        } catch (error) {
          console.error("Failed to parse callback URL:", error);
          // ✅ Fallback to role-based redirect if URL parsing fails
          redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
        }
      } else {
        // ✅ Default redirect based on role
        redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
      }

      console.log("Redirecting authenticated user to:", redirectPath);

      // ✅ Small delay to ensure session is fully established
      setTimeout(() => {
        router.replace(redirectPath);
      }, 100);
    }
  }, [session, status, router, isRedirecting, searchParams]);

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

// ✅ Wrap the component with Suspense
const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-primary">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
