// Update: src/app/components/user/BadgeSection.tsx
"use client";

import { useBadges } from '@/hooks/user/useBadges';
import BadgeCard from './BadgeCard';
import { TrophyIcon } from '@heroicons/react/24/outline';

const BadgeSection: React.FC = () => {
  const { progress, loading, error } = useBadges(); // ✅ Removed unused 'badges'

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Badges</h2>
        <p className="text-red-600">Error loading badges: {error}</p>
      </div>
    );
  }

  const earnedBadges = progress.filter(p => p.earned);
  const unEarnedBadges = progress.filter(p => !p.earned);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrophyIcon className="w-6 h-6 text-yellow-500" />
          Badges
        </h2>
        <div className="text-sm text-gray-600">
          {earnedBadges.length} / {progress.length} earned
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badgeProgress) => (
              <BadgeCard
                key={badgeProgress.badge.name}
                badge={badgeProgress.badge}
                awardedAt={badgeProgress.awardedAt ?? undefined}
                earned={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {unEarnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Available Badges ({unEarnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unEarnedBadges.map((badgeProgress) => (
              <BadgeCard
                key={badgeProgress.badge.name}
                badge={badgeProgress.badge}
                currentProgress={badgeProgress.currentProgress}
                progressPercentage={badgeProgress.progressPercentage}
                earned={false}
              />
            ))}
          </div>
        </div>
      )}

      {progress.length === 0 && (
        <div className="text-center py-8">
          <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No badges available yet.</p>
        </div>
      )}
    </div>
  );
};

export default BadgeSection;