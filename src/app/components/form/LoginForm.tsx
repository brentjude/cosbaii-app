// Update: src/app/components/form/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

// Defining schema for input validation
const FormSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // onSubmit function for credentials login
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      setError("");

      // ✅ Don't pass callbackUrl - let NextAuth handle it
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // ✅ Keep this false
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else if (result?.ok) {
        // ✅ Let the login page handle the redirect
        console.log("Sign in successful");
        // Don't set isLoading to false - let the page redirect happen
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  // ✅ Fixed Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(""); // ✅ Use the correct state setter

      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again."); // ✅ Fixed variable name
      setIsLoading(false);
    }
  };

  return (
    <fieldset className="fieldset rounded-sm p-4">
      <form className="w-xs" onSubmit={form.handleSubmit(onSubmit)}>
        <Image
          src={"/images/cosbaii-colored-wordmark.svg"}
          alt="Logo"
          width={250}
          height={40}
          className="ml-[-10px] mb-6"
        />
        <h1 className="font-medium text-lg">Sign-In</h1>
        <p className="text-xsm mb-4 text-gray-500">
          Get early access&nbsp;
          <Link href="/#earlyaccess" className="text-primary color-primary">
            here
          </Link>
        </p>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            {...form.register("email")}
            className={`input bg-base-200 w-full mt-2 ${
              form.formState.errors.email ? "input-error" : ""
            }`}
            placeholder="Email"
          />
          {form.formState.errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors.email.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            {...form.register("password")}
            className={`input bg-base-200 w-full mt-2 ${
              form.formState.errors.password ? "input-error" : ""
            }`}
            placeholder="Password"
          />
          {form.formState.errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors.password.message}
              </span>
            </label>
          )}
        </div>

        {/* Display error message */}
        {error && (
          <div className="alert alert-error mt-4 rounded-md">
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || form.formState.isSubmitting}
          className="btn btn-primary w-full mt-6 button-gradient text-white border-0"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Signing In...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center mt-2">
          <Link href="/forgot-password" className="text-primary underline">
            Forgot Password?
          </Link>
        </p>
      </form>

      {/* ✅ Fixed divider - removed extra semicolon */}
      <div className="divider my-2 text-gray-500">OR</div>

      {/* ✅ Fixed Google Sign-in Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="btn btn-outline border-primary text-primary hover:bg-primary/30 w-full"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Connecting...
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
            Continue with Google
          </>
        )}
      </button>
    </fieldset>
  );
};

export default LoginForm;
