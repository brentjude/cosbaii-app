"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { z } from "zod";
import Link from "next/link";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Defining schema for input validation
const userSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  emailUpdates: z.boolean().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    fullname: "",
    email: "",
    username: "",
    password: "",
    emailUpdates: false,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle modal open/close
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    } else if (!isOpen && modalRef.current) {
      modalRef.current.close();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fullname: "",
        email: "",
        username: "",
        password: "",
        emailUpdates: false,
        termsAccepted: false,
      });
      setErrors({});
      setSubmitError("");
      setSubmitSuccess(false);
      setUsernameAvailable(null);
    }
  }, [isOpen]);

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await fetch("/api/user/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.toLowerCase() }),
      });

      const data = await response.json();
      setUsernameAvailable(data.available);

      if (!data.available) {
        setErrors((prev) => ({
          ...prev,
          username: data.message || "Username is already taken",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  const debouncedCheckUsername = useCallback(
    (username: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        void checkUsernameAvailability(username);
      }, 500);
    },
    [checkUsernameAvailability]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let processedValue = type === "checkbox" ? checked : value;

    if (name === "username" && typeof processedValue === "string") {
      processedValue = processedValue.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === "username" && typeof processedValue === "string") {
      setUsernameAvailable(null);
      debouncedCheckUsername(processedValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSubmitError("");
    setSubmitSuccess(false);

    if (usernameAvailable === false) {
      setSubmitError("Please choose a different username");
      return;
    }

    try {
      setIsLoading(true);

      const result = userSchema.safeParse(formData);

      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });

        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "submission failed");
      }

      setSubmitSuccess(true);
      setFormData({
        fullname: "",
        email: "",
        username: "",
        password: "",
        emailUpdates: false,
        termsAccepted: false,
      });
      setUsernameAvailable(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog ref={modalRef} className="modal modal-middle sm:modal-middle">
      <div className="modal-box bg-white w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
              Create an Account
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
              Join Cosbaii and get early access to your cosplay identity
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        {submitSuccess ? (
          <div className="flex flex-col gap-3 sm:gap-4 justify-between items-center text-center p-4 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="bg-green-100 rounded-full p-2 sm:p-3">
              <CheckCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">
                Welcome to Cosbaii!
              </h3>
              <p className="text-xs sm:text-sm text-green-700 break-words">
                We&apos;ve sent a verification email to your inbox. Please
                check your email to activate your account and get started.
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-primary text-white w-full mt-2"
            >
              Got it!
            </button>
          </div>
        ) : (
          <form className="w-full space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-700 text-sm sm:text-base">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="John Doe"
                id="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="input input-sm sm:input-md w-full input-bordered focus:input-primary"
              />
              {errors.fullname && (
                <label className="label py-1">
                  <span className="label-text-alt text-error text-xs break-words">
                    {errors.fullname}
                  </span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-700 text-sm sm:text-base">
                  Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-sm sm:input-md w-full input-bordered focus:input-primary"
              />
              {errors.email && (
                <label className="label py-1">
                  <span className="label-text-alt text-error text-xs break-words">
                    {errors.email}
                  </span>
                </label>
              )}
            </div>

            {/* Username */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-700 text-sm sm:text-base">
                  Username / Cosplay Handle
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="cosplayer123"
                  id="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  className={`input input-sm sm:input-md w-full input-bordered focus:input-primary pr-10 ${
                    usernameAvailable === true
                      ? "border-green-500 focus:border-green-500"
                      : usernameAvailable === false
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
                <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                  {isCheckingUsername && (
                    <span className="loading loading-spinner loading-xs sm:loading-sm text-primary"></span>
                  )}
                  {!isCheckingUsername && usernameAvailable === true && (
                    <span className="text-green-500 text-base sm:text-lg">✓</span>
                  )}
                  {!isCheckingUsername && usernameAvailable === false && (
                    <span className="text-red-500 text-base sm:text-lg">✗</span>
                  )}
                </div>
              </div>
              {errors.username && (
                <label className="label py-1">
                  <span className="label-text-alt text-error text-xs break-words">
                    {errors.username}
                  </span>
                </label>
              )}
              {!errors.username && usernameAvailable === true && (
                <label className="label py-1">
                  <span className="label-text-alt text-green-600 text-xs">
                    ✓ Username is available
                  </span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-700 text-sm sm:text-base">
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-sm sm:input-md w-full input-bordered focus:input-primary"
              />
              {errors.password && (
                <label className="label py-1">
                  <span className="label-text-alt text-error text-xs break-words">
                    {errors.password}
                  </span>
                </label>
              )}
              <label className="label py-1">
                <span className="label-text-alt text-wrap text-gray-500 text-xs break-words">
                  Must be at least 8 characters with uppercase, lowercase, and
                  numbers
                </span>
              </label>
            </div>

            {/* Divider */}
            <div className="divider my-1 sm:my-2"></div>

            {/* Email Updates Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2 sm:gap-3 py-1 sm:py-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-xs sm:checkbox-sm"
                  name="emailUpdates"
                  id="emailUpdates"
                  checked={formData.emailUpdates}
                  onChange={handleInputChange}
                />
                <span className="label-text text-gray-700 text-xs sm:text-sm break-words">
                  Send me updates about Cosbaii features and events
                </span>
              </label>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start items-start gap-2 sm:gap-3 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-xs sm:checkbox-sm mt-0.5"
                  name="termsAccepted"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                />
                <span className="label-text text-gray-700 text-xs sm:text-sm break-words flex-1">
                  I agree to the{" "}
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    className="text-primary hover:text-primary-focus font-medium underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/legal/privacy"
                    target="_blank"
                    className="text-primary hover:text-primary-focus font-medium underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <label className="label pt-0 py-1">
                  <span className="label-text-alt text-error text-xs break-words">
                    {errors.termsAccepted}
                  </span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-sm sm:btn-md btn-primary text-white w-full mt-4 sm:mt-6"
              disabled={
                isLoading ||
                isCheckingUsername ||
                usernameAvailable === false
              }
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                  <span className="text-xs sm:text-sm">Creating Account...</span>
                </>
              ) : (
                <span className="text-xs sm:text-sm">Create Account</span>
              )}
            </button>

            {/* Error Alert */}
            {submitError && (
              <div role="alert" className="alert alert-error py-2 sm:py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm break-words">{submitError}</span>
              </div>
            )}

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 break-words">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-focus font-medium"
                onClick={onClose}
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}