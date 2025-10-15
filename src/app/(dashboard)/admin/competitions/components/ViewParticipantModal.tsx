"use client";

import { XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { CompetitionParticipant } from "@/types/competition";
import { formatDateTime } from "@/utils/competition";

interface ViewParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: CompetitionParticipant | null;
}

const ViewParticipantModal = ({
  isOpen,
  onClose,
  participant,
}: ViewParticipantModalProps) => {
  if (!isOpen || !participant) return null;

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

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Participant Details</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                User Information
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <Image
                      src={
                        participant.user.profile?.profilePicture ||
                        "/images/default-avatar.png"
                      }
                      alt={
                        participant.user.profile?.displayName || "User"
                      }
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {participant.user.profile?.displayName ||
                      participant.user.name}
                  </p>
                  <p className="text-sm text-base-content/70">
                    @{participant.user.username || "no-username"}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {participant.user.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`/profile/${participant.user.username || participant.user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>

          {/* Cosplay Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-semibold text-primary mb-3">
                Cosplay Information
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {participant.cosplayTitle && (
                  <div>
                    <label className="text-xs font-semibold text-base-content/70">
                      Cosplay Title
                    </label>
                    <p className="font-medium">{participant.cosplayTitle}</p>
                  </div>
                )}
                {participant.characterName && (
                  <div>
                    <label className="text-xs font-semibold text-base-content/70">
                      Character Name
                    </label>
                    <p className="font-medium">{participant.characterName}</p>
                  </div>
                )}
                {participant.seriesName && (
                  <div>
                    <label className="text-xs font-semibold text-base-content/70">
                      Series Name
                    </label>
                    <p className="font-medium">{participant.seriesName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status & Dates */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="font-semibold text-primary mb-3">
                Status & Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  {getStatusBadge(participant.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Submitted:</span>
                  <span className="text-sm font-medium">
                    {formatDateTime(participant.submittedAt)}
                  </span>
                </div>
                {participant.reviewedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviewed:</span>
                    <span className="text-sm font-medium">
                      {formatDateTime(participant.reviewedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ViewParticipantModal;