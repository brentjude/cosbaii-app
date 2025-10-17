"use client";

import StatCard from "./StatCard";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";

interface StatsGridProps {
  badgesCount: number;
  likesCount: number;
  followingCount: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  badgesCount,
  likesCount,
  followingCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        icon={<CheckBadgeIcon className="w-6 h-6" />}
        label="Badges Earned"
        value={badgesCount}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        }
        label="Likes"
        value={likesCount}
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />

      <StatCard
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        label="Following"
        value={followingCount}
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
    </div>
  );
};

export default StatsGrid;