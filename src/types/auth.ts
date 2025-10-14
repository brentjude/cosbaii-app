// Update: src/types/auth.ts
export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  username: string; // ✅ Make username required
  role?: string;
  image?: string | null;
}

export interface AuthSession {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}