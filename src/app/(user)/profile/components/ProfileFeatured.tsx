"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon, TrophyIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { FeaturedItem } from "@/types/profile";
import FeaturedCarouselModal from "./FeaturedCarouselModal";

interface Props {
  featuredCosplays: FeaturedItem[];
  onEdit: () => void;
  loading?: boolean;
}

export default function ProfileFeatured({ featuredCosplays, onEdit, loading = false }: Props) {
  const hasFeaturedItems = featuredCosplays.some((item) => item.imageUrl && item.imageUrl.trim() !== "");
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!loading && hasFeaturedItems) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 3);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [loading, hasFeaturedItems]);

  const handleItemClick = (index: number) => {
    const item = featuredCosplays[index];
    if (item.imageUrl && item.imageUrl.trim() !== "") {
      // Find the actual index in the filtered valid items
      const validItems = featuredCosplays.filter(
        (item) => item.imageUrl && item.imageUrl.trim() !== ""
      );
      const validIndex = validItems.findIndex(
        (validItem) => validItem.imageUrl === item.imageUrl
      );
      setSelectedIndex(validIndex >= 0 ? validIndex : 0);
      setShowCarousel(true);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <div id="featured" className="relative h-130 sm:h-100 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="absolute l-4 flex justify-between items-center w-full z-10">
          <h2 className="absolute top-4 left-4 text-base sm:text-xl font-bold text-white drop-shadow-lg">
            Featured
          </h2>

          <button
            className="absolute btn btn-primary btn-xs sm:btn-sm py-4 sm:py-6 rounded-full top-2 right-4 tooltip tooltip-left"
            data-tip="Edit Featured Cosplay"
            onClick={onEdit}
            disabled={loading}
          >
            <PencilSquareIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Desktop View - 3 columns */}
        <div className="hidden sm:flex flex-row h-full">
          {loading ? (
            <>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`basis-1/3 flex flex-col justify-end h-full p-4 ${
                    index === 0 ? "rounded-l-lg" : index === 2 ? "rounded-r-lg" : ""
                  } bg-gray-200 relative overflow-hidden animate-pulse`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  
                  <div className="w-full mx-auto py-2 px-4 mb-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="h-2 bg-gray-300 rounded w-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : hasFeaturedItems ? (
            featuredCosplays.map((featured, index) => {
              const hasContent = featured.imageUrl && featured.imageUrl.trim() !== "";
              
              return (
                <div
                  key={index}
                  onClick={() => handleItemClick(index)}
                  className={`basis-1/3 flex flex-row items-end h-full p-4 ${
                    index === 0 ? "rounded-l-lg" : index === 2 ? "rounded-r-lg" : ""
                  } bg-gray-100 relative overflow-hidden ${
                    hasContent ? "cursor-pointer hover:scale-[1.02] transition-transform duration-200" : ""
                  }`}
                  style={{
                    backgroundImage: hasContent
                      ? `url(${featured.imageUrl})`
                      : `url('/images/feature-placeholder.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {hasContent && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  )}

                  {hasContent && (featured.title || featured.character) && (
                    <div className="w-full mx-auto py-2 px-4 mb-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md m-4 z-10 relative animate-fade-in pointer-events-none">
                      <div className="flex flex-row gap-2 items-center">
                        <div className="flex-1">
                          {featured.type === "competition" && featured.competition ? (
                            <h3 className="text-xs font-bold">
                              {new Date(featured.competition.eventDate).getFullYear()} |{" "}
                              {featured.competition.name}
                            </h3>
                          ) : featured.title ? (
                            <h3 className="text-xs font-bold">{featured.title}</h3>
                          ) : null}

                          {featured.character && (
                            <div className="flex flex-row justify-between items-center pt-1">
                              <span className="text-[10px] text-gray-500">
                                {featured.type === "competition"
                                  ? "Competition Character"
                                  : "Cosplay Character"}
                              </span>
                              <span className="text-[10px] font-bold">
                                {featured.character}
                                {featured.series && ` (${featured.series})`}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-center text-yellow-500">
                          {featured.type === "competition" ? (
                            <>
                              {featured.position === "CHAMPION" ||
                              featured.position === "FIRST_PLACE" ? (
                                <>
                                  <TrophyIcon className="w-4 h-4 text-yellow-500" />
                                  <span className="text-[8px] text-yellow-600 font-bold">
                                    Champion
                                  </span>
                                </>
                              ) : featured.position === "SECOND_PLACE" ? (
                                <>
                                  <TrophyIcon className="w-4 h-4 text-gray-500" />
                                  <span className="text-[8px] text-gray-600 font-bold">
                                    2nd Place
                                  </span>
                                </>
                              ) : featured.position === "THIRD_PLACE" ? (
                                <>
                                  <TrophyIcon className="w-4 h-4 text-amber-600" />
                                  <span className="text-[8px] text-amber-700 font-bold">
                                    3rd Place
                                  </span>
                                </>
                              ) : (
                                <>
                                  <TrophyIcon className="w-4 h-4 text-blue-500" />
                                  <span className="text-[8px] text-blue-600 font-bold">
                                    Participant
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="text-[8px] text-center text-yellow-600 font-bold">
                              Featured
                              <br />
                              Cosplay
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!hasContent && (
                    <div className="w-full flex items-center justify-center z-10 relative pointer-events-none">
                      <span className="text-gray-500 text-sm">Empty Slot</span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`basis-1/3 flex flex-row items-center justify-center h-full bg-gray-100 ${
                    index === 0 ? "rounded-l-lg" : index === 2 ? "rounded-r-lg" : ""
                  }`}
                  style={{
                    backgroundImage: "url(/images/feature-placeholder.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="text-gray-500 text-sm">Empty Slot</span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Mobile View - Carousel with single card */}
        <div className="sm:hidden relative h-full">
          <div className="relative h-full overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex flex-col justify-end p-4 bg-gray-200 relative animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                
                <div className="w-full mx-auto py-2 px-3 mb-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-md">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="flex-1 space-y-2">
                      <div className="h-2.5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="h-1.5 bg-gray-300 rounded w-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : hasFeaturedItems ? (
              <>
                {/* Carousel Track */}
                <div 
                  className="flex transition-transform duration-500 ease-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {featuredCosplays.map((featured, index) => {
                    const hasContent = featured.imageUrl && featured.imageUrl.trim() !== "";
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleItemClick(index)}
                        className={`w-full h-full flex-shrink-0 flex items-end p-4 bg-gray-100 relative ${
                          hasContent ? "cursor-pointer active:scale-[0.98] transition-transform" : ""
                        }`}
                        style={{
                          backgroundImage: hasContent
                            ? `url(${featured.imageUrl})`
                            : `url('/images/feature-placeholder.png')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {hasContent && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        )}

                        {hasContent && (featured.title || featured.character) && (
                          <div className="w-full mx-auto py-2 px-3 mb-12 bg-white/95 backdrop-blur-sm rounded-xl shadow-md z-10 relative animate-fade-in pointer-events-none">
                            <div className="flex flex-row gap-2 items-center">
                              <div className="flex-1 min-w-0">
                                {featured.type === "competition" && featured.competition ? (
                                  <h3 className="text-[11px] font-bold truncate">
                                    {new Date(featured.competition.eventDate).getFullYear()} |{" "}
                                    {featured.competition.name}
                                  </h3>
                                ) : featured.title ? (
                                  <h3 className="text-[11px] font-bold truncate">{featured.title}</h3>
                                ) : null}

                                {featured.character && (
                                  <div className="flex flex-col gap-0.5 pt-1">
                                    <span className="text-[9px] text-gray-500">
                                      {featured.type === "competition"
                                        ? "Competition Character"
                                        : "Cosplay Character"}
                                    </span>
                                    <span className="text-[10px] font-bold truncate">
                                      {featured.character}
                                      {featured.series && ` (${featured.series})`}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-center flex-shrink-0">
                                {featured.type === "competition" ? (
                                  <>
                                    {featured.position === "CHAMPION" ||
                                    featured.position === "FIRST_PLACE" ? (
                                      <>
                                        <TrophyIcon className="w-3.5 h-3.5 text-yellow-500" />
                                        <span className="text-[7px] text-yellow-600 font-bold whitespace-nowrap">
                                          Champion
                                        </span>
                                      </>
                                    ) : featured.position === "SECOND_PLACE" ? (
                                      <>
                                        <TrophyIcon className="w-3.5 h-3.5 text-gray-500" />
                                        <span className="text-[7px] text-gray-600 font-bold whitespace-nowrap">
                                          2nd Place
                                        </span>
                                      </>
                                    ) : featured.position === "THIRD_PLACE" ? (
                                      <>
                                        <TrophyIcon className="w-3.5 h-3.5 text-amber-600" />
                                        <span className="text-[7px] text-amber-700 font-bold whitespace-nowrap">
                                          3rd Place
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <TrophyIcon className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-[7px] text-blue-600 font-bold whitespace-nowrap">
                                          Participant
                                        </span>
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[7px] text-center text-yellow-600 font-bold leading-tight">
                                    Featured
                                    <br />
                                    Cosplay
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {!hasContent && (
                          <div className="w-full flex items-center justify-center z-10 relative pointer-events-none mb-12">
                            <span className="text-gray-500 text-sm">Empty Slot</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-xs bg-black/30 hover:bg-black/50 border-none text-white"
                  aria-label="Previous slide"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleNextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 btn btn-circle btn-xs bg-black/30 hover:bg-black/50 border-none text-white"
                  aria-label="Next slide"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>

                {/* Dot Navigation - Inside container at bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`transition-all duration-300 ${
                        index === currentSlide
                          ? "w-6 h-1.5 bg-white rounded-full"
                          : "w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 relative">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url(/images/feature-placeholder.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <span className="text-gray-500 text-sm z-10 relative">Empty Slot</span>
                
                {/* Dot Navigation for empty state */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`transition-all duration-300 ${
                        index === currentSlide
                          ? "w-6 h-1.5 bg-gray-400 rounded-full"
                          : "w-1.5 h-1.5 bg-gray-400/50 rounded-full"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* Carousel Modal */}
      <FeaturedCarouselModal
        isOpen={showCarousel}
        onClose={() => setShowCarousel(false)}
        featuredItems={featuredCosplays}
        initialIndex={selectedIndex}
      />
    </>
  );
}