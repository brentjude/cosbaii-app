export default function AdminUsersSkeletonDaisy() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-base-300 rounded"></div>
          <div className="h-4 w-48 bg-base-300 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-base-300 rounded"></div>
          <div className="h-10 w-32 bg-base-300 rounded"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat bg-base-100 shadow-xl rounded-box border border-base-300">
            <div className="stat-figure">
              <div className="w-8 h-8 bg-base-300 rounded-full"></div>
            </div>
            <div className="stat-title">
              <div className="h-4 w-24 bg-base-300 rounded"></div>
            </div>
            <div className="stat-value">
              <div className="h-10 w-16 bg-base-300 rounded"></div>
            </div>
            <div className="stat-desc">
              <div className="h-3 w-32 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Card Skeleton */}
      <div className="alert bg-base-200">
        <div className="w-6 h-6 bg-base-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-base-300 rounded"></div>
          <div className="h-3 w-full bg-base-300 rounded"></div>
          <div className="h-3 w-3/4 bg-base-300 rounded"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="h-6 w-32 bg-base-300 rounded mb-4"></div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {[...Array(8)].map((_, i) => (
                    <th key={i}>
                      <div className="h-4 bg-base-300 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j}>
                        <div className="h-4 bg-base-300 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}