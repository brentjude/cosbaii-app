// src/app/components/admin/competitions/modals/DeleteCompetitionModal.tsx
"use client";

import {
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Competition {
  id: number;
  name: string;
  eventDate: string;
  _count: {
    participants: number;
  };
}

interface DeleteCompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  competition: Competition | null;
  loading?: boolean;
}

const DeleteCompetitionModal = ({
  isOpen,
  onClose,
  onConfirm,
  competition,
  loading = false,
}: DeleteCompetitionModalProps) => {
  if (!isOpen || !competition) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-error">Delete Competition</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="alert alert-error mb-4">
          <ExclamationTriangleIcon className="w-6 h-6" />
          <div>
            <p className="font-medium">This action cannot be undone!</p>
            <p className="text-sm">
              All associated data (participants, awards, etc.) will be
              permanently deleted.
            </p>
          </div>
        </div>

        {/* Competition Info */}
        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-lg">{competition.name}</h4>
          <div className="text-sm text-base-content/70 mt-2">
            <p>
              <span className="font-medium">Event Date:</span>{" "}
              {new Date(competition.eventDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Participants:</span>{" "}
              {competition._count.participants}
            </p>
          </div>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-error">
            <TrashIcon className="w-5 h-5" />
            <span className="font-medium">Deletion Warning</span>
          </div>
          <ul className="text-sm text-error/80 mt-2 space-y-1 ml-7">
            <li>• Competition data will be permanently deleted</li>
            <li>• All participant registrations will be removed</li>
            <li>• All awards and results will be lost</li>
            <li>• This action cannot be reversed</li>
          </ul>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                Delete Competition
              </>
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

export default DeleteCompetitionModal;
