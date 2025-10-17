// Update: src/types/notification.ts
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType; // ✅ Updated
  title: string;
  message: string;
  data?: string;
  isRead: boolean;
  relatedId?: number | null;
  createdAt: string;
  updatedAt: string;
}

// ✅ Add blog-related notification types
export type NotificationType =
  | "COMPETITION_SUBMITTED"
  | "COMPETITION_ACCEPTED"
  | "COMPETITION_REJECTED"
  | "PARTICIPANT_APPROVED"
  | "BADGE_EARNED"
  | "BLOG_LIKE" // ✅ NEW
  | "BLOG_COMMENT" // ✅ NEW
  | "BLOG_COMMENT_REPLY" // ✅ NEW
  | "BLOG_PUBLISHED"; // ✅ NEW

export interface NotificationData {
  competitionId?: number;
  competitionName?: string;
  badgeId?: number;
  badgeName?: string;
  blogId?: number; // ✅ NEW
  blogSlug?: string; // ✅ NEW
  blogTitle?: string; // ✅ NEW
  commentId?: number; // ✅ NEW
  commenterName?: string; // ✅ NEW
  [key: string]: any;
}

export interface CreateNotificationData {
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  relatedId?: number;
}

// ✅ Add blog notification helpers
export interface BlogNotificationData extends NotificationData {
  blogId: number;
  blogSlug: string;
  blogTitle: string;
  commentId?: number;
  commenterName?: string;
}