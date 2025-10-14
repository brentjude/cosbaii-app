// Update: src/app/components/home/CosplayJourney.tsx
"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const CosplayJourney = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="w-full sm:w-[1440px] mx-auto flex flex-col-reverse sm:flex-row gap-8 sm:gap-16 py-20"
    >
      {/* Left Content - Text */}
      <motion.div
        className="flex flex-col justify-center w-full sm:w-[40%] px-4 sm:px-4"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="font-paytone color-cosbaii-primary text-[32px] sm:text-[64px]/16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Not Just a Profile. It&apos;s Your Cosplay Journey.
        </motion.h2>

        <motion.p
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          This isn&apos;t just another profile. It&apos;s your cosplay
          timeline, your highlights, and your story. Every photo, credential,
          and convention memory lives here, ready to be shared with the world.
          Whether you&apos;re just starting out or already a con regular,
          Cosbaii gives your journey the spotlight it deserves.
        </motion.p>
      </motion.div>

      {/* Right Content - Image */}
      <motion.div
        className="w-full sm:w-[60%]"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <Image
          src="/images/cosplay-journey.webp"
          alt="Cosplay Journey"
          quality={100}
          width={996}
          height={722}
          className="w-full h-auto mx-auto my-2 sm:my-4"
        />
      </motion.div>
    </section>
  );
};

export default CosplayJourney;