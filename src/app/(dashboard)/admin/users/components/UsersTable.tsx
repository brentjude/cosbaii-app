// Update: src/app/(dashboard)/admin/users/components/UsersTable.tsx
import { useState, useMemo } from "react";
import { ClockIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { User, UserStatus } from "@/types/admin";
import UserTableRow from "./UserTableRow";

interface Props {
  users: User[];
  selectedStatus: UserStatus | "ALL";
  actionLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onReview: (user: User, action: "APPROVE" | "BAN") => void;
}

export default function UsersTable({
  users,
  selectedStatus,
  actionLoading,
  onView,
  onEdit,
  onDelete,
  onReview,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const username = user.username?.toLowerCase() || "";
      const email = user.email.toLowerCase();

      return (
        name.includes(query) ||
        username.includes(query) ||
        email.includes(query)
      );
    });
  }, [users, searchQuery]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="card-title">
            {selectedStatus === "ALL" ? "All Users" : `${selectedStatus} Users`}
            <span className="badge badge-neutral">{filteredUsers.length}</span>
            {searchQuery && (
              <span className="badge badge-ghost badge-sm">
                of {users.length}
              </span>
            )}
          </h2>

          {/* ✅ Search Input */}
          <div className="form-control w-full sm:w-auto">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                className="input input-bordered w-full sm:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Reviewed</th>
                <th>Registration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      {searchQuery ? (
                        <>
                          <MagnifyingGlassIcon className="w-8 h-8 text-base-content/50" />
                          <span className="text-base-content/70">
                            No users found matching &quot;{searchQuery}&quot;
                          </span>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setSearchQuery("")}
                          >
                            Clear search
                          </button>
                        </>
                      ) : (
                        <>
                          <ClockIcon className="w-8 h-8 text-base-content/50" />
                          <span className="text-base-content/70">
                            No users found for the selected filter
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    actionLoading={actionLoading}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReview={onReview}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Results summary */}
        {searchQuery && filteredUsers.length > 0 && (
          <div className="text-sm text-base-content/70 text-center mt-2">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}