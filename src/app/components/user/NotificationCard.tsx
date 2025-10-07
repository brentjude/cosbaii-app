// Create: src/app/components/user/NotificationCard.tsx
"use client";

import { useState } from 'react';
import { Notification } from '@/types/notification';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const [isRead, setIsRead] = useState(notification.isRead);

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'COMPETITION_SUBMITTED':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'COMPETITION_APPROVED':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'COMPETITION_REJECTED':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'CREDENTIAL_VERIFIED':
        return <TrophyIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'COMPETITION_SUBMITTED':
        return 'border-l-yellow-400 bg-yellow-50';
      case 'COMPETITION_APPROVED':
        return 'border-l-green-400 bg-green-50';
      case 'COMPETITION_REJECTED':
        return 'border-l-red-400 bg-red-50';
      case 'CREDENTIAL_VERIFIED':
        return 'border-l-blue-400 bg-blue-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const handleMarkAsRead = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
      setIsRead(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`p-4 border-l-4 rounded-lg transition-all duration-200 hover:shadow-md ${
        getNotificationColor()
      } ${isRead ? 'opacity-75' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium text-sm ${
                isRead ? 'text-gray-600' : 'text-gray-900'
              }`}>
                {notification.title}
              </h4>
              {!isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
            
            <p className={`text-sm leading-relaxed ${
              isRead ? 'text-gray-500' : 'text-gray-700'
            }`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {formatDate(notification.createdAt)}
              </span>
              
              {!isRead && onMarkAsRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  title="Mark as read"
                >
                  <EyeIcon className="w-3 h-3" />
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;