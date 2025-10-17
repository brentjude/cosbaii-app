export type UserStatus = "INACTIVE" | "ACTIVE" | "BANNED";
export type UserRole = "USER" | "ADMIN" | "MODERATOR";

export interface User {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy: string | null | undefined; // ✅ Allow undefined
}

export interface NewUserData {
  name: string | null;
  email: string;
  username: string | null;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalCompetitions: number;
  pendingCompetitions: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalFeedback: number;
  pendingFeedback: number;
}

export interface AdminUser extends User {
  profile?: {
    displayName: string | null;
    profilePicture: string | null;
  };
  _count: {
    competitions: number;
    blogs: number;
    feedback: number;
  };
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: AdminUser[];
  recentCompetitions: any[];
  recentBlogs: any[];
  recentFeedback: any[];
}