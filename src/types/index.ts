// Update: src/types/index.ts
// User-related types
export type {
  User,
  UserWithBlogStats,
  NewUserData,
  UserStats,
  UserStatus,
  UserRole,
} from './user';

// Profile-related types
export type {
  Profile,
  ProfileSetupData,
} from './profile';

// Auth-related types
export type {
  AuthUser,
  AuthSession,
} from './auth';

// Feedback-related types
export type {
  Feedback,
  FeedbackFormData,
  FeedbackType,
  FeedbackStatus,
  FeedbackPriority,
  CreateFeedbackResponse,
} from './feedback';

// Notification-related types
export type {
  Notification,
  NotificationType,
  NotificationData,
  CreateNotificationData,
  BlogNotificationData,
} from './notification';

// Blog-related types
export type {
  Blog,
  BlogWithStats,
  BlogLike,
  BlogComment,
  BlogCommentWithReplies,
  CreateBlogData,
  UpdateBlogData,
  CreateCommentData,
  UpdateCommentData,
  BlogFilters,
  BlogPagination,
  BlogListResponse,
  BlogStats,
  BlogLikeResponse,
  BlogStatsResponse,
  BlogCommentResponse,
  BlogCommentsResponse,
  BlogCategory,
  BlogTag,
  BLOG_TAGS,
} from './blog';

// Blog API types
export type {
  CreateBlogRequest,
  UpdateBlogRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  BlogQueryParams,
  BlogResponse,
  BlogListResponse as ApiBlogListResponse,
  BlogStatsResponse as ApiBlogStatsResponse,
  BlogLikeResponse as ApiBlogLikeResponse,
  BlogCommentsResponse as ApiBlogCommentsResponse,
  BlogCommentResponse as ApiBlogCommentResponse,
  BlogErrorResponse,
} from './api/blog';

// Blog validation types
export type {
  CreateBlogInput,
  UpdateBlogInput,
  CreateCommentInput,
  UpdateCommentInput,
  BlogQueryInput,
} from './validation/blog';

// Competition-related types (if they exist)
export type {
  Competition,
  CompetitionParticipant,
  CompetitionStatus,
  CompetitionType,
  RivalryType,
  CompetitionLevel,
} from './competition';

// Settings-related types (if they exist)
export type {
  UserSettings,
  SettingsFormData,
} from './settings';

// Admin-related types (if they exist)
export type {
  AdminStats,
  AdminUser,
} from './admin';

// Re-export commonly used Prisma types
export type {
  User as PrismaUser,
  Profile as PrismaProfile,
  Competition as PrismaCompetition,
  CompetitionParticipant as PrismaCompetitionParticipant,
  Notification as PrismaNotification,
  Feedback as PrismaFeedback,
  Blog as PrismaBlog,
  BlogLike as PrismaBlogLike,
  BlogComment as PrismaBlogComment,
  Badge as PrismaBadge,
  UserBadge as PrismaUserBadge,
} from "@/generated/prisma";