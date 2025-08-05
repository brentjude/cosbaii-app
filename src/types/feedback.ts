// src/types/feedback.ts
export type FeedbackType = "BUG" | "FEATURE_REQUEST" | "IMPROVEMENT";
export type FeedbackStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
export type FeedbackPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Feedback {
  id: number;
  userId: number;
  type: FeedbackType;
  title: string;
  description: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string | null;
    email: string;
    username: string | null;
  };
}

export interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
}

export interface CreateFeedbackResponse {
  success: boolean;
  feedback?: Feedback;
  message: string;
}