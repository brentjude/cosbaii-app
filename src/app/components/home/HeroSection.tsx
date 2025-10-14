// Update: src/app/components/home/HeroSection.tsx
"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="w-full mx-auto flex flex-col-reverse sm:flex-row items-center justify-between py-10 sm:py-20 gap-5 sm:gap-10">
      {/* Left Content - Animate from left */}
      <motion.div
        className="w-full lg:w-[50%] sm:w-[40%] sm:pl-[10%] justify-content-center p-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h5
          className="text-xl color-cosbaii-primary font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          FOR COSPLAYERS IDENTITY
        </motion.h5>

        <motion.h1
          className="font-paytone text-[48px] lg:text-[80px] sm:text-[48px] leading-tight text-cosbaii-gray"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Your cosplay career spotlight
        </motion.h1>

        <motion.p
          className="text-lg pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Build your cosplay profile and showcase your work with verified
          credentials.
        </motion.p>

        <motion.a
          href="#earlyaccess"
          className="w-full sm:w-auto btn btn-primary btn-lg button-gradient text-white mt-8 sm:mt-16 border-none px-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          GET EARLY ACCESS
        </motion.a>
      </motion.div>

      {/* Right Image - Animate from right */}
      <motion.div
        className="w-full lg:w-full sm:w-[50%]"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src="/images/hero-image.webp"
          alt="Hero Image"
          quality={100}
          width={984}
          height={549}
          className="w-full h-auto"
          priority
        />
      </motion.div>
    </section>
  );
}