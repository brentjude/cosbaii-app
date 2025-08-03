import React from 'react'

const UserDashboardSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="skeleton h-8 w-64 mb-2"></div>
        <div className="skeleton h-4 w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-base-100 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
              <div className="ml-4 flex-1">
                <div className="skeleton h-4 w-20 mb-2"></div>
                <div className="skeleton h-6 w-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects Skeleton */}
      <div className="bg-base-100 rounded-lg shadow">
        <div className="px-6 py-4">
          <div className="skeleton h-6 w-32"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-4 rounded-lg">
                <div className="skeleton w-12 h-12 rounded-lg shrink-0"></div>
                <div className="flex-1">
                  <div className="skeleton h-4 w-24 mb-2"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
                <div className="skeleton h-4 w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  
  )
}

export default UserDashboardSkeleton