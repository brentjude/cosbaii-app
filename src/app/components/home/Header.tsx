"use client";

import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div>
        <Link href="/">
          <Image
            src={"/cosbaii-main-logo.webp"}
            alt="Logo"
            width={209}
            height={47}
          />
        </Link>
      </div>
      <div>
        <nav></nav>
      </div>
      <div>
        <Link href="/login" className="btn btn-neutral bg-">
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
