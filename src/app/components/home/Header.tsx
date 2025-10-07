"use client";

import Link from "next/link";
import Image from "next/image";
import { UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[98%] mx-auto px-4 sm:px-6">
        {/* Desktop & Mobile Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                src="/images/cosbaii-colored-wordmark.svg"
                alt="Cosbaii Logo"
                width={140}
                height={35}
                className="w-auto h-8 sm:h-10"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#about" className="text-base hover:text-primary transition-colors">
              About Cosbaii
            </a>
            <a href="#feature" className="text-base hover:text-primary transition-colors">
              Features
            </a>
            <a href="/pricing" className="text-base hover:text-primary transition-colors">
              Roadmap
            </a>
            <a href="/contact" className="text-base hover:text-primary transition-colors">
              Early Access
            </a>
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden lg:flex">
            <Link href="/login" className="btn btn-primary btn-md text-white gap-2">
              <UserIcon className="w-5 h-5" />
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="btn btn-ghost btn-square"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-base-200">
            <nav className="py-4 space-y-2">
              <a
                href="#about"
                className="block px-4 py-3 text-base hover:bg-base-200 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                About Cosbaii
              </a>
              <a
                href="#feature"
                className="block px-4 py-3 text-base hover:bg-base-200 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Features
              </a>
              <a
                href="/pricing"
                className="block px-4 py-3 text-base hover:bg-base-200 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Roadmap
              </a>
              <a
                href="/contact"
                className="block px-4 py-3 text-base hover:bg-base-200 rounded-lg transition-colors"
                onClick={closeMobileMenu}
              >
                Early Access
              </a>
              
              {/* Mobile Login Button */}
              <div className="px-4 pt-4">
                <Link
                  href="/login"
                  className="btn btn-primary btn-block text-white gap-2"
                  onClick={closeMobileMenu}
                >
                  <UserIcon className="w-5 h-5" />
                  Login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;