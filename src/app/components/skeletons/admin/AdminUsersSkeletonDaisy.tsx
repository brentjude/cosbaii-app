import React from 'react';

const AdminUsersSkeletonDaisy = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="skeleton h-8 w-64 mb-2"></div>
          <div className="skeleton h-4 w-80"></div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-10 w-32"></div>
          <div className="skeleton h-10 w-28"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="skeleton h-4 w-20 mb-2"></div>
                  <div className="skeleton h-8 w-12"></div>
                </div>
                <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Card Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-6 w-48 mb-4"></div>
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className="skeleton w-12 h-12 rounded-full mb-2 shrink-0"></div>
                  <div className="skeleton h-4 w-16"></div>
                </div>
                {step < 4 && (
                  <div className="skeleton flex-1 h-1 mx-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table Skeleton */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Table Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="skeleton h-6 w-32"></div>
          </div>

          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  {['Name', 'Username', 'Email', 'Role', 'Status', 'Registration', 'Reviewed By', 'Actions'].map((header) => (
                    <th key={header}>
                      <div className="skeleton h-4 w-16"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    {/* Name */}
                    <td>
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    {/* Username */}
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    {/* Email */}
                    <td>
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    {/* Role */}
                    <td>
                      <div className="skeleton h-6 w-16 rounded-full"></div>
                    </td>
                    {/* Status */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="skeleton w-4 h-4 rounded shrink-0"></div>
                        <div className="skeleton h-6 w-16 rounded-full"></div>
                      </div>
                    </td>
                    {/* Registration */}
                    <td>
                      <div className="skeleton h-4 w-20 mb-1"></div>
                      <div className="skeleton h-3 w-16"></div>
                    </td>
                    {/* Reviewed By */}
                    <td>
                      <div className="skeleton h-4 w-24 mb-1"></div>
                      <div className="skeleton h-3 w-16"></div>
                    </td>
                    {/* Actions */}
                    <td>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((btn) => (
                          <div key={btn} className="skeleton w-8 h-8 rounded shrink-0"></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersSkeletonDaisy;