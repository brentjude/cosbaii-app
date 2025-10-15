"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Competition, CompetitionStatus } from "@/types/competition";
import { useCompetitions } from "@/hooks/admin/useCompetition";

// Components
import StatsCards from "./components/StatsCards";
import CompetitionsTable from "./components/CompetitionsTable";
import ParticipantsModal from "./components/ParticipantsModal";
import CreateCompetitionModal from "./components/CreateCompetitionModal";
import EditCompetitionModal from "./components/EditCompetitionModal";
import ViewCompetitionModal from "./components/ViewCompetitionModal";
import ReviewCompetitionModal from "./components/ReviewCompetitionModal";

export default function AdminCompetitionsPage() {
  const { data: session, status } = useSession();
  const authLoading = status === "loading";
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const {
    competitions,
    stats,
    loading,
    error,
    actionLoading,
    setError,
    fetchCompetitions,
    createCompetition,
    updateCompetition,
    deleteCompetition,
    reviewCompetition,
  } = useCompetitions(isAdmin, authLoading);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [reviewAction, setReviewAction] = useState<"ACCEPT" | "REJECT">("ACCEPT");
  const [rejectionReason, setRejectionReason] = useState("");

  // Filter state
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | "">("SUBMITTED");

  // Redirect if not admin
  if (!authLoading && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Access denied. Admin privileges required.</span>
        </div>
      </div>
    );
  }

  // Handlers (same as before)
  const handleCreate = async (data: any) => {
    const result = await createCompetition(data);
    if (result.success) {
      setShowCreateModal(false);
    } else {
      setError(result.error || "Failed to create competition");
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedCompetition) return;
    const result = await updateCompetition(selectedCompetition.id, data);
    if (result.success) {
      setShowEditModal(false);
      setSelectedCompetition(null);
    } else {
      setError(result.error || "Failed to update competition");
    }
  };

  const handleDelete = async (competition: Competition) => {
    if (!confirm(`Are you sure you want to delete "${competition.name}"?`))
      return;

    const result = await deleteCompetition(competition.id);
    if (!result.success) {
      setError(result.error || "Failed to delete competition");
    }
  };

  const handleReview = async () => {
    if (!selectedCompetition) return;

    const result = await reviewCompetition(
      selectedCompetition.id,
      reviewAction,
      reviewAction === "REJECT" ? rejectionReason : undefined
    );

    if (result.success) {
      setShowReviewModal(false);
      setSelectedCompetition(null);
      setRejectionReason("");
    } else {
      setError(result.error || "Failed to review competition");
    }
  };

  const handleOpenReview = (
    competition: Competition,
    action: "ACCEPT" | "REJECT"
  ) => {
    setSelectedCompetition(competition);
    setReviewAction(action);
    setRejectionReason("");
    setShowReviewModal(true);
  };

  const handleViewParticipants = (competition: Competition) => {
    setSelectedCompetition(competition);
    setShowParticipantsModal(true);
  };

  const handleStatusFilterChange = (status: CompetitionStatus | "") => {
    setStatusFilter(status);
    fetchCompetitions(status || undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Competition Management</h1>
          <p className="text-base-content/70 mt-1">
            Manage and review competition submissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Add Competition
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      <StatsCards stats={stats} />

      {/* Filter Section */}
      <div className="bg-base-100 rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="font-semibold">Filter by Status:</span>
          <div className="btn-group">
            <button
              className={`btn btn-sm ${statusFilter === "" ? "btn-active" : ""}`}
              onClick={() => handleStatusFilterChange("")}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${
                statusFilter === "SUBMITTED" ? "btn-active" : ""
              }`}
              onClick={() => handleStatusFilterChange("SUBMITTED")}
            >
              Submitted
            </button>
            <button
              className={`btn btn-sm ${
                statusFilter === "ACCEPTED" ? "btn-active" : ""
              }`}
              onClick={() => handleStatusFilterChange("ACCEPTED")}
            >
              Accepted
            </button>
            <button
              className={`btn btn-sm ${
                statusFilter === "ONGOING" ? "btn-active" : ""
              }`}
              onClick={() => handleStatusFilterChange("ONGOING")}
            >
              Ongoing
            </button>
            <button
              className={`btn btn-sm ${
                statusFilter === "COMPLETED" ? "btn-active" : ""
              }`}
              onClick={() => handleStatusFilterChange("COMPLETED")}
            >
              Completed
            </button>
            <button
              className={`btn btn-sm ${
                statusFilter === "REJECTED" ? "btn-active" : ""
              }`}
              onClick={() => handleStatusFilterChange("REJECTED")}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-base-100 rounded-lg shadow">
        <CompetitionsTable
          competitions={competitions}
          loading={loading}
          actionLoading={actionLoading}
          onView={(competition) => {
            setSelectedCompetition(competition);
            setShowViewModal(true);
          }}
          onEdit={(competition) => {
            setSelectedCompetition(competition);
            setShowEditModal(true);
          }}
          onDelete={handleDelete}
          onReview={handleOpenReview}
          onViewParticipants={handleViewParticipants}
        />
      </div>

      {/* Modals */}
      <CreateCompetitionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreate}
        loading={actionLoading}
        errorMessage={error}
        onClearError={() => setError(null)}
      />

      <EditCompetitionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCompetition(null);
        }}
        onSave={handleEdit}
        competition={selectedCompetition}
        loading={actionLoading}
        errorMessage={error}
        onClearError={() => setError(null)}
      />

      <ViewCompetitionModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedCompetition(null);
        }}
        competition={selectedCompetition}
      />

      <ReviewCompetitionModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedCompetition(null);
          setRejectionReason("");
        }}
        onConfirm={handleReview}
        competition={selectedCompetition}
        action={reviewAction}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        loading={actionLoading}
      />

      <ParticipantsModal
        isOpen={showParticipantsModal}
        onClose={() => {
          setShowParticipantsModal(false);
          setSelectedCompetition(null);
        }}
        competition={selectedCompetition}
      />
    </div>
  );
}