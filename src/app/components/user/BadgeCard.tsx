// Create: src/app/components/user/BadgeCard.tsx
"use client";

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  type: string;
  requirement?: number;
}

interface BadgeCardProps {
  badge: Badge;
  awardedAt?: string;
  currentProgress?: number;
  progressPercentage?: number;
  earned?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  awardedAt,
  currentProgress = 0,
  progressPercentage = 0,
  earned = false
}) => {
  const getBadgeTypeColor = () => {
    switch (badge.type) {
      case 'COMPETITION_MILESTONE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SPECIAL_ACHIEVEMENT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PARTICIPATION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
      earned 
        ? 'bg-white border-green-200 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-75'
    }`}>
      
      {/* Badge Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
          earned ? 'bg-yellow-100' : 'bg-gray-100'
        }`}>
          {badge.iconUrl ? (
            <Image
              src="/images/cosbaii-logo-black.webp"
              alt={badge.name}
              width={32}
              height={32}
              className={`${earned ? '' : 'grayscale'}`}
            />
          ) : (
            <span className="text-2xl">🏆</span>
          )}
          
          {earned && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
            {badge.name}
          </h3>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getBadgeTypeColor()}`}>
            {badge.type.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-sm mb-3 ${earned ? 'text-gray-700' : 'text-gray-500'}`}>
        {badge.description}
      </p>
      
      {/* Progress Bar for Milestone Badges */}
      {badge.requirement && !earned && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{currentProgress} / {badge.requirement}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Awarded Date */}
      {earned && awardedAt && (
        <div className="text-xs text-gray-500">
          Earned {formatDistanceToNow(new Date(awardedAt), { addSuffix: true })}
        </div>
      )}
      
      {/* Status */}
      {!earned && (
        <div className="text-xs text-gray-500 font-medium">
          {badge.requirement ? 'In Progress' : 'Not Earned'}
        </div>
      )}
    </div>
  );
};

export default BadgeCard;