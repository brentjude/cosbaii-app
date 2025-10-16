import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // ✅ Check if user is banned, suspended, or pending approval
    if (token) {
      const userStatus = token.status as string;

      if (userStatus === "BANNED") {
        if (pathname !== "/unauthorized") {
          return NextResponse.redirect(
            new URL("/unauthorized?reason=banned", req.url)
          );
        }
        return NextResponse.next();
      }

      if (userStatus === "SUSPENDED") {
        if (pathname !== "/unauthorized") {
          return NextResponse.redirect(
            new URL("/unauthorized?reason=suspended", req.url)
          );
        }
        return NextResponse.next();
      }

      if (userStatus === "PENDING_APPROVAL") {
        if (pathname !== "/unauthorized") {
          return NextResponse.redirect(
            new URL("/unauthorized?reason=pending-approval", req.url)
          );
        }
        return NextResponse.next();
      }
    }

    // ✅ Admin routes - require ADMIN role
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
      }

      if (token.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=access-denied", req.url)
        );
      }

      return NextResponse.next();
    }

    // ✅ Mod routes - require MOD or ADMIN role
    if (pathname.startsWith("/mod")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=/mod", req.url));
      }

      if (token.role !== "MOD" && token.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=access-denied", req.url)
        );
      }

      return NextResponse.next();
    }

    // ✅ User protected routes - require active user
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/settings")
    ) {
      if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (token.status !== "ACTIVE") {
        return NextResponse.redirect(
          new URL("/unauthorized?reason=access-denied", req.url)
        );
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ Allow public routes without authentication
        const publicRoutes = [
          "/",
          "/login",
          "/register",
          "/verify-email",
          "/unauthorized",
        ];

        if (
          publicRoutes.includes(pathname) ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/images") ||
          pathname.startsWith("/icons") ||
          pathname.startsWith("/api/")
        ) {
          return true;
        }

        // ✅ Protected routes require token
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/mod") ||
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/profile") ||
          pathname.startsWith("/settings")
        ) {
          return !!token;
        }

        // ✅ Allow other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};