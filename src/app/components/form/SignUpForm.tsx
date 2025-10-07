"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

//Defining schema for input validation
// This schema includes fullname, email, username, and password fields
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
    .optional(),
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

// Type for form data based on the schema
type UserFormData = z.infer<typeof userSchema>;

export default function SignUpForm() {
  const router = useRouter();
  // Initialize form data state
  const [formData, setFormData] = useState<UserFormData>({
    fullname: "",
    email: "",
    username: "",
    password: "",
    emailUpdates: false,
    privacyConsent: false,
  });

  // Handle form submission
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  // This function will validate the form data and submit it to the server
  // It will also handle any errors that occur during submission
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for the current field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Google sign-up handler
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setSubmitError("");

      // ✅ Use 'signup' as the action to distinguish from login
      const result = await signIn("google", {
        callbackUrl: "/dashboard", // ✅ Redirect to profile setup for new users
        redirect: false, // ✅ Handle the response manually
      });

      if (result?.error) {
        console.error("Google sign-up error:", result.error);

        // ✅ Handle specific OAuth errors
        if (result.error === "OAuthAccountNotLinked") {
          setSubmitError(
            "An account with this email already exists. Please sign in with your email and password, or use the 'Sign In' page to link your Google account."
          );
        } else {
          setSubmitError("Google sign-up failed. Please try again.");
        }
      } else if (result?.ok) {
        // ✅ Success - redirect to profile setup for new users
        router.push("/profile-setup");
      }
    } catch (error) {
      console.error("Google sign-up error:", error);
      setSubmitError("Google sign-up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // This function will handle the form submission
  // It will validate the form data, send it to the server, and handle any errors that occur during submission
  // It will also set the loading state, submit error state, and success state
  // This function will be called when the form is submitted
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrors({}); // Clear any existing errors
    setSubmitError(""); // Clear previous submit error
    setSubmitSuccess(false); // Reset Success state

    try {
      setIsLoading(true); // Set loading state
      //validate form data using Zod scehma
      const result = userSchema.safeParse(formData);

      if (!result.success) {
        //if validation fails, set error state

        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });

        setErrors(newErrors);
        setIsLoading(false);
        return; // stop submission if validation fails
      }

      // If validation passes, send data to the server
      // Using fetch API to send a POST request to the server
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      // Check if the response is ok, if not throw an error
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
    } catch (error) {
      // ✅ Fixed: Use proper type instead of 'any'
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      {submitSuccess ? (
        <div className="flex flex-col gap-4 justify-between items-center text-center mt-4 p-4 bg-green-600  rounded-sm">
          <CheckCircleIcon className="h-8 w-8t text-white" />
          <p className="text-white">
            Sign-up is sucessful! Please wait for a confirmation email to
            activate your account.
          </p>
        </div>
      ) : (
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            id="fullname" // Changed id to match name for consistency
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

          <input
            type="text"
            name="username"
            placeholder="Username / Cosplay Handle"
            id="username"
            value={formData.username || ""} // Handle optional field
            onChange={handleInputChange}
            className="input w-full input-bordered mt-4 rounded-md"
          />

          {errors.username && (
            <p className="text-white text-xs mt-1">{errors.username}</p>
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
            className="btn btn-secondary text-white mt-6"
            disabled={isLoading} // Disable button while loading
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

      {/* Divider */}
      <div className="divider my-6 text-white">OR</div>

      {/* ✅ Google Sign-up Button with proper event handler */}
      <button
        onClick={handleGoogleSignUp}
        disabled={isLoading || submitSuccess}
        className="btn btn-outline border-white text-white hover:bg-white hover:text-black w-full"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Creating Account...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign Up with Google
          </>
        )}
      </button>
    </>
  );
}