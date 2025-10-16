"use client";

import { useState, useEffect, useCallback } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { FeaturedItem } from "@/types/profile";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface FeaturedCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  featuredItems: FeaturedItem[];
  initialIndex: number;
}

export default function FeaturedCarouselModal({
  isOpen,
  onClose,
  featuredItems,
  initialIndex,
}: FeaturedCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  // Filter out empty items
  const validItems = featuredItems.filter(
    (item) => item.imageUrl && item.imageUrl.trim() !== ""
  );

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Wrap handlers in useCallback to stabilize references
  const handleNext = useCallback(() => {
    if (currentIndex < validItems.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, validItems.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, onClose, handleNext, handlePrevious]);

  const currentItem = validItems[currentIndex];

  if (!isOpen || !currentItem) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 btn btn-circle btn-ghost text-white hover:bg-white/10"
        aria-label="Close"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-50 text-white text-sm font-medium">
        {currentIndex + 1} / {validItems.length}
      </div>

      {/* Previous Button */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-50 btn btn-circle btn-lg bg-white/10 hover:bg-white/20 border-none text-white"
          aria-label="Previous"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
      )}

      {/* Next Button */}
      {currentIndex < validItems.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-50 btn btn-circle btn-lg bg-white/10 hover:bg-white/20 border-none text-white"
          aria-label="Next"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      )}

      {/* Carousel Content */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleNext();
              } else if (swipe > swipeConfidenceThreshold) {
                handlePrevious();
              }
            }}
            className="absolute w-full h-full flex flex-col items-center justify-center p-8"
          >
            {/* Image Container */}
            <div className="relative max-w-5xl max-h-[70vh] w-full h-[70vh]">
              <Image
                src={currentItem.imageUrl || ""}
                alt={currentItem.title || currentItem.character || "Featured"}
                fill
                className="object-contain rounded-lg shadow-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1280px"
                priority
                quality={90}
              />
            </div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {currentItem.type === "competition" && currentItem.competition ? (
                    <>
                      <h2 className="text-xl font-bold mb-2">
                        {currentItem.competition.name}
                      </h2>
                      <p className="text-sm text-gray-500 mb-3">
                        {new Date(currentItem.competition.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </>
                  ) : currentItem.title ? (
                    <h2 className="text-xl font-bold mb-3">{currentItem.title}</h2>
                  ) : null}

                  {currentItem.character && (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        {currentItem.type === "competition"
                          ? "Competition Character"
                          : "Cosplay Character"}
                      </p>
                      <p className="text-base font-semibold">
                        {currentItem.character}
                        {currentItem.series && (
                          <span className="text-gray-600 font-normal">
                            {" "}
                            from {currentItem.series}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {currentItem.description && (
                    <p className="mt-3 text-sm text-gray-700">
                      {currentItem.description}
                    </p>
                  )}
                </div>

                {/* Award Badge */}
                {currentItem.type === "competition" && (
                  <div className="flex flex-col items-center gap-2">
                    {currentItem.position === "CHAMPION" ||
                    currentItem.position === "FIRST_PLACE" ? (
                      <>
                        <TrophyIcon className="w-12 h-12 text-yellow-500" />
                        <span className="text-sm text-yellow-600 font-bold">
                          Champion
                        </span>
                      </>
                    ) : currentItem.position === "SECOND_PLACE" ? (
                      <>
                        <TrophyIcon className="w-12 h-12 text-gray-400" />
                        <span className="text-sm text-gray-600 font-bold">
                          2nd Place
                        </span>
                      </>
                    ) : currentItem.position === "THIRD_PLACE" ? (
                      <>
                        <TrophyIcon className="w-12 h-12 text-amber-600" />
                        <span className="text-sm text-amber-700 font-bold">
                          3rd Place
                        </span>
                      </>
                    ) : (
                      <>
                        <TrophyIcon className="w-12 h-12 text-blue-500" />
                        <span className="text-sm text-blue-600 font-bold">
                          Participant
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Navigation (Optional) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {validItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}