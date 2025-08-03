"use client";

import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/16/solid";

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between p-3 bg-white">
      <div>
        <Link href="/">
          <Image
            src={"/images/cosbaii-colored-wordmark.svg"}
            alt="Logo"
            width={159}
            height={40}
          />
        </Link>
      </div>
      <div>
        <nav className="flex gap-5 justify-center items-center">
          <a href="#about" className="mx-2 hover:text-primary">
            About Cosbaii
          </a>
          <a href="#feature" className="mx-2 hover:text-primary">
            Features
          </a>
          <a href="/pricing" className="mx-2 hover:text-primary">
            Roadmap
          </a>
          <a href="/contact" className="mx-2 hover:text-primary">
            Early Access
          </a>
        </nav>
      </div>
      <div>
        <Link href="/login" className="btn btn-primary btn-md text-white">
          <UserIcon className="size-5 text-white " />
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
