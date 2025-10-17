// Update: src/app/(dashboard)/admin/users/components/UserTableRow.tsx
import { User } from "@/types/admin";
import {
  getStatusBadge,
  getRoleBadge,
  formatRegistrationDate,
} from "@/lib/admin/userUtils";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  user: User;
  actionLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onReview: (user: User, action: "APPROVE" | "BAN") => void;
}

export default function UserTableRow({
  user,
  actionLoading,
  onView,
  onEdit,
  onDelete,
  onReview,
}: Props) {
  return (
    <tr className="hover">
      <td>
        <div className="flex items-center gap-3">
          <div>
            <div className="font-bold">{user.name || "No name"}</div>
            {user.isPremiumUser && (
              <span className="badge badge-warning badge-xs">Premium</span>
            )}
          </div>
        </div>
      </td>
      <td>{user.username ? `@${user.username}` : "No username"}</td>
      <td>{user.email}</td>
      <td>
        <span className={getRoleBadge(user.role)}>{user.role}</span>
      </td>
      <td>
        <span className={getStatusBadge(user.status)}>{user.status}</span>
      </td>
      {/* ✅ NEW: Reviewed column */}
      <td>
        {user.reviewed ? (
          <div className="flex items-center gap-1 text-success">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-xs">Yes</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-error">
            <XCircleIcon className="w-4 h-4" />
            <span className="text-xs">No</span>
          </div>
        )}
      </td>
      <td>
        <span className="text-sm">{formatRegistrationDate(user.createdAt)}</span>
      </td>
      <td>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => onView(user)}
            title="View"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => onEdit(user)}
            disabled={actionLoading}
            title="Edit"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            className="btn btn-ghost btn-xs text-error"
            onClick={() => onDelete(user)}
            disabled={actionLoading}
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          {user.status === "INACTIVE" && (
            <>
              <button
                className="btn btn-ghost btn-xs text-success"
                onClick={() => onReview(user, "APPROVE")}
                disabled={actionLoading}
                title="Approve"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                className="btn btn-ghost btn-xs text-error"
                onClick={() => onReview(user, "BAN")}
                disabled={actionLoading}
                title="Ban"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}