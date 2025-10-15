// Update: src/app/components/form/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";

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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Attempting login...");

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else if (result?.ok) {
        console.log("Sign in successful");

        // ✅ Simple redirect - let the session determine the route
        // Admin users will be redirected to /admin
        // Regular users will be redirected to /dashboard
        setTimeout(() => {
          window.location.href = "/dashboard"; // Default redirect
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
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
            placeholder="Email"
            className="input input-bordered"
            disabled={isLoading}
            {...form.register("email")}
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
            placeholder="Password"
            className="input input-bordered"
            disabled={isLoading}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors.password.message}
              </span>
            </label>
          )}
        </div>

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

    </fieldset>
  );
};

export default LoginForm;
