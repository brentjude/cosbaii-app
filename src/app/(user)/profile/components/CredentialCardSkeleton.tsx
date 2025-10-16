"use client";

export default function CredentialCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Mobile Loading */}
      <div className="flex sm:hidden items-center gap-3 p-3 bg-gray-200 rounded-lg">
        <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
          <div className="h-2 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      {/* Desktop Loading */}
      <div className="hidden sm:flex items-center gap-3 p-4 bg-gray-200 rounded-lg">
        <div className="w-24 h-24 bg-gray-300 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="flex gap-2 mt-2">
            <div className="h-6 bg-gray-300 rounded-full w-20"></div>
            <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}