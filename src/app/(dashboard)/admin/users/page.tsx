"use client";

import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Components
import UserStatsCards from "@/app/components/admin/users/cards/UserStatsCards";
import WorkflowCard from "@/app/components/admin/users/cards/WorkflowCard";
import ViewUserModal from "@/app/components/admin/users/modals/ViewUserModal";
import EditUserModal from "@/app/components/admin/users/modals/EditUserModal";
import DeleteUserModal from "@/app/components/admin/users/modals/DeleteUserModal";
import ReviewUserModal from "@/app/components/admin/users/modals/ReviewUserModal";
import AddUserModal from "@/app/components/admin/users/modals/AddUserModal";
import AdminUsersSkeletonDaisy from "@/app/components/skeletons/admin/AdminUsersSkeletonDaisy";
import UsersTableHeader from "./components/UsersTableHeader";
import UsersTable from "./components/UsersTable";
import ErrorAlert from "./components/ErrorAlert";

// Hooks
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

// Types
import { User, UserStatus, NewUserData } from "@/types/admin";

const UserManagementPage = () => {
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

  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "ALL">("ALL");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "BAN" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredUsers =
    selectedStatus === "ALL"
      ? users
      : users.filter((user) => user.status === selectedStatus);

  const handleStatusFilter = async (status: UserStatus | "ALL") => {
    setSelectedStatus(status);
    await fetchUsers(status === "ALL" ? undefined : status);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);

    const freshUser = await getUser(user.id);
    if (freshUser) {
      setSelectedUser({
        ...freshUser,
        reviewedBy: freshUser.reviewedBy ?? null,
      });
    }
  };

  const handleEditUser = async (user: User) => {
    setSelectedUser({
      ...user,
      reviewedBy: user.reviewedBy ?? null,
    });
    setShowEditModal(true);

    const freshUser = await getUser(user.id);
    if (freshUser) {
      setSelectedUser({
        ...freshUser,
        reviewedBy: freshUser.reviewedBy ?? null,
      });
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleReviewUser = (user: User, action: "APPROVE" | "BAN") => {
    setSelectedUser(user);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const confirmCreate = async (userData: NewUserData) => {
    setActionLoading(true);
    const success = await createUser(userData);
    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  const confirmReview = async () => {
    if (!selectedUser || !reviewAction) return;

    setActionLoading(true);
    const success = await reviewUser(selectedUser.id, reviewAction);
    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  const confirmEdit = async (updatedUser: User) => {
    setActionLoading(true);
    const success = await updateUser(updatedUser.id, updatedUser);
    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    const success = await deleteUser(selectedUser.id);
    if (success) {
      closeModals();
    }
    setActionLoading(false);
  };

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

  const clearError = () => {
    setError(null);
  };

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

  if (loading) {
    return <AdminUsersSkeletonDaisy />;
  }

  return (
    <div className="space-y-6">
      <ErrorAlert error={error} onClear={clearError} />

      <UsersTableHeader
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusFilter}
        onAddUser={handleAddUser}
        actionLoading={actionLoading}
      />

      <UserStatsCards statusCounts={stats} />

      <WorkflowCard />

      <UsersTable
        users={filteredUsers}
        selectedStatus={selectedStatus}
        actionLoading={actionLoading}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onReview={handleReviewUser}
      />

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