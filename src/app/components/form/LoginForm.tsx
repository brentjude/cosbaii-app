"use client";
import Link from "next/link";
import Image from "next/image";

const LoginForm = () => {
  return (
    <fieldset className="fieldset rounded-sm p-4">
      <form className="w-xs">
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

        <label className="label my-2">Email</label>
        <input type="email" className="input bg-base-200" placeholder="Email" />

        <label className="label my-2">Password</label>
        <input
          type="password"
          className="input bg-base-200"
          placeholder="Password"
        />


        <input
          type="button"
          className="btn btn-primary w-full mt-6 button-gradient text-white border-0"
          value="Login"
        />
        <p className="text-center mt-2">
          <Link
            href="/register"
            className="text-primary text-underline color-primary"
          >
            Forgot Password?
          </Link>
        </p>
      </form>
    </fieldset>
  );
};

export default LoginForm;
