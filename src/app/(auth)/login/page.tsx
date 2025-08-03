"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";

const page = () => {
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
};

export default page;
