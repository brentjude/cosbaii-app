"use client";

export default function ProfileInfoSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 animate-pulse">
      {/* Bio Section */}
      <div className="mb-4 sm:mb-6">
        <div className="h-5 bg-gray-300 rounded w-16 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      <div className="divider my-4 sm:my-6"></div>

      {/* Details Section */}
      <div className="mb-4 sm:mb-6">
        <div className="h-5 bg-gray-300 rounded w-20 mb-3"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider my-4 sm:my-6"></div>

      {/* Social Links */}
      <div>
        <div className="h-5 bg-gray-300 rounded w-28 mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}