"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Defining schema for input validation
const FormSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const LoginForm = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with validation schema
  // useForm is a hook from react-hook-form that helps manage form state and validation
  // zodResolver is used to integrate Zod schema validation with react-hook-form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // onSubmit function is called when the form is submitted
  // It receives the form values as an argument
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    try {
      setIsLoading(true);
      setError("");

      //credentials provider is used to authenticate the user
    // It sends the email and password to the server for authentication
    // signIn function is used to initiate the sign-in process
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false // Important: Don't auto-redirect
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        // Handle authentication errors
        setError("Invalid email or password");
      } else if (result?.ok) {
        // Success - redirect to dashboard or home
        // router.push("/dashboard"); // Change to your desired redirect path
        // Or you can use router.refresh() to refresh the current page
        // Get session to determine redirect path
        const session = await getSession();
        let redirectPath: string;
        
        if (session?.user?.role === 'ADMIN') {
          redirectPath = '/admin';  // or '/dashboard/admin'
        } else {
          redirectPath = '/dashboard';  // or '/user/dashboard'
        }
        
        console.log("Redirecting to:", redirectPath);
        router.replace(redirectPath);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

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
            className={`input bg-base-200 w-full mt-2 ${form.formState.errors.email ? 'input-error' : ''}`}
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
            className={`input bg-base-200 w-full mt-2 ${form.formState.errors.password ? 'input-error' : ''}`}
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
            'Login'
          )}
        </button>
        
        <p className="text-center mt-2">
          <Link
            href="/forgot-password"
            className="text-primary underline"
          >
            Forgot Password?
          </Link>
        </p>
      </form>
    </fieldset>
  );
};

export default LoginForm;
