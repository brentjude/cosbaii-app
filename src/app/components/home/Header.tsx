"use client";

import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header>
      <div>
        <Link href="/">
          <Image src={"/logo.png"} alt="Logo" width={50} height={50} />
          <span>Cosbaii</span>
        </Link>
      </div>
      <div>
        <nav></nav>
      </div>
    </header>
  );
};

export default Header;
