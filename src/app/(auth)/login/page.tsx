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
          // ✅ Decode the URL first
          const decodedUrl = decodeURIComponent(callbackUrl);

          console.log("Original callback URL:", callbackUrl);
          console.log("Decoded callback URL:", decodedUrl);

          // ✅ Check if it's a relative path
          if (decodedUrl.startsWith("/")) {
            redirectPath = decodedUrl;
            console.log("Using relative path:", redirectPath);
          } else {
            // ✅ It's a full URL, extract the pathname
            try {
              const urlObj = new URL(decodedUrl);
              redirectPath = urlObj.pathname + (urlObj.search || "");
              console.log("Extracted pathname from full URL:", redirectPath);
            } catch (urlError) {
              console.error("Failed to parse as URL:", urlError);
              // Fallback to role-based redirect
              redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
              console.log("Using role-based fallback:", redirectPath);
            }
          }
        } catch (error) {
          console.error("Failed to process callback URL:", error);
          // ✅ Fallback to role-based redirect if URL parsing fails
          redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
          console.log("Using error fallback:", redirectPath);
        }
      } else {
        // ✅ Default redirect based on role
        redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
        console.log(
          "No callback URL, using role-based redirect:",
          redirectPath
        );
      }

      console.log("Final redirect path:", redirectPath);

      // ✅ Use router.replace for client-side navigation (no full page reload)
      router.replace(redirectPath);
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
