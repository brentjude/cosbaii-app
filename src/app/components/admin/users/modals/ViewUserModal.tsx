// Update: src/app/components/admin/users/modals/ViewUserModal.tsx
import { User } from "@/types/admin";
import {
  getStatusBadge,
  getRoleBadge,
  formatRegistrationDate,
  formatTime,
} from "@/lib/admin/userUtils";
import { CheckBadgeIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export default function ViewUserModal({ isOpen, user, onClose }: Props) {
  if (!isOpen || !user) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">User Details</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Name</span>
              </label>
              <p className="text-base">{user.name || "No name"}</p>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <p className="text-base">{user.username ? `@${user.username}` : "No username"}</p>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold">Email</span>
            </label>
            <p className="text-base">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Role</span>
              </label>
              <span className={getRoleBadge(user.role)}>{user.role}</span>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Status</span>
              </label>
              <span className={getStatusBadge(user.status)}>{user.status}</span>
            </div>
          </div>

          {/* ✅ Premium User Status */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Account Type</span>
            </label>
            <div className="flex items-center gap-2">
              {user.isPremiumUser ? (
                <>
                  <div className="badge badge-warning badge-lg gap-2">
                    <CheckBadgeIcon className="w-4 h-4" />
                    Premium User
                  </div>
                  <span className="text-xs text-gray-500">
                    Has access to premium features
                  </span>
                </>
              ) : (
                <>
                  <div className="badge badge-ghost badge-lg">
                    Standard User
                  </div>
                  <span className="text-xs text-gray-500">
                    Basic features only
                  </span>
                </>
              )}
            </div>
          </div>

          {/* ✅ NEW: Review Status */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Review Status</span>
            </label>
            <div className="flex items-center gap-2">
              {user.reviewed ? (
                <>
                  <div className="badge badge-success badge-lg gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Reviewed
                  </div>
                  <span className="text-xs text-gray-500">
                    Profile has been reviewed by admin
                  </span>
                </>
              ) : (
                <>
                  <div className="badge badge-error badge-lg gap-2">
                    <XCircleIcon className="w-4 h-4" />
                    Not Reviewed
                  </div>
                  <span className="text-xs text-gray-500">
                    Awaiting admin review
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Registration Date</span>
              </label>
              <p className="text-sm">
                {formatRegistrationDate(user.createdAt)}
                <span className="text-xs text-base-content/60 ml-2">
                  {formatTime(user.createdAt)}
                </span>
              </p>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">Last Updated</span>
              </label>
              <p className="text-sm">
                {formatRegistrationDate(user.updatedAt)}
                <span className="text-xs text-base-content/60 ml-2">
                  {formatTime(user.updatedAt)}
                </span>
              </p>
            </div>
          </div>

          {user.reviewedBy && (
            <div>
              <label className="label">
                <span className="label-text font-semibold">Reviewed By</span>
              </label>
              <p className="text-base">{user.reviewedBy}</p>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}