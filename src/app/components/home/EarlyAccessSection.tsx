"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import SignUpModal from "../form/SignUpModal";

export default function EarlyAccessSection() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1], // ✅ Use bezier curve array instead of string
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // ✅ Use bezier curve array instead of string
      },
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1], // ✅ Use bezier curve array instead of string
      },
    },
  };

  return (
    <>
      <section
        id="earlyAccess"
        className="max-w-[1440px] py-12 sm:py-20 mx-auto px-4 sm:px-6"
      >
        <motion.div
          className="w-full bg-pale px-6 sm:px-12 py-10 sm:py-16 rounded-xl flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2
            className="font-paytone text-[28px] sm:text-[48px] lg:text-[56px] text-primary leading-tight"
            variants={itemVariants}
          >
            Get Early Access and unlock exclusive perks when you are an original
            member of Cosbaii
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg lg:text-xl mt-6 max-w-3xl text-gray-700"
            variants={itemVariants}
          >
            Sign up now and be part of our early supporters who shape the future
            of Cosbaii.
          </motion.p>

          <motion.ul
            className="list-none mt-8 sm:mt-10 space-y-4 text-left max-w-2xl"
            variants={itemVariants}
          >
            <motion.li
              className="flex items-start gap-3 text-base sm:text-lg"
              variants={listItemVariants}
            >
              <span className="text-2xl flex-shrink-0">✅</span>
              <div>
                <strong>Exclusive Beta Access</strong> – try Cosbaii before
                anyone else
              </div>
            </motion.li>
            <motion.li
              className="flex items-start gap-3 text-base sm:text-lg"
              variants={listItemVariants}
            >
              <span className="text-2xl flex-shrink-0">✅</span>
              <div>
                <strong>Reserve Your Unique Cosbaii ID</strong> – lock in your
                name early
              </div>
            </motion.li>
            <motion.li
              className="flex items-start gap-3 text-base sm:text-lg"
              variants={listItemVariants}
            >
              <span className="text-2xl flex-shrink-0">✅</span>
              <div>
                <strong>Early Supporter Badge</strong> – wear your badge with
                pride on your profile
              </div>
            </motion.li>
          </motion.ul>

          <motion.button
            onClick={() => setIsSignUpOpen(true)}
            className="btn btn-primary btn-lg button-gradient text-white mt-10 sm:mt-12 border-none px-8 sm:px-16 text-base sm:text-lg w-full sm:w-auto"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GET EARLY ACCESS
          </motion.button>
        </motion.div>
      </section>

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
      />
    </>
  );
}