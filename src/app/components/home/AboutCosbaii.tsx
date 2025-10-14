// Update: src/app/components/home/AboutCosbaii.tsx
"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const AboutCosbaii = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Animation variants for staggered cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={ref} className="w-full bg-primary">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row py-10 sm:py-20 gap-6 sm:gap-24">
        {/* Left side - Feature cards */}
        <div className="flex flex-col sm:flex-row w-full sm:w-[50%] gap-8 sm:gap-8 px-4 sm:px-0">
          {/* Left column */}
          <div className="flex flex-col w-[100%] sm:w-[50%] gap-8 sm:mt-[-120px]">
            <motion.div
              className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h3 className="font-bold text-cosbaii-grey px-4 sm:px-8 pt-4 sm:pt-8">
                Verified Cosplay Identity
              </h3>
              <Image
                src="/images/verify-identity.webp"
                alt="Verified Cosplay Identity"
                quality={100}
                width={196}
                height={172}
                className="mx-auto my-4"
              />
              <p className="text-cosbaii-grey px-4 sm:px-8 pb-4 sm:pb-8">
                Each cosplayer goes through a thorough verification process to
                ensure authenticity of the account. This builds trust across
                events, competitions, and the wider cosplay community.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h3 className="font-bold text-cosbaii-grey px-8 pt-8">
                Showcase Your Portfolio
              </h3>
              <Image
                src="/images/showcase-portfolio.webp"
                alt="Showcase Your Portfolio"
                quality={100}
                width={298}
                height={189}
                className="mx-auto my-4"
              />
              <p className="text-cosbaii-grey px-8 pb-8">
                Easily create and update a personal cosplay profile that
                highlights your best works. Share your photos, builds, and
                collaborations in one beautifully organized space.
              </p>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="flex flex-col w-[100%] sm:w-[50%] gap-8 mb-0 sm:mb-[-120px]">
            <motion.div
              className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h3 className="font-bold text-cosbaii-grey px-8 pt-8">
                Digital Profiles
              </h3>
              <Image
                src="/images/digital-profiles.webp"
                alt="Digital Profiles"
                quality={100}
                width={352}
                height={241}
                className="mx-auto"
              />
              <p className="text-cosbaii-grey px-8 pb-8">
                Cosbaii gives every cosplayer a unique digital ID and profile.
                It&apos;s your official identity that stays with you wherever
                you go.
              </p>
            </motion.div>

            <motion.div
              className="bg-[#FFF2E8] rounded-2xl w-full h-auto shadow-lg"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h3 className="font-bold text-cosbaii-grey px-8 pt-8">
                Organized Credentials
              </h3>
              <Image
                src="/images/organized-credentials.webp"
                alt="Organized Credentials"
                quality={100}
                width={298}
                height={189}
                className="mx-auto my-4"
              />
              <p className="text-cosbaii-grey px-8 pb-8">
                Keep track of your event participation, awards, and recognitions
                in a clean, verified format. Your cosplay journey is now
                structured, searchable, and easy to present.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right side - Text content */}
        <motion.div
          className="flex flex-col justify-center gap-4 sm:gap-10 w-full sm:w-[50%] p-8 sm:px-16"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="font-paytone text-[32px] sm:text-[64px] text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What is Cosbaii
          </motion.h2>

          <motion.p
            className="text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <strong>Cosbaii is a platform built for cosplayers</strong> —
            whether you compete on stage or just love bringing characters to
            life. It gives you a digital identity that works across conventions
            and events, so you don&apos;t have to keep rebuilding your
            reputation from scratch. With a unique Cosbaii ID and a clean
            profile, you can showcase your best cosplays, highlight competition
            achievements, and easily get recognized by organizers, fans, and
            fellow cosplayers. Whether you&apos;re attending your first con or
            already making waves in competitions, Cosbaii helps you share your
            craft in one place.
          </motion.p>

          <motion.p
            className="text-white mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Right now, we&apos;re focused on supporting cosplayers and making
            their convention experience smoother, more organized, and more
            rewarding. But this is just the beginning. Soon, we&apos;ll open up
            the platform to include photographers and crafters too — creating a
            space where the whole cosplay community can connect, collaborate,
            and grow together. Cosbaii isn&apos;t just another portfolio site —
            it&apos;s a home base for your cosplay journey.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCosbaii;