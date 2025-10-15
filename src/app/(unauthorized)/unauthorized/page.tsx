"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get("reason") || "access-denied";
  
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ redirect: false });
    router.push("/");
  };

  const contentConfig: Record<string, {
    icon: string;
    title: string;
    description: string;
    subtext?: string;
    showContactSupport: boolean;
    alertType: "error" | "warning" | "info";
  }> = {
    "banned": {
      icon: "🚫",
      title: "You are banned from the platform.",
      description: "Your account has been permanently banned due to violations of our terms of service.",
      subtext: "If this is a mistake, contact support@cosbaii.com",
      showContactSupport: true,
      alertType: "error",
    },
    "suspended": {
      icon: "⚠️",
      title: "Account Temporarily Suspended",
      description: "Your account has been temporarily suspended. Please check your email for more information or contact support.",
      subtext: "Contact support@cosbaii.com for details about reactivating your account.",
      showContactSupport: true,
      alertType: "warning",
    },
    "pending-approval": {
      icon: "⏳",
      title: "Account Pending Approval",
      description: "Your email has been verified, but your account is waiting for administrator approval.",
      subtext: "You will receive an email once your account is activated. This usually takes 24-48 hours.",
      showContactSupport: false,
      alertType: "info",
    },
    "access-denied": {
      icon: "🔒",
      title: "Access Denied",
      description: "You don't have permission to access this resource.",
      subtext: "If you believe this is an error, please contact support.",
      showContactSupport: true,
      alertType: "error",
    },
  };

  const content = contentConfig[reason] || contentConfig["access-denied"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-error/10 via-base-200 to-warning/10 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl w-full max-w-lg">
        <div className="card-body items-center text-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/images/cosbaii-colored-wordmark.svg"
              alt="Cosbaii Logo"
              width={200}
              height={50}
              priority
            />
          </div>

          {/* Icon */}
          <div className="text-7xl mb-6 animate-bounce">{content.icon}</div>

          {/* Title */}
          <h1 className={`text-3xl font-bold mb-4 ${
            content.alertType === "error" ? "text-error" : 
            content.alertType === "warning" ? "text-warning" : 
            "text-info"
          }`}>
            {content.title}
          </h1>

          {/* Description */}
          <p className="text-base-content/80 mb-4 text-base leading-relaxed max-w-md">
            {content.description}
          </p>

          {/* Subtext */}
          {content.subtext && (
            <div className={`alert ${
              content.alertType === "error" ? "alert-error" : 
              content.alertType === "warning" ? "alert-warning" : 
              "alert-info"
            } mb-6`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="text-sm text-left">{content.subtext}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full mt-4">
            <button
              onClick={handleSignOut}
              className="btn btn-primary text-white w-full"
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing Out...
                </>
              ) : (
                "Sign Out"
              )}
            </button>

            <Link href="/" className="btn btn-ghost w-full">
              Back to Home
            </Link>
          </div>

          {/* Contact Support */}
          {content.showContactSupport && (
            <>
              <div className="divider text-xs">Need Help?</div>
              
              <a
                href="mailto:support@cosbaii.com"
                className="text-sm text-primary hover:text-primary-focus underline flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Contact Support
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}