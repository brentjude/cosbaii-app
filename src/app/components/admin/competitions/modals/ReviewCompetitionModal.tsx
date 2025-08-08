// src/app/components/admin/competitions/modals/ReviewCompetitionModal.tsx
"use client";

import {
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// ✅ Add missing types
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
  // ✅ Add missing new fields
  competitionType: CompetitionType;
  rivalryType: RivalryType;
  level: CompetitionLevel;
  // ✅ NEW: Logo and reference links
  logoUrl: string | null;
  eventUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  referenceLinks: string | null;
  submittedBy: {
    name: string | null;
    email: string;
    role: string;
  };
}

interface ReviewCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  competition: Competition | null;
  action: "ACCEPT" | "REJECT" | null;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  loading?: boolean;
}

const ReviewCompetitionModal = ({
  isOpen,
  onClose,
  onConfirm,
  competition,
  action,
  rejectionReason,
  setRejectionReason,
  loading = false,
}: ReviewCompetitionModalProps) => {
  if (!isOpen || !competition || !action) return null;

  const isAccept = action === "ACCEPT";
  const canConfirm =
    isAccept || (action === "REJECT" && rejectionReason.trim());

  // ✅ Helper function to format enum values for display
  const formatEnumValue = (value: string) => {
    return value.charAt(0) + value.slice(1).toLowerCase().replace("_", " ");
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">
            {isAccept ? "Accept Competition" : "Reject Competition"}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`alert ${
            isAccept ? "alert-success" : "alert-warning"
          } mb-4`}
        >
          {isAccept ? (
            <CheckIcon className="w-6 h-6" />
          ) : (
            <ExclamationTriangleIcon className="w-6 h-6" />
          )}
          <div>
            <p className="font-medium">
              Are you sure you want to {action.toLowerCase()} this competition?
            </p>
          </div>
        </div>

        {/* Competition Info */}
        <div className="bg-base-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-lg">{competition.name}</h4>

          {/* Show new competition details with badges */}
          <div className="flex gap-2 mt-2 mb-3">
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

          <div className="text-sm text-base-content/70 mt-2 space-y-1">
            <p>
              <span className="font-medium">Event Date:</span>{" "}
              {new Date(competition.eventDate).toLocaleDateString()}
            </p>
            {competition.location && (
              <p>
                <span className="font-medium">Location:</span>{" "}
                {competition.location}
              </p>
            )}
            {competition.organizer && (
              <p>
                <span className="font-medium">Organizer:</span>{" "}
                {competition.organizer}
              </p>
            )}
            <p>
              <span className="font-medium">Submitted By:</span>{" "}
              {competition.submittedBy.name || competition.submittedBy.email}
            </p>
            <p>
              <span className="font-medium">Submitter Role:</span>{" "}
              <span
                className={`badge badge-xs ${
                  competition.submittedBy.role === "ADMIN"
                    ? "badge-primary"
                    : competition.submittedBy.role === "MODERATOR"
                    ? "badge-secondary"
                    : "badge-ghost"
                }`}
              >
                {competition.submittedBy.role}
              </span>
            </p>
          </div>

          {competition.description && (
            <div className="mt-3">
              <p className="font-medium text-sm">Description:</p>
              <p className="text-sm text-base-content/80">
                {competition.description}
              </p>
            </div>
          )}

          {/* ✅ NEW: Show reference links for verification */}
          {(competition.logoUrl ||
            competition.eventUrl ||
            competition.facebookUrl ||
            competition.instagramUrl ||
            competition.referenceLinks) && (
            <div className="mt-4 border-t pt-3">
              <p className="font-medium text-sm mb-2 flex items-center gap-1">
                🔗 Reference Links for Verification:
              </p>
              <div className="space-y-1">
                {competition.logoUrl && (
                  <div>
                    <a
                      href={competition.logoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm hover:link-hover"
                    >
                      🖼️ Competition Logo/Poster
                    </a>
                  </div>
                )}
                {competition.eventUrl && (
                  <div>
                    <a
                      href={competition.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm hover:link-hover"
                    >
                      🌐 Official Event Page
                    </a>
                  </div>
                )}
                {competition.facebookUrl && (
                  <div>
                    <a
                      href={competition.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm hover:link-hover"
                    >
                      📘 Facebook Page/Event
                    </a>
                  </div>
                )}
                {competition.instagramUrl && (
                  <div>
                    <a
                      href={competition.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary text-sm hover:link-hover"
                    >
                      📷 Instagram Page
                    </a>
                  </div>
                )}
                {competition.referenceLinks && (
                  <div className="mt-2">
                    <p className="text-xs text-base-content/70 mb-1">
                      Additional References:
                    </p>
                    <div className="text-xs bg-base-300 p-2 rounded max-h-20 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-mono">
                        {competition.referenceLinks}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Rejection Reason (only for REJECT action) */}
        {action === "REJECT" && (
          <div className="mb-4">
            <label className="label">
              <span className="label-text font-medium">
                Rejection Reason <span className="text-error">*</span>
              </span>
              <span className="label-text-alt text-base-content/60">
                {rejectionReason.length}/500
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              maxLength={500}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                This reason will be sent to the competition submitter.
              </span>
            </label>
          </div>
        )}

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`btn ${isAccept ? "btn-success" : "btn-error"}`}
            onClick={onConfirm}
            disabled={loading || !canConfirm}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {isAccept ? "Accepting..." : "Rejecting..."}
              </>
            ) : (
              `${action.charAt(0)}${action.slice(1).toLowerCase()} Competition`
            )}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose} disabled={loading}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ReviewCompetitionModal;
