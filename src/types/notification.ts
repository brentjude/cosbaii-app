// Update: src/types/notification.ts
export interface Notification {
  id: number;
  userId: number;
  type: 'COMPETITION_SUBMITTED' | 'COMPETITION_APPROVED' | 'COMPETITION_REJECTED' | 'CREDENTIAL_VERIFIED';
  title: string;
  message: string;
  data?: string | null; // JSON string for additional data
  isRead: boolean; // ✅ Fixed: Changed from 'read' to 'isRead'
  relatedId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionNotificationData {
  competitionId: number;
  competitionName: string;
  submittedBy?: string;
}