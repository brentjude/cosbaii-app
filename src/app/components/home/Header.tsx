"use client";

import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/16/solid";

const Header = () => {
  return (
    <header className="max-w-8/10 mx-auto flex items-center justify-between p-3 bg-white">
      <div>
        <Link href="/">
          <Image
            src={"/cosbaii-main-logo.webp"}
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
          <a href="/features" className="mx-2 hover:text-primary">
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
        <Link href="/login" className="btn btn-primary btn-md w-24 text-white">
          <UserIcon />Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
