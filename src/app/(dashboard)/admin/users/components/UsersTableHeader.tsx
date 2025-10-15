import { UserPlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { UserStatus } from "@/types/admin";

interface Props {
  selectedStatus: UserStatus | "ALL";
  onStatusChange: (status: UserStatus | "ALL") => void;
  onAddUser: () => void;
  actionLoading: boolean;
}

export default function UsersTableHeader({
  selectedStatus,
  onStatusChange,
  onAddUser,
  actionLoading,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-base-content/70">
          Review and manage user registrations
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={onAddUser}
          disabled={actionLoading}
        >
          <UserPlusIcon className="w-4 h-4" />
          Add New User
        </button>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline">
            <FunnelIcon className="w-4 h-4" />
            Filter: {selectedStatus === "ALL" ? "All Users" : selectedStatus}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <a onClick={() => onStatusChange("ALL")}>All Users</a>
            </li>
            <li>
              <a onClick={() => onStatusChange("INACTIVE")}>Inactive</a>
            </li>
            <li>
              <a onClick={() => onStatusChange("ACTIVE")}>Active</a>
            </li>
            <li>
              <a onClick={() => onStatusChange("BANNED")}>Banned</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}