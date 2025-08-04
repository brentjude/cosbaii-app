"use client";

interface User {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
  status: "INACTIVE" | "ACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
}

interface ReviewUserModalProps {
  isOpen: boolean;
  user: User | null;
  action: "APPROVE" | "BAN" | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean; // ✅ Add loading prop
}

const ReviewUserModal = ({
  isOpen,
  user,
  action,
  onClose,
  onConfirm,
  loading = false,
}: ReviewUserModalProps) => {
  if (!isOpen || !user || !action) return null;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {action === "APPROVE" ? "Approve User" : "Ban User"}
        </h3>
        <p className="py-4">
          Are you sure you want to {action.toLowerCase()}{" "}
          <strong>{user.name || user.email}</strong>?
          {action === "APPROVE" && (
            <span className="block mt-2 text-success text-sm">
              ✅ This user will gain access to the platform and can participate
              in competitions.
            </span>
          )}
          {action === "BAN" && (
            <span className="block mt-2 text-error text-sm">
              ❌ This user will be banned and cannot access the platform.
            </span>
          )}
        </p>

        {/* User details for confirmation */}
        <div className="bg-base-200 p-3 rounded-md mb-4">
          <div className="text-sm">
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            {user.username && (
              <div>
                <strong>Username:</strong> @{user.username}
              </div>
            )}
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Current Status:</strong> {user.status}
            </div>
            <div>
              <strong>Registered:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`btn ${
              action === "APPROVE" ? "btn-success" : "btn-error"
            }`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {action === "APPROVE" ? "Approving..." : "Banning..."}
              </>
            ) : action === "APPROVE" ? (
              "Approve User"
            ) : (
              "Ban User"
            )}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose} disabled={loading}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ReviewUserModal;
