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

interface ViewUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

const ViewUserModal = ({ isOpen, user, onClose }: ViewUserModalProps) => {
  if (!isOpen || !user) return null;

  /** Get badge CSS class for user status */
  const getStatusBadge = (status: User["status"]): string => {
    const badges = {
      INACTIVE: "badge badge-warning",
      ACTIVE: "badge badge-success",
      BANNED: "badge badge-error",
    };
    return badges[status];
  };

  /** Get badge CSS class for user role */
  const getRoleBadge = (role: User["role"]): string => {
    const badges = {
      USER: "badge badge-outline",
      MODERATOR: "badge badge-info",
      ADMIN: "badge badge-secondary",
    };
    return badges[role];
  };

  /** Format date string for display with error handling */
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">User Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              {user.name || "No name provided"}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Username</span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              {user.username ? `@${user.username}` : "No username"}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <div className="p-3 bg-base-200 rounded">{user.email}</div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Role</span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              <span className={getRoleBadge(user.role)}>{user.role}</span>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Status</span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              <span className={getStatusBadge(user.status)}>{user.status}</span>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">
                Registration Date
              </span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              {formatDate(user.createdAt)}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Last Updated</span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              {formatDate(user.updatedAt)}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Reviewed By</span>
            </label>
            <div className="p-3 bg-base-200 rounded">
              {user.reviewedBy || "Not reviewed"}
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ViewUserModal;
