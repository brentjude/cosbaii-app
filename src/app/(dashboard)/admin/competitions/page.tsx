// src/app/(dashboard)/admin/competitions/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useAuthSession } from "@/hooks/auth/useAuthSession";

// ✅ Fixed import path - removed extra 't' in 'AddCompeittionModal'
import AddCompetitionModal from "@/app/components/admin/competitions/modals/AddCompetitionModal";
import ReviewCompetitionModal from "@/app/components/admin/competitions/modals/ReviewCompetitionModal";
import DeleteCompetitionModal from "@/app/components/admin/competitions/modals/DeleteCompetitionModal";
import ViewCompetitionModal from "@/app/components/admin/competitions/modals/ViewCompetitionModal";

// Types
type CompetitionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ACCEPTED"
  | "ONGOING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

type CompetitionType = "GENERAL" | "ARMOR" | "CLOTH" | "SINGING";
type RivalryType = "SOLO" | "DUO" | "GROUP";
type CompetitionLevel =
  | "BARANGAY"
  | "LOCAL"
  | "REGIONAL"
  | "NATIONAL"
  | "WORLDWIDE";

interface Competition {
  id: number;
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  // ✅ Add new fields
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  // ✅ NEW: Logo and reference links
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
  // System fields
  submittedById: number;
  submittedBy: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
    role: string;
  };
  status: CompetitionStatus;
  reviewedById: number | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    participants: number;
    awards: number;
  };
}

interface NewCompetitionData {
  name: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  organizer: string | null;
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  // Ensure these are in ALL definitions
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
}

const CompetitionsManagementPage = () => {
  const { isAdmin, loading: authLoading } = useAuthSession();

  // State management
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  // NEW: error shown inside AddCompetitionModal
  const [addModalError, setAddModalError] = useState<string | null>(null);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<
    CompetitionStatus | "ALL"
  >("ALL");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Selected competition and action states
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [reviewAction, setReviewAction] = useState<"ACCEPT" | "REJECT" | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  // Fetch competitions
  const fetchCompetitions = async (status?: CompetitionStatus) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status) params.append("status", status);

      const response = await fetch(
        `/api/admin/competitions?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch competitions");
      }

      const data = await response.json();
      setCompetitions(data.competitions || []);
      setStats(
        data.stats || { total: 0, pending: 0, accepted: 0, rejected: 0 }
      );
    } catch (error) {
      console.error("Error fetching competitions:", error);
      setError("Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchCompetitions();
    }
  }, [authLoading, isAdmin]);

  // Filter competitions based on selected status
  const filteredCompetitions =
    selectedStatus === "ALL"
      ? competitions
      : competitions.filter((comp) => comp.status === selectedStatus);

  // Event handlers
  const handleStatusFilter = async (status: CompetitionStatus | "ALL") => {
    setSelectedStatus(status);
    await fetchCompetitions(status === "ALL" ? undefined : status);
  };

  const handleAddCompetition = () => {
    setShowAddModal(true);
  };

  const handleViewCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
    setShowViewModal(true);
  };

  const handleEditCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
    setShowEditModal(true);
  };

  const handleDeleteCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
    setShowDeleteModal(true);
  };

  const handleReviewCompetition = (
    competition: Competition,
    action: "ACCEPT" | "REJECT"
  ) => {
    setSelectedCompetition(competition);
    setReviewAction(action);
    setRejectionReason("");
    setShowReviewModal(true);
  };

  // API actions
  const confirmCreate = async (data: NewCompetitionData) => {
    setActionLoading(true);
    setAddModalError(null); // ✅ Clear previous modal error
    try {
      const response = await fetch("/api/admin/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        closeModals();
        await fetchCompetitions();
      } else {
        const error = await response.json();
        // ✅ Show error in modal instead of page alert
        setAddModalError(error.message || "Failed to create competition");
      }
    } catch (error) {
      setAddModalError("Failed to create competition");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReview = async () => {
    if (!selectedCompetition || !reviewAction) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/competitions/${selectedCompetition.id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: reviewAction,
            rejectionReason:
              reviewAction === "REJECT" ? rejectionReason : undefined,
          }),
        }
      );

      if (response.ok) {
        closeModals();
        await fetchCompetitions();
      } else {
        const error = await response.json();
        setError(error.message || "Failed to review competition");
      }
    } catch (error) {
      setError("Failed to review competition");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCompetition) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/competitions/${selectedCompetition.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        closeModals();
        await fetchCompetitions();
      } else {
        const error = await response.json();
        setError(error.message || "Failed to delete competition");
      }
    } catch (error) {
      setError("Failed to delete competition");
    } finally {
      setActionLoading(false);
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowReviewModal(false);
    setSelectedCompetition(null);
    setReviewAction(null);
    setRejectionReason("");
    setError(null);
    setAddModalError(null);
  };

  // Utility functions
  const getStatusBadgeClass = (status: CompetitionStatus) => {
    switch (status) {
      case "DRAFT":
        return "badge-ghost";
      case "SUBMITTED":
        return "badge-warning";
      case "ACCEPTED":
        return "badge-success";
      case "ONGOING":
        return "badge-info";
      case "COMPLETED":
        return "badge-primary";
      case "REJECTED":
        return "badge-error";
      case "CANCELLED":
        return "badge-ghost";
      default:
        return "badge-ghost";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Helper function to format enum values for display
  const formatEnumValue = (value: string) => {
    return value.charAt(0) + value.slice(1).toLowerCase().replace("_", " ");
  };

  // Loading and auth checks
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
            <span>You don't have permission to access this page.</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <span>{error}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setError(null)}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Competition Management</h1>
          <p className="text-base-content/70">
            Review and manage cosplay competitions
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleAddCompetition}
            disabled={actionLoading}
          >
            <PlusIcon className="w-4 h-4" />
            Add Competition
          </button>

          {/* Status Filter */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline">
              <FunnelIcon className="w-4 h-4" />
              Filter: {selectedStatus === "ALL" ? "All Status" : selectedStatus}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => handleStatusFilter("ALL")}>All Status</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("SUBMITTED")}>Submitted</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("ACCEPTED")}>Accepted</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("REJECTED")}>Rejected</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("ONGOING")}>Ongoing</a>
              </li>
              <li>
                <a onClick={() => handleStatusFilter("COMPLETED")}>Completed</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <TrophyIcon className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Competitions</div>
          <div className="stat-value text-primary">{stats.total}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-warning">
            <ClockIcon className="w-8 h-8" />
          </div>
          <div className="stat-title">Pending Review</div>
          <div className="stat-value text-warning">{stats.pending}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-success">
            <CheckIcon className="w-8 h-8" />
          </div>
          <div className="stat-title">Accepted</div>
          <div className="stat-value text-success">{stats.accepted}</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-error">
            <XMarkIcon className="w-8 h-8" />
          </div>
          <div className="stat-title">Rejected</div>
          <div className="stat-value text-error">{stats.rejected}</div>
        </div>
      </div>

      {/* Competitions Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Competition</th>
                  <th>Event Date</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="text-base-content/50">
                        <TrophyIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>No competitions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCompetitions.map((competition) => (
                    <tr key={competition.id} className="hover">
                      <td>
                        <div>
                          <div className="font-semibold">
                            {competition.name}
                          </div>
                          {/* ✅ Show new competition details with formatted badges */}
                          <div className="flex gap-2 mt-1">
                            <span className="badge badge-sm badge-outline">
                              {formatEnumValue(competition.competitionType)}
                            </span>
                            <span className="badge badge-sm badge-info">
                              {formatEnumValue(competition.rivalryType)}
                            </span>
                            <span className="badge badge-sm badge-accent">
                              {formatEnumValue(competition.level)}
                            </span>
                          </div>
                          {competition.location && (
                            <div className="text-sm text-base-content/70 flex items-center gap-1 mt-1">
                              <MapPinIcon className="w-3 h-3" />
                              {competition.location}
                            </div>
                          )}
                          {competition.organizer && (
                            <div className="text-sm text-base-content/70">
                              Org: {competition.organizer}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-base-content/50" />
                          {formatDate(competition.eventDate)}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-base-content/50" />
                          <div>
                            <div className="font-medium">
                              {competition.submittedBy.name ||
                                competition.submittedBy.email}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {competition.submittedBy.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge ${getStatusBadgeClass(
                            competition.status
                          )}`}
                        >
                          {competition.status}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {competition._count.participants}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          {/* Review Actions (only for SUBMITTED competitions) */}
                          {competition.status === "SUBMITTED" && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  handleReviewCompetition(competition, "ACCEPT")
                                }
                                title="Accept Competition"
                                disabled={actionLoading}
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() =>
                                  handleReviewCompetition(competition, "REJECT")
                                }
                                title="Reject Competition"
                                disabled={actionLoading}
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* View Competition */}
                          <button
                            className="btn btn-sm btn-info btn-outline"
                            onClick={() => handleViewCompetition(competition)}
                            title="View Competition Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          {/* Edit Competition */}
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleEditCompetition(competition)}
                            title="Edit Competition"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>

                          {/* Delete Competition */}
                          <button
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => handleDeleteCompetition(competition)}
                            title="Delete Competition"
                            disabled={actionLoading}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Competition Modal */}
      <ViewCompetitionModal
        isOpen={showViewModal}
        onClose={closeModals}
        competition={selectedCompetition}
      />

      {/* Add Competition Modal */}
      <AddCompetitionModal
        isOpen={showAddModal}
        onClose={closeModals}
        onSave={confirmCreate}
        loading={actionLoading}
        // ✅ NEW: Add error props for modal-level errors
        errorMessage={addModalError}
        onClearError={() => setAddModalError(null)}
      />

      {/* Review Competition Modal */}
      <ReviewCompetitionModal
        isOpen={showReviewModal}
        onClose={closeModals}
        onConfirm={confirmReview}
        competition={selectedCompetition}
        action={reviewAction}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        loading={actionLoading}
      />

      {/* Delete Competition Modal */}
      <DeleteCompetitionModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onConfirm={confirmDelete}
        competition={selectedCompetition}
        loading={actionLoading}
      />
    </div>
  );
};

export default CompetitionsManagementPage;
