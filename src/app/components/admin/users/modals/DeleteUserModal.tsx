import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { User } from "@/types/admin";

interface Props {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteUserModal({ isOpen, user, onClose, onConfirm, loading }: Props) {
  if (!isOpen || !user) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center gap-4 mb-4">
          <ExclamationTriangleIcon className="w-12 h-12 text-error" />
          <div>
            <h3 className="font-bold text-lg">Delete User</h3>
            <p className="text-sm text-base-content/70">This action cannot be undone</p>
          </div>
        </div>

        <div className="bg-error/10 p-4 rounded-lg mb-4">
          <p className="text-sm">
            Are you sure you want to delete user <strong>{user.name || user.email}</strong>?
          </p>
          <p className="text-sm mt-2 text-base-content/70">
            All user data, including profile information and competition history, will be permanently deleted.
          </p>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : "Delete User"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}