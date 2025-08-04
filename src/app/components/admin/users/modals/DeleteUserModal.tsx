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
  reviewedBy: string | null; // ✅ Fixed: Changed from optional to string | null
}

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean; // ✅ Add loading prop
  // ❌ Remove action prop - not needed for delete modal
}

const DeleteUserModal = ({
  isOpen,
  user,
  onClose,
  onConfirm,
  loading = false,
}: DeleteUserModalProps) => {
  if (!isOpen || !user) return null;

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
        <h3 className="font-bold text-lg text-error">Delete User</h3>
        <p className="py-4">
          Are you sure you want to permanently delete{" "}
          <strong>{user.name || user.email}</strong>?
          <span className="block mt-2 text-error text-sm">
            ⚠️ This action cannot be undone. All user data will be permanently
            removed.
          </span>
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
              <strong>Status:</strong> {user.status}
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
            className="btn btn-error"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete User"
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

export default DeleteUserModal;
