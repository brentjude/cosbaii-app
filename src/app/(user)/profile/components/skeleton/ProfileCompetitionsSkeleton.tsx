"use client";

export default function ProfileCompetitionsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="h-6 sm:h-7 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64 max-w-full"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 sm:h-10 bg-gray-300 rounded-lg w-24 sm:w-28"></div>
            <div className="h-9 sm:h-10 bg-gray-300 rounded-lg w-20 sm:w-24"></div>
          </div>
        </div>
      </div>

      {/* Competition Cards */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="card bg-base-200 shadow-sm"
          >
            <div className="card-body p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-4">
                {/* Image - Hidden on mobile */}
                <div className="relative flex-shrink-0 hidden sm:block">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-300"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 sm:h-5 bg-gray-300 rounded w-48 max-w-full"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-36 max-w-full"></div>
                    </div>
                    <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}