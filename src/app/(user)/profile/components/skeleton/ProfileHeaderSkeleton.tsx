"use client";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="relative h-32 sm:h-48 md:h-64 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>

      {/* Profile Info Skeleton */}
      <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-12 sm:-mt-16">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 border-4 border-white"></div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div className="flex-1 space-y-2">
              {/* Display Name */}
              <div className="h-6 sm:h-8 bg-gray-300 rounded w-48 max-w-full"></div>
              {/* Email */}
              <div className="h-4 bg-gray-200 rounded w-36 max-w-full"></div>
            </div>

            {/* Edit Button */}
            <div className="w-full sm:w-auto">
              <div className="h-9 sm:h-10 bg-gray-300 rounded-lg w-full sm:w-32"></div>
            </div>
          </div>
        </div>

        {/* Cosplayer Type Badge */}
        <div className="mt-3 sm:mt-4">
          <div className="h-7 bg-gray-200 rounded-full w-40"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center">
              <div className="h-6 sm:h-8 bg-gray-300 rounded w-12 sm:w-16 mx-auto mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}