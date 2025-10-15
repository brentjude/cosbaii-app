import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { User } from "@/types/admin";
import {
  getStatusBadge,
  getStatusIcon,
  getRoleBadge,
  formatRegistrationDate,
  formatTime,
  getStatusRowClass,
} from "@/lib/admin/userUtils";

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
    <tr className={getStatusRowClass(user.status)}>
      <td>
        <div className="font-bold">{user.name || "No name"}</div>
      </td>

      <td>
        <div className="font-medium">
          {user.username ? `@${user.username}` : "No username"}
        </div>
      </td>

      <td>
        <div className="text-sm">{user.email}</div>
      </td>

      <td>
        <span className={getRoleBadge(user.role)}>{user.role}</span>
      </td>

      <td>
        <div className="flex items-center gap-2">
          {getStatusIcon(user.status)}
          <span className={getStatusBadge(user.status)}>{user.status}</span>
        </div>
      </td>

      <td>
        <div className="text-sm">
          <div className="font-medium">
            {formatRegistrationDate(user.createdAt)}
          </div>
          <div className="text-xs text-base-content/60">
            {formatTime(user.createdAt)}
          </div>
        </div>
      </td>

      <td>
        {user.reviewedBy ? (
          <div className="text-sm">
            <div className="font-medium text-base-content/70">
              {user.reviewedBy}
            </div>
            <div className="text-xs text-base-content/50">
              {formatRegistrationDate(user.updatedAt)}
            </div>
          </div>
        ) : (
          <span className="text-sm text-base-content/50 italic">
            Not reviewed
          </span>
        )}
      </td>

      <td>
        <div className="flex gap-1">
          {user.status === "INACTIVE" && (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={() => onReview(user, "APPROVE")}
                title="Approve User"
                disabled={actionLoading}
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => onReview(user, "BAN")}
                title="Ban User"
                disabled={actionLoading}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-info btn-outline"
            onClick={() => onView(user)}
            title="View User Details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>

          <button
            className="btn btn-sm btn-ghost"
            onClick={() => onEdit(user)}
            title="Edit User"
          >
            <PencilIcon className="w-4 h-4" />
          </button>

          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={() => onDelete(user)}
            title="Delete User"
            disabled={actionLoading}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}