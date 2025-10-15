import { CheckCircleIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { User } from "@/types/admin";

interface Props {
  isOpen: boolean;
  user: User | null;
  action: "APPROVE" | "BAN" | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function ReviewUserModal({ isOpen, user, action, onClose, onConfirm, loading }: Props) {
  if (!isOpen || !user || !action) return null;

  const isApprove = action === "APPROVE";

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-4 mb-4">
          {isApprove ? (
            <CheckCircleIcon className="w-12 h-12 text-success" />
          ) : (
            <NoSymbolIcon className="w-12 h-12 text-error" />
          )}
          <div>
            <h3 className="font-bold text-lg">
              {isApprove ? "Approve User" : "Ban User"}
            </h3>
            <p className="text-sm text-base-content/70">
              {isApprove ? "Grant access to the platform" : "Restrict user access"}
            </p>
          </div>
        </div>

        <div className={`${isApprove ? "bg-success/10" : "bg-error/10"} p-4 rounded-lg mb-4`}>
          <p className="text-sm">
            Are you sure you want to {isApprove ? "approve" : "ban"}{" "}
            <strong>{user.name || user.email}</strong>?
          </p>
          {isApprove ? (
            <p className="text-sm mt-2 text-base-content/70">
              The user will be granted access to the platform and can log in.
            </p>
          ) : (
            <p className="text-sm mt-2 text-base-content/70">
              The user will be banned and won&apos;t be able to access the platform.
            </p>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`btn ${isApprove ? "btn-success" : "btn-error"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : isApprove ? (
              "Approve User"
            ) : (
              "Ban User"
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}