// src/types/user.ts
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
  reviewedBy: string | null;
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
  inactive: number;
  active: number;
  banned: number;
}