import {
  TrophyIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CompetitionStats } from "@/types/competition";

interface StatsCardsProps {
  stats: CompetitionStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-figure text-primary">
          <TrophyIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Total Competitions</div>
        <div className="stat-value text-primary">{stats.total}</div>
      </div>

      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-figure text-warning">
          <ClockIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Pending Review</div>
        <div className="stat-value text-warning">{stats.pending}</div>
      </div>

      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-figure text-success">
          <CheckIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Accepted</div>
        <div className="stat-value text-success">{stats.accepted}</div>
      </div>

      <div className="stat bg-base-100 rounded-lg shadow">
        <div className="stat-figure text-error">
          <XMarkIcon className="w-8 h-8" />
        </div>
        <div className="stat-title">Rejected</div>
        <div className="stat-value text-error">{stats.rejected}</div>
      </div>
    </div>
  );
}