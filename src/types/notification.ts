// Update: src/types/notification.ts
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
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
  | "BLOG_LIKE"
  | "BLOG_COMMENT"
  | "BLOG_COMMENT_REPLY"
  | "BLOG_PUBLISHED";

// ✅ Fixed: Remove 'any' and use proper type for additional properties
export interface NotificationData {
  competitionId?: number;
  competitionName?: string;
  badgeId?: number;
  badgeName?: string;
  blogId?: number;
  blogSlug?: string;
  blogTitle?: string;
  commentId?: number;
  commenterName?: string;
  // ✅ Use Record<string, unknown> instead of [key: string]: any
  [key: string]: string | number | boolean | undefined;
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