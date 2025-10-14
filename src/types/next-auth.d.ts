import { DefaultSession } from "next-auth";
import { UserRole, UserStatus } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    username?: string | null;
    status: UserStatus;
    emailVerified: boolean; // ✅ This must be here
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      username?: string | null;
      status: UserStatus;
      emailVerified: boolean; // ✅ This must be here
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    username?: string | null;
    status: UserStatus;
    emailVerified: boolean; // ✅ This must be here
  }
}