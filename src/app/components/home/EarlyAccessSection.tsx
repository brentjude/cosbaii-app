"use client";

import { useState } from "react";
import SignUpModal from "../form/SignUpModal";

export default function EarlyAccessSection() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      <section
        id="earlyAccess"
        className="max-w-[1440px] py-12 sm:py-20 mx-auto px-4 sm:px-6"
      >
        <div className="w-full bg-pale px-6 sm:px-12 py-10 sm:py-16 rounded-xl flex flex-col items-center text-center">
          <h2 className="font-paytone text-[28px] sm:text-[48px] lg:text-[56px] text-primary leading-tight">
            Get Early Access and unlock exclusive perks when you are an original
            member of Cosbaii
          </h2>

          <p className="text-base sm:text-lg lg:text-xl mt-6 max-w-3xl text-gray-700">
            Sign up now and be part of our early supporters who shape the future
            of Cosbaii.
          </p>

          <ul className="list-none mt-8 sm:mt-10 space-y-4 text-left max-w-2xl">
            <li className="flex items-start gap-3 text-base sm:text-lg">
              <span className="text-2xl flex-shrink-0">✅</span>
              <div>
                <strong>Exclusive Beta Access</strong> – try Cosbaii before
                anyone else
              </div>
            </li>
            <li className="flex items-start gap-3 text-base sm:text-lg">
              <span className="text-2xl flex-shrink-0">✅</span>
              <div>
                <strong>Reserve Your Unique Cosbaii ID</strong> – lock in your
                name early
              </div>
            </li>
            <li className="flex items-start gap-3 text-base sm:text-lg">
              <span className="text-2xl flex-shrink-0">✅</span>
              <div>
                <strong>Early Supporter Badge</strong> – wear your badge with
                pride on your profile
              </div>
            </li>
          </ul>

          <button
            onClick={() => setIsSignUpOpen(true)}
            className="btn btn-primary btn-lg button-gradient text-white mt-10 sm:mt-12 border-none px-8 sm:px-16 text-base sm:text-lg w-full sm:w-auto"
          >
            GET EARLY ACCESS
          </button>
        </div>
      </section>

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
}