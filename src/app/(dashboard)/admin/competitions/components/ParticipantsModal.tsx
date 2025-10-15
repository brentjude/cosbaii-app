import { useState, useEffect, useMemo } from "react";
import {
  XMarkIcon,
  CheckIcon,
  XMarkIcon as RejectIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  Competition,
  CompetitionParticipant,
  PARTICIPANT_REVIEW_ACTIONS,
} from "@/types/competition";
import { formatDateTime } from "@/utils/competition";
import ViewParticipantModal from "./ViewParticipantModal";

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition | null;
}

export default function ParticipantsModal({
  isOpen,
  onClose,
  competition,
}: ParticipantsModalProps) {
  const [participants, setParticipants] = useState<CompetitionParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] =
    useState<CompetitionParticipant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (isOpen && competition) {
      fetchParticipants();
      setSearchQuery("");
      setStatusFilter("ALL");
    }
  }, [isOpen, competition]);

  const fetchParticipants = async () => {
    if (!competition) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/competitions/${competition.id}/participants`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch participants");
      }

      const data = await response.json();
      setParticipants(data.participants || []);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError("Failed to load participants");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewParticipant = async (
    participantId: number,
    action: keyof typeof PARTICIPANT_REVIEW_ACTIONS
  ) => {
    if (!competition) return;

    setActionLoading(participantId);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/competitions/${competition.id}/participants/${participantId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to review participant");
      }

      await fetchParticipants();
    } catch (err) {
      console.error("Error reviewing participant:", err);
      setError(
        err instanceof Error ? err.message : "Failed to review participant"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (participant: CompetitionParticipant) => {
    setSelectedParticipant(participant);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="badge badge-warning">Pending</span>;
      case "APPROVED":
        return <span className="badge badge-success">Approved</span>;
      case "REJECTED":
        return <span className="badge badge-error">Rejected</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  // Filter and search participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      // Status filter
      if (statusFilter !== "ALL" && participant.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const displayName = participant.user.profile?.displayName?.toLowerCase() || "";
        const userName = participant.user.name?.toLowerCase() || "";
        const email = participant.user.email.toLowerCase();
        const username = participant.user.username?.toLowerCase() || "";
        const cosplayTitle = participant.cosplayTitle?.toLowerCase() || "";
        const characterName = participant.characterName?.toLowerCase() || "";
        const seriesName = participant.seriesName?.toLowerCase() || "";

        return (
          displayName.includes(query) ||
          userName.includes(query) ||
          email.includes(query) ||
          username.includes(query) ||
          cosplayTitle.includes(query) ||
          characterName.includes(query) ||
          seriesName.includes(query)
        );
      }

      return true;
    });
  }, [participants, searchQuery, statusFilter]);

  // Get status counts
  const statusCounts = useMemo(() => {
    return {
      all: participants.length,
      pending: participants.filter((p) => p.status === "PENDING").length,
      approved: participants.filter((p) => p.status === "APPROVED").length,
      rejected: participants.filter((p) => p.status === "REJECTED").length,
    };
  }, [participants]);

  if (!isOpen || !competition) return null;

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box max-w-5xl max-h-[90vh]">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-base-100 z-10 pb-2">
            <div>
              <h3 className="font-bold text-lg">Competition Participants</h3>
              <p className="text-sm text-base-content/70">{competition.name}</p>
            </div>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setError(null)}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-4 space-y-3">
            {/* Search Input */}
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by name, email, cosplay, character, or series..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-ghost btn-square"
                    onClick={() => setSearchQuery("")}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="tabs tabs-boxed bg-base-200">
              <button
                className={`tab ${statusFilter === "ALL" ? "tab-active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                All ({statusCounts.all})
              </button>
              <button
                className={`tab ${statusFilter === "PENDING" ? "tab-active" : ""}`}
                onClick={() => setStatusFilter("PENDING")}
              >
                Pending ({statusCounts.pending})
              </button>
              <button
                className={`tab ${statusFilter === "APPROVED" ? "tab-active" : ""}`}
                onClick={() => setStatusFilter("APPROVED")}
              >
                Approved ({statusCounts.approved})
              </button>
              <button
                className={`tab ${statusFilter === "REJECTED" ? "tab-active" : ""}`}
                onClick={() => setStatusFilter("REJECTED")}
              >
                Rejected ({statusCounts.rejected})
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-base-content/70">
              Showing {filteredParticipants.length} of {participants.length}{" "}
              participants
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-320px)]">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 mx-auto text-base-content/30 mb-2" />
                <p className="text-base-content/70">
                  {searchQuery || statusFilter !== "ALL"
                    ? "No participants match your filters"
                    : "No participants yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-start align-center justify-between gap-4">
                        {/* User Info Section */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="avatar">
                            <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                              <Image
                                src={
                                  participant.user.profile?.profilePicture ||
                                  "/images/default-avatar.png"
                                }
                                alt={
                                  participant.user.profile?.displayName || "User"
                                }
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          </div>

                          <div className="flex-1">
                            {/* User Name & Status */}
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">
                                {participant.user.profile?.displayName ||
                                  participant.user.name ||
                                  participant.user.email}
                              </h4>
                              {getStatusBadge(participant.status)}
                            </div>

                            {/* Cosplay Details */}
                            <div className="space-y-1 mb-3">
                              {participant.cosplayTitle && (
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-primary min-w-[100px]">
                                    Cosplay Title:
                                  </span>
                                  <p className="text-sm font-medium">
                                    {participant.cosplayTitle}
                                  </p>
                                </div>
                              )}

                              {participant.characterName && (
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-primary min-w-[100px]">
                                    Character:
                                  </span>
                                  <p className="text-sm text-base-content/80">
                                    {participant.characterName}
                                  </p>
                                </div>
                              )}

                              {participant.seriesName && (
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-primary min-w-[100px]">
                                    Series:
                                  </span>
                                  <p className="text-sm text-base-content/80">
                                    {participant.seriesName}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Submission Time */}
                            <div className="flex items-center gap-1 text-xs text-base-content/50">
                              <ClockIcon className="w-3 h-3" />
                              Submitted: {formatDateTime(participant.submittedAt)}
                            </div>

                            {participant.reviewedAt && (
                              <div className="text-xs text-base-content/50 mt-1">
                                Reviewed: {formatDateTime(participant.reviewedAt)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row gap-2">
                          {/* View Details Button */}
                          <button
                            className="btn btn-sm btn-ghost btn-square tooltip tooltip-left"
                            data-tip="View Full Details"
                            onClick={() => handleViewDetails(participant)}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>

                          {/* Review Buttons - Only show for pending */}
                          {participant.status === "PENDING" && (
                            <>
                              <button
                                className="btn btn-sm btn-success btn-square tooltip tooltip-left"
                                data-tip="Approve Participant"
                                onClick={() =>
                                  handleReviewParticipant(
                                    participant.id,
                                    PARTICIPANT_REVIEW_ACTIONS.APPROVE
                                  )
                                }
                                disabled={actionLoading === participant.id}
                              >
                                {actionLoading === participant.id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <CheckIcon className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-error btn-square tooltip tooltip-left"
                                data-tip="Reject Participant"
                                onClick={() =>
                                  handleReviewParticipant(
                                    participant.id,
                                    PARTICIPANT_REVIEW_ACTIONS.REJECT
                                  )
                                }
                                disabled={actionLoading === participant.id}
                              >
                                {actionLoading === participant.id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <RejectIcon className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-action sticky bottom-0 bg-base-100 pt-4">
            <button onClick={onClose} className="btn btn-ghost">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Participant Details Modal */}
      <ViewParticipantModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedParticipant(null);
        }}
        participant={selectedParticipant}
      />
    </>
  );
}