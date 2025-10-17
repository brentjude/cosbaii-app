import { UserRole, UserStatus } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      username?: string | null;
      status?: UserStatus;
      emailVerified?: boolean;
      displayName?: string | null;
      profilePicture?: string | null;
      reviewed?: boolean;
      isPremiumUser?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: UserRole;
    username?: string | null;
    status?: UserStatus;
    emailVerified?: boolean | Date | null;
    displayName?: string | null;
    profilePicture?: string | null;
    reviewed?: boolean;
    isPremiumUser?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    username?: string | null;
    status?: UserStatus;
    emailVerified?: boolean;
    displayName?: string | null;
    profilePicture?: string | null;
    reviewed?: boolean;
    isPremiumUser?: boolean;
  }
}