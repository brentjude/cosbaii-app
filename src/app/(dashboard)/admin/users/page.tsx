"use client";

import { useState } from "react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserPlusIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// Import components
import UserStatsCards from "@/app/components/admin/users/cards/UserStatsCards";
import WorkflowCard from "@/app/components/admin/users/cards/WorkflowCard";
import ViewUserModal from "@/app/components/admin/users/modals/ViewUserModal";
import EditUserModal from "@/app/components/admin/users/modals/EditUserModal";
import DeleteUserModal from "@/app/components/admin/users/modals/DeleteUserModal";
import ReviewUserModal from "@/app/components/admin/users/modals/ReviewUserModal";
import AddUserModal from "@/app/components/admin/users/modals/AddUserModal";

//import loading skeleton
import AdminUsersSkeletonDaisy from "@/app/components/skeletons/admin/AdminUsersSkeletonDaisy";

// Import hooks
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type UserStatus = "INACTIVE" | "ACTIVE" | "BANNED";
type UserRole = "USER" | "ADMIN" | "MODERATOR";

interface User {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null; // ✅ Fixed: Changed from `reviewedBy?: string` to `reviewedBy: string | null`
}

interface NewUserData {
  name: string | null;
  email: string;
  username: string | null;
  password: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  status: "INACTIVE" | "ACTIVE" | "BANNED";
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UserManagementPage = () => {
  // ========================================
  // HOOKS & STATE MANAGEMENT
  // ========================================

  const { isAdmin, loading: authLoading } = useAuthSession();
  const {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    getUser,
    updateUser,
    reviewUser,
    deleteUser,
    createUser,
    setError,
  } = useAdminUsers();

  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "ALL">(
    "ALL"
  );

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected user and action states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "BAN" | null>(
    null
  );

  // Loading states for individual actions
  const [actionLoading, setActionLoading] = useState(false);

  // ========================================
  // COMPUTED VALUES
  // ========================================

  /** Filter users based on selected status */
  const filteredUsers =
    selectedStatus === "ALL"
      ? users
      : users.filter((user) => user.status === selectedStatus);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /** Get badge CSS class for user status */
  const getStatusBadge = (status: UserStatus): string => {
    const badges = {
      INACTIVE: "badge badge-warning",
      ACTIVE: "badge badge-success",
      BANNED: "badge badge-error",
    };
    return badges[status];
  };

  /** Get icon component for user status */
  const getStatusIcon = (status: UserStatus) => {
    const iconProps = { className: "w-4 h-4" };
    switch (status) {
      case "INACTIVE":
        return <ClockIcon {...iconProps} />;
      case "ACTIVE":
        return <CheckIcon {...iconProps} />;
      case "BANNED":
        return <XMarkIcon {...iconProps} />;
    }
  };

  /** Get badge CSS class for user role */
  const getRoleBadge = (role: UserRole): string => {
    const badges = {
      USER: "badge badge-outline",
      MODERATOR: "badge badge-info",
      ADMIN: "badge badge-secondary",
    };
    return badges[role];
  };

  /** Format date for registration column */
  const formatRegistrationDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  /** Get row background styling based on user status */
  const getStatusRowClass = (status: UserStatus): string => {
    switch (status) {
      case "INACTIVE":
        return "bg-warning/10 hover:bg-warning/20";
      case "BANNED":
        return "bg-error/10 hover:bg-error/20";
      case "ACTIVE":
        return "hover:bg-base-200";
      default:
        return "hover:bg-base-200";
    }
  };

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /** Handle status filter change */
  const handleStatusFilter = async (status: UserStatus | "ALL") => {
    setSelectedStatus(status);
    await fetchUsers(status === "ALL" ? undefined : status);
  };

  /** Open add user modal */
  const handleAddUser = () => {
    setShowAddModal(true);
  };

  /** Open view user modal */
  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);

    // Optionally fetch fresh user data
    const freshUser = await getUser(user.id);
    if (freshUser) {
      setSelectedUser({
        ...freshUser,
        reviewedBy: freshUser.reviewedBy ?? null,
      });
    }
  };

  /** Open edit user modal */
  const handleEditUser = async (user: User) => {
    setSelectedUser({
      ...user,
      reviewedBy: user.reviewedBy ?? null,
    });
    setShowEditModal(true);

    // Fetch fresh user data for editing
    const freshUser = await getUser(user.id);
    if (freshUser) {
      setSelectedUser({
        ...freshUser,
        reviewedBy: freshUser.reviewedBy ?? null,
      });
    }
  };

  /** Open delete confirmation modal */
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  /** Open review confirmation modal */
  const handleReviewUser = (user: User, action: "APPROVE" | "BAN") => {
    setSelectedUser(user);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  /** Confirm user creation */
  const confirmCreate = async (userData: NewUserData) => {
    setActionLoading(true);
    const success = await createUser(userData);

    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  /** Confirm user review action (approve/ban) */
  const confirmReview = async () => {
    if (!selectedUser || !reviewAction) return;

    setActionLoading(true);
    const success = await reviewUser(selectedUser.id, reviewAction);

    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  /** Confirm user edit */
  const confirmEdit = async (updatedUser: User) => {
    setActionLoading(true);
    const success = await updateUser(updatedUser.id, updatedUser);

    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  /** Confirm user deletion */
  const confirmDelete = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    const success = await deleteUser(selectedUser.id);

    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  /** Close all modals */
  const closeModals = () => {
    setShowReviewModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAddModal(false);
    setSelectedUser(null);
    setReviewAction(null);
    setError(null);
  };

  /** Clear error message */
  const clearError = () => {
    setError(null);
  };

  // ========================================
  // AUTHORIZATION CHECK
  // ========================================

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/70">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return <AdminUsersSkeletonDaisy />;
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="alert alert-error max-w-md">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <span>You don&apos;t have permission to access this page.</span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/70">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER COMPONENT
  // ========================================

  return (
    <div className="space-y-6">
      {/* ==================== ERROR ALERT ==================== */}
      {error && (
        <div className="alert alert-error">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <span>{error}</span>
          <button className="btn btn-ghost btn-sm" onClick={clearError}>
            ✕
          </button>
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-base-content/70">
            Review and manage user registrations
          </p>
        </div>

        <div className="flex gap-2">
          {/* Add User Button */}
          <button
            className="btn btn-secondary"
            onClick={handleAddUser}
            disabled={actionLoading}
          >
            <UserPlusIcon className="w-4 h-4" />
            Add New User
          </button>

          {/* Status Filter Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline">
              <FunnelIcon className="w-4 h-4" />
              Filter: {selectedStatus === "ALL" ? "All Users" : selectedStatus}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => handleStatusFilter("ALL")}>All Users</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("INACTIVE")}>Inactive</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("ACTIVE")}>Active</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("BANNED")}>Banned</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ==================== STATS CARDS ==================== */}
      <UserStatsCards statusCounts={stats} />

      {/* ==================== WORKFLOW VISUALIZATION ==================== */}
      <WorkflowCard />

      {/* ==================== USERS TABLE ==================== */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">
              {selectedStatus === "ALL"
                ? "All Users"
                : `${selectedStatus} Users`}
              <span className="badge badge-neutral">
                {filteredUsers.length}
              </span>
            </h2>
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
                  <th>Registration</th>
                  <th>Reviewed By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <ClockIcon className="w-8 h-8 text-base-content/50" />
                        <span className="text-base-content/70">
                          No users found for the selected filter
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    // Normalize reviewedBy to always be string|null
                    const normalizedUser = {
                      ...user,
                      reviewedBy: user.reviewedBy ?? null,
                    };
                    return (
                      <tr
                        key={normalizedUser.id}
                        className={getStatusRowClass(normalizedUser.status)}
                      >
                        {/* Name Column */}
                        <td>
                          <div className="font-bold">
                            {normalizedUser.name || "No name"}
                          </div>
                        </td>

                        {/* Username Column */}
                        <td>
                          <div className="font-medium">
                            {normalizedUser.username
                              ? `@${normalizedUser.username}`
                              : "No username"}
                          </div>
                        </td>

                        {/* Email Column */}
                        <td>
                          <div className="text-sm">{normalizedUser.email}</div>
                        </td>

                        {/* Role Column */}
                        <td>
                          <span className={getRoleBadge(normalizedUser.role)}>
                            {normalizedUser.role}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(normalizedUser.status)}
                            <span
                              className={getStatusBadge(normalizedUser.status)}
                            >
                              {normalizedUser.status}
                            </span>
                          </div>
                        </td>

                        {/* Registration Date Column */}
                        <td>
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatRegistrationDate(normalizedUser.createdAt)}
                            </div>
                            <div className="text-xs text-base-content/60">
                              {new Date(
                                normalizedUser.createdAt
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </td>

                        {/* Reviewed By Column - ✅ Fixed null handling */}
                        <td>
                          {normalizedUser.reviewedBy ? (
                            <div className="text-sm">
                              <div className="font-medium text-base-content/70">
                                {normalizedUser.reviewedBy}
                              </div>
                              <div className="text-xs text-base-content/50">
                                {formatRegistrationDate(
                                  normalizedUser.updatedAt
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-base-content/50 italic">
                              Not reviewed
                            </span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td>
                          <div className="flex gap-1">
                            {/* Review Actions (only for INACTIVE users) */}
                            {normalizedUser.status === "INACTIVE" && (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    handleReviewUser(normalizedUser, "APPROVE")
                                  }
                                  title="Approve User"
                                  disabled={actionLoading}
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <button
                                  className="btn btn-sm btn-error"
                                  onClick={() =>
                                    handleReviewUser(normalizedUser, "BAN")
                                  }
                                  title="Ban User"
                                  disabled={actionLoading}
                                >
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {/* View User */}
                            <button
                              className="btn btn-sm btn-info btn-outline"
                              onClick={() => handleViewUser(normalizedUser)}
                              title="View User Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>

                            {/* Edit User */}
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => handleEditUser(normalizedUser)}
                              title="Edit User"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>

                            {/* Delete User */}
                            <button
                              className="btn btn-sm btn-error btn-outline"
                              onClick={() => handleDeleteUser(normalizedUser)}
                              title="Delete User"
                              disabled={actionLoading}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={closeModals}
        onSave={confirmCreate}
        loading={actionLoading}
      />

      <ViewUserModal
        isOpen={showViewModal}
        user={selectedUser}
        onClose={closeModals}
      />

      <EditUserModal
        isOpen={showEditModal}
        user={selectedUser}
        onClose={closeModals}
        onSave={confirmEdit}
        loading={actionLoading}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        user={selectedUser}
        onClose={closeModals}
        onConfirm={confirmDelete}
        loading={actionLoading}
      />

      <ReviewUserModal
        isOpen={showReviewModal}
        user={selectedUser}
        action={reviewAction}
        onClose={closeModals}
        onConfirm={confirmReview}
        loading={actionLoading}
      />
    </div>
  );
};

export default UserManagementPage;
