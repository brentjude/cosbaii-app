// Update: src/app/components/form/SignUpForm.tsx
"use client";

import { useState, useCallback } from "react";
import { z } from "zod";
import { CheckCircleIcon } from "@heroicons/react/16/solid";

// ✅ Fix: Add proper types instead of 'any'
function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

//Defining schema for input validation
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
    .transform((val) => val.toLowerCase()), // ✅ Auto-convert to lowercase
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  emailUpdates: z.boolean().optional(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

type UserFormData = z.infer<typeof userSchema>;

export default function SignUpForm() {
  const [formData, setFormData] = useState<UserFormData>({
    fullname: "",
    email: "",
    username: "",
    password: "",
    emailUpdates: false,
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // ✅ Add username checking state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // ✅ Fix: Use inline function for useCallback and add dependencies
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

  // ✅ Create a debounced version using useMemo or separate handler
  const debouncedCheckUsername = useCallback(
    debounce((username: string) => {
      void checkUsernameAvailability(username);
    }, 500),
    [checkUsernameAvailability]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = type === "checkbox" ? checked : value;
    
    // ✅ Convert username to lowercase as user types
    if (name === "username" && typeof processedValue === "string") {
      processedValue = processedValue.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error for the current field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // ✅ Check username availability as user types
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

    // ✅ Check if username is available before submitting
    if (usernameAvailable === false) {
      setSubmitError("Please choose a different username");
      return;
    }

    try {
      setIsLoading(true);
      
      // Validate form data using Zod schema
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

      // Send data to the server (username will be lowercase from schema transform)
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
        privacyConsent: false,
      });
      setUsernameAvailable(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {submitSuccess ? (
        <div className="flex flex-col gap-4 justify-between items-center text-center mt-4 p-4 bg-green-600 rounded-sm">
          <CheckCircleIcon className="h-8 w-8 text-white" />
          <p className="text-white">
            Sign-up is successful! Please wait for a confirmation email to
            activate your account.
          </p>
        </div>
      ) : (
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            id="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            className="input w-full input-bordered rounded-md"
          />
          {errors.fullname && (
            <p className="text-white text-xs mt-1">{errors.fullname}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input w-full input-bordered mt-4 rounded-md"
          />
          {errors.email && (
            <p className="text-white text-xs mt-1">{errors.email}</p>
          )}

          {/* ✅ Enhanced Username Input with Validation Feedback */}
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username / Cosplay Handle"
              id="username"
              value={formData.username || ""}
              onChange={handleInputChange}
              className={`input w-full input-bordered mt-4 rounded-md ${
                usernameAvailable === true
                  ? "border-green-500"
                  : usernameAvailable === false
                  ? "border-red-500"
                  : ""
              }`}
            />
            {isCheckingUsername && (
              <span className="absolute right-3 top-7 loading loading-spinner loading-sm"></span>
            )}
            {!isCheckingUsername && usernameAvailable === true && (
              <span className="absolute right-3 top-7 text-green-500">✓</span>
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <span className="absolute right-3 top-7 text-red-500">✗</span>
            )}
          </div>
          {errors.username && (
            <p className="text-white text-xs mt-1">{errors.username}</p>
          )}
          {!errors.username && usernameAvailable === true && (
            <p className="text-green-400 text-xs mt-1">✓ Username is available</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input w-full input-bordered mt-4 rounded-md"
          />
          {errors.password && (
            <p className="text-white text-xs mt-1">{errors.password}</p>
          )}

          <label className="label mt-4 text-white text-sm">
            <input
              type="checkbox"
              className="checkbox bg-white"
              name="emailUpdates"
              id="emailUpdates"
              checked={formData.emailUpdates}
              onChange={handleInputChange}
            />
            I agree to receive email updates from Cosbaii.
          </label>

          <label className="label mt-4 text-wrap text-white text-sm">
            <input
              type="checkbox"
              className="checkbox bg-white"
              name="privacyConsent"
              id="privacyConsent"
              checked={formData.privacyConsent}
              onChange={handleInputChange}
            />
            I understand that by submitting this form, my information will be
            used to contact me about Cosbaii&apos;s launch and early access perks. We
            respect your privacy and will never share your data.
          </label>
          {errors.privacyConsent && (
            <p className="text-white text-xs mt-1">{errors.privacyConsent}</p>
          )}

          <button
            type="submit"
            className="btn btn-secondary text-white mt-6 w-full"
            disabled={isLoading || isCheckingUsername || usernameAvailable === false}
          >
            {isLoading ? "Submitting..." : "GET EARLY ACCESS"}
          </button>

          {submitError && (
            <div role="alert" className="alert alert-error rounded-sm mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
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
              <span>{submitError}</span>
            </div>
          )}
        </form>
      )}
    </>
  );
}