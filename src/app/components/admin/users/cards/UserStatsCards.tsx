"use client";

interface UserStatusCounts {
  total: number;
  inactive: number;
  active: number;
  banned: number;
}

interface UserStatsCardsProps {
  statusCounts: UserStatusCounts;
}

const UserStatsCards = ({ statusCounts }: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Total Users</div>
        <div className="stat-value text-primary">{statusCounts.total}</div>
        <div className="stat-desc">All registered users</div>
      </div>

      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Inactive</div>
        <div className="stat-value text-warning">{statusCounts.inactive}</div>
        <div className="stat-desc">⚠️ Needs review</div>
      </div>

      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Active</div>
        <div className="stat-value text-success">{statusCounts.active}</div>
        <div className="stat-desc">✅ Approved users</div>
      </div>

      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-title">Banned</div>
        <div className="stat-value text-error">{statusCounts.banned}</div>
        <div className="stat-desc">❌ Banned users</div>
      </div>
    </div>
  );
};

export default UserStatsCards;
