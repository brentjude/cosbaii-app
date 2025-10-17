"use client";

import { useState } from 'react';
import { useBadges } from '@/hooks/user/useBadges';
import BadgeCard from './BadgeCard';
import { TrophyIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 6;

const BadgeSection: React.FC = () => {
  const { progress, loading, error } = useBadges();
  
  const [earnedPage, setEarnedPage] = useState(1);
  const [availablePage, setAvailablePage] = useState(1);

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

  // Pagination calculations for earned badges
  const earnedTotalPages = Math.ceil(earnedBadges.length / ITEMS_PER_PAGE);
  const earnedStartIndex = (earnedPage - 1) * ITEMS_PER_PAGE;
  const earnedEndIndex = earnedStartIndex + ITEMS_PER_PAGE;
  const earnedPaginatedBadges = earnedBadges.slice(earnedStartIndex, earnedEndIndex);

  // Pagination calculations for available badges
  const availableTotalPages = Math.ceil(unEarnedBadges.length / ITEMS_PER_PAGE);
  const availableStartIndex = (availablePage - 1) * ITEMS_PER_PAGE;
  const availableEndIndex = availableStartIndex + ITEMS_PER_PAGE;
  const availablePaginatedBadges = unEarnedBadges.slice(availableStartIndex, availableEndIndex);

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Earned Badges ({earnedBadges.length})
            </h3>
            {earnedTotalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEarnedPage(p => Math.max(1, p - 1))}
                  disabled={earnedPage === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {earnedPage} of {earnedTotalPages}
                </span>
                <button
                  onClick={() => setEarnedPage(p => Math.min(earnedTotalPages, p + 1))}
                  disabled={earnedPage === earnedTotalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedPaginatedBadges.map((badgeProgress) => (
              <BadgeCard
                key={badgeProgress.badge.id}
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Badges ({unEarnedBadges.length})
            </h3>
            {availableTotalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAvailablePage(p => Math.max(1, p - 1))}
                  disabled={availablePage === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {availablePage} of {availableTotalPages}
                </span>
                <button
                  onClick={() => setAvailablePage(p => Math.min(availableTotalPages, p + 1))}
                  disabled={availablePage === availableTotalPages}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePaginatedBadges.map((badgeProgress) => (
              <BadgeCard
                key={badgeProgress.badge.id}
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