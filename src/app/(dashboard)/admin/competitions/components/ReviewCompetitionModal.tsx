"use client";
/* eslint-disable react/no-unescaped-entities */
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Competition } from "@/types/competition";

interface ReviewCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  competition: Competition | null;
  action: "ACCEPT" | "REJECT";
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
  if (!isOpen || !competition) return null;

  const isAccept = action === "ACCEPT";

  const handleConfirm = async () => {
    if (!loading) {
      if (!isAccept && !rejectionReason.trim()) {
        alert("Please provide a rejection reason");
        return;
      }
      await onConfirm();
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-4">
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

        <div className="mb-6">
          {isAccept ? (
            <div className="alert alert-success">
              <CheckIcon className="w-6 h-6" />
              <div>
                <p className="font-medium">Confirm Acceptance</p>
                <p className="text-sm">
                  Are you sure you want to accept "{competition.name}"? This will
                  make it visible to users.
                </p>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <div>
                <p className="font-medium">Confirm Rejection</p>
                <p className="text-sm">
                  Please provide a reason for rejecting "{competition.name}".
                </p>
              </div>
            </div>
          )}
        </div>

        {!isAccept && (
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">
                Rejection Reason <span className="text-error">*</span>
              </span>
              <span className="label-text-alt text-base-content/60">
                {rejectionReason.length}/500
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder="Please explain why this competition is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              maxLength={500}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                This reason will be sent to the submitter
              </span>
            </label>
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`btn ${isAccept ? "btn-success" : "btn-error"}`}
            onClick={handleConfirm}
            disabled={loading || (!isAccept && !rejectionReason.trim())}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : isAccept ? (
              <>
                <CheckIcon className="w-5 h-5" />
                Accept Competition
              </>
            ) : (
              <>
                <XMarkIcon className="w-5 h-5" />
                Reject Competition
              </>
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose} disabled={loading}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ReviewCompetitionModal;