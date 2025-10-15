export type NotificationType =
  | 'COMPETITION_SUBMITTED'
  | 'COMPETITION_ACCEPTED'
  | 'COMPETITION_REJECTED'
  | 'PARTICIPANT_SUBMITTED'
  | 'PARTICIPANT_APPROVED'
  | 'PARTICIPANT_REJECTED'
  | 'BADGE_EARNED'
  | 'AWARD_RECEIVED'
  | 'NEW_USER_REGISTERED'
  | 'FEEDBACK_SUBMITTED';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: number | null;
  isRead: boolean;
  createdAt: string;
  relatedData?: {
    competition?: {
      id: number;
      name: string;
      status: string;
      eventDate: string;
      location: string | null;
      competitionType?: string;
      rivalryType?: string;
      level?: string;
      logoUrl: string | null;
      rejectionReason?: string | null;
    };
    participant?: {
      id: number;
      status: string;
      cosplayTitle: string | null;
      characterName: string | null;
      seriesName: string | null;
      submittedAt: string;
      reviewedAt: string | null;
    };
    badge?: {
      id: number;
      name: string;
      description: string;
      iconUrl: string;
      type: string;
    };
    award?: {
      id: number;
      title: string;
      description: string | null;
      category: string | null;
      competition: {
        id: number;
        name: string;
        eventDate: string;
      };
    };
  };
}

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}