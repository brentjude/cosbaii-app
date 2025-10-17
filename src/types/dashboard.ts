export interface DashboardStats {
  badgesCount: number;
  likesCount: number;
  followingCount: number;
}

export interface DashboardProps {
  initialStats?: DashboardStats;
}