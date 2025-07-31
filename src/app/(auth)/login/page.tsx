"use client";

import Image from "next/image";
import LoginForm from "@/app/components/form/LoginForm";

const page = () => {
  return (
    <div className="w-full h-screen flex">
      <div className="basis-[50vw] h-full flex items-center justify-center bg-primary">
        <Image
          src={"/images/loginimage.webp"}
          alt="image in login"
          width={509}
          height={582}
        />
      </div>
      <div className="basis-[50vw] flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default page;
