import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

// Session configuration
const secretKey = 'testingsecret';

if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

const encodedKey = new TextEncoder().encode(secretKey);

// Cookie configuration following Next.js best practices
const cookie = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
  },
  duration: 60 * 60 * 24 * 7 * 1000, // 1 week in milliseconds
};

// Session payload interface
export interface SessionPayload {
  userId: string;
  email: string;
  username?: string;
  role: string;
  sub: string; // JWT standard claim for subject
  iat: number; // JWT standard claim for issued at
  exp: number; // JWT standard claim for expiration
}

// Input type for creating sessions
export interface CreateSessionInput {
  userId: string;
  email: string;
  username?: string;
  role: string;
}

/**
 * Encrypt session data using JWT with proper claims
 * @param payload - Session data to encrypt
 * @returns Promise<string> - Encrypted session token
 */
export async function encrypt(payload: CreateSessionInput): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    username: payload.username,
    role: payload.role,
    sub: payload.userId, // Standard JWT subject claim
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + cookie.duration))
    .sign(encodedKey);
}

/**
 * Decrypt session token with proper error handling
 * @param session - Encrypted session token
 * @returns Promise<SessionPayload | null> - Decrypted session data
 */
export async function decrypt(session: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    
    // Validate that the payload contains our expected properties
    if (
      payload &&
      typeof payload === 'object' &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.username === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        username: payload.username,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
        sub: payload.sub
      } as SessionPayload;
    }
    
    console.error('Invalid session payload structure');
    return null;
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

/**
 * Create a new session with improved security
 * @param userId - User ID
 * @param email - User email
 * @param role - User role
 * @param username - User username (optional)
 * @returns Promise<void>
 */
export async function createSession(
  userId: string,
  email: string,
  role: string = 'USER',
  username?: string
): Promise<void> {
  try {
    const session = await encrypt({
      userId,
      email,
      username,
      role,
    });

    const cookieStore = cookies();
    (await cookieStore).set(cookie.name, session, cookie.options);
  } catch (error) {
    console.error('Failed to create session:', error);
    throw new Error('Session creation failed');
  }
}

/**
 * Verify and get current session with improved validation
 * @returns Promise<SessionPayload | null> - Session data or null if invalid
 */
export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get(cookie.name)?.value;

    if (!sessionCookie) {
      return null;
    }

    const session = await decrypt(sessionCookie);
    
    if (!session) {
      // Clear invalid session cookie
      await deleteSession();
      return null;
    }

    // Check if session is expired (JWT should handle this, but double-check)
    if (session.exp && session.exp < Date.now() / 1000) {
      await deleteSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Delete the current session securely
 * @returns Promise<void>
 */
export async function deleteSession(): Promise<void> {
  try {
    const cookieStore = cookies();
    (await cookieStore).set(cookie.name, '', {
      ...cookie.options,
      maxAge: 0, // Immediately expire the cookie
    });
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}

/**
 * Update session with new data and refresh expiration
 * @param updates - Partial session data to update
 * @returns Promise<void>
 */
export async function updateSession(
  updates: Partial<Omit<CreateSessionInput, 'userId'>>
): Promise<void> {
  const currentSession = await verifySession();
  
  if (!currentSession) {
    throw new Error('No active session to update');
  }

  try {
    const updatedSession = await encrypt({
      userId: currentSession.userId,
      email: updates.email || currentSession.email,
      username: updates.username !== undefined ? updates.username : currentSession.username,
      role: updates.role || currentSession.role,
    });

    const cookieStore = cookies();
    (await cookieStore).set(cookie.name, updatedSession, cookie.options);
  } catch (error) {
    console.error('Failed to update session:', error);
    throw new Error('Session update failed');
  }
}

/**
 * Get current user ID from session
 * @returns Promise<string | null>
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await verifySession();
    return session?.userId || null;
  } catch (error) {
    console.error('Failed to get current user ID:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await verifySession();
    return !!session;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

/**
 * Check if user has specific role
 * @param requiredRole - Role to check
 * @returns Promise<boolean>
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  try {
    const session = await verifySession();
    return session?.role === requiredRole;
  } catch (error) {
    console.error('Role check failed:', error);
    return false;
  }
}

/**
 * Check if user has any of the specified roles
 * @param roles - Array of roles to check
 * @returns Promise<boolean>
 */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  try {
    const session = await verifySession();
    return session ? roles.includes(session.role) : false;
  } catch (error) {
    console.error('Multi-role check failed:', error);
    return false;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 * @param redirectTo - Path to redirect to after login (optional)
 * @returns Promise<SessionPayload>
 */
export async function requireAuth(redirectTo?: string): Promise<SessionPayload> {
  const session = await verifySession();
  
  if (!session) {
    const loginUrl = redirectTo 
      ? `/(auth)/login?callbackUrl=${encodeURIComponent(redirectTo)}`
      : '/(auth)/login';
    redirect(loginUrl);
  }

  return session;
}

/**
 * Require specific role - redirect if user doesn't have role
 * @param requiredRole - Required role
 * @param redirectTo - Path to redirect to if unauthorized
 * @returns Promise<SessionPayload>
 */
export async function requireRole(
  requiredRole: string,
  redirectTo: string = '/(user)/dashboard'
): Promise<SessionPayload> {
  const session = await requireAuth();
  
  if (session.role !== requiredRole) {
    redirect(redirectTo);
  }

  return session;
}

/**
 * Require admin role
 * @returns Promise<SessionPayload>
 */
export async function requireAdmin(): Promise<SessionPayload> {
  return await requireRole('ADMIN', '/(user)/dashboard');
}

/**
 * Create standardized API response for session errors
 * @param message - Error message
 * @param status - HTTP status code
 * @returns NextResponse
 */
export function createSessionErrorResponse(
  message: string = 'Authentication required',
  status: number = 401
): NextResponse {
  return NextResponse.json(
    { 
      error: message, 
      authenticated: false,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

/**
 * Enhanced session middleware for API routes
 * @param handler - API route handler
 * @param options - Middleware options
 * @returns Wrapped handler function
 */
export function withAuth(
  handler: (request: Request, session: SessionPayload) => Promise<Response>,
  options: {
    requireAuth?: boolean;
    requiredRole?: string;
    requireAdmin?: boolean;
    allowedRoles?: string[];
  } = {}
) {
  return async (request: Request) => {
    try {
      const session = await verifySession();

      // Check authentication requirement
      if (options.requireAuth && !session) {
        return createSessionErrorResponse('Authentication required', 401);
      }

      // Check specific role requirement
      if (options.requiredRole && (!session || session.role !== options.requiredRole)) {
        return createSessionErrorResponse(
          `Access denied. Required role: ${options.requiredRole}`,
          403
        );
      }

      // Check admin requirement
      if (options.requireAdmin && (!session || session.role !== 'ADMIN')) {
        return createSessionErrorResponse('Admin access required', 403);
      }

      // Check allowed roles
      if (options.allowedRoles && (!session || !options.allowedRoles.includes(session.role))) {
        return createSessionErrorResponse(
          `Access denied. Allowed roles: ${options.allowedRoles.join(', ')}`,
          403
        );
      }

      // If session is required but not found
      if (!session && (options.requireAuth || options.requiredRole || options.requireAdmin || options.allowedRoles)) {
        return createSessionErrorResponse('Invalid or expired session', 401);
      }

      return await handler(request, session!);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return createSessionErrorResponse('Authentication validation failed', 500);
    }
  };
}

/**
 * Refresh session expiration without changing data
 * @returns Promise<boolean> - Success status
 */
export async function refreshSession(): Promise<boolean> {
  try {
    const session = await verifySession();
    
    if (!session) {
      return false;
    }

    const refreshedSession = await encrypt({
      userId: session.userId,
      email: session.email,
      username: session.username,
      role: session.role,
    });

    const cookieStore = cookies();
    (await cookieStore).set(cookie.name, refreshedSession, cookie.options);
    return true;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return false;
  }
}

/**
 * Get session info for client-side use (sanitized)
 * @returns Promise<object | null>
 */
export async function getSessionInfo(): Promise<{
  userId: string;
  email: string;
  username?: string;
  role: string;
  authenticated: boolean;
} | null> {
  try {
    const session = await verifySession();
    
    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      email: session.email,
      username: session.username,
      role: session.role,
      authenticated: true,
    };
  } catch (error) {
    console.error('Failed to get session info:', error);
    return null;
  }
}