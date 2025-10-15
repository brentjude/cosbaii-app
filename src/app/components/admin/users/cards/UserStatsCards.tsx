import { UserGroupIcon, CheckCircleIcon, ClockIcon, NoSymbolIcon } from "@heroicons/react/24/outline";
import { UserStats } from "@/types/admin";

interface Props {
  statusCounts: UserStats;
}

export default function UserStatsCards({ statusCounts }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="stat bg-base-100 shadow-xl rounded-box border border-base-300">
        <div className="stat-figure text-primary">
          <UserGroupIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Users</div>
        <div className="stat-value text-primary">{statusCounts.total}</div>
        <div className="stat-desc">All registered users</div>
      </div>

      <div className="stat bg-base-100 shadow-xl rounded-box border border-base-300">
        <div className="stat-figure text-success">
          <CheckCircleIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Active Users</div>
        <div className="stat-value text-success">{statusCounts.active}</div>
        <div className="stat-desc">Verified and active</div>
      </div>

      <div className="stat bg-base-100 shadow-xl rounded-box border border-base-300">
        <div className="stat-figure text-warning">
          <ClockIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Pending Review</div>
        <div className="stat-value text-warning">{statusCounts.inactive}</div>
        <div className="stat-desc">Awaiting approval</div>
      </div>

      <div className="stat bg-base-100 shadow-xl rounded-box border border-base-300">
        <div className="stat-figure text-error">
          <NoSymbolIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Banned Users</div>
        <div className="stat-value text-error">{statusCounts.banned}</div>
        <div className="stat-desc">Access restricted</div>
      </div>
    </div>
  );
}