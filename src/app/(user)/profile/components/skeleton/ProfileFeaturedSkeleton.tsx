"use client";

export default function ProfileFeaturedSkeleton() {
  return (
    <div className="relative h-130 sm:h-100 bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="absolute l-4 flex justify-between items-center w-full z-10 p-4">
        <div className="h-5 sm:h-6 bg-gray-300/80 rounded w-24"></div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300/80 rounded-full"></div>
      </div>

      {/* Desktop View - 3 columns */}
      <div className="hidden sm:flex flex-row h-full">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`basis-1/3 flex flex-col justify-end h-full p-4 ${
              index === 0 ? "rounded-l-lg" : index === 2 ? "rounded-r-lg" : ""
            } bg-gray-200 relative overflow-hidden`}
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
      </div>

      {/* Mobile View - Single Card */}
      <div className="sm:hidden relative h-full">
        <div className="w-full h-full flex flex-col justify-end p-4 bg-gray-200 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          
          <div className="w-full mx-auto py-2 px-3 mb-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-md z-10">
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

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`${
                  index === 0 ? "w-6 h-1.5" : "w-1.5 h-1.5"
                } bg-gray-400/50 rounded-full`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}