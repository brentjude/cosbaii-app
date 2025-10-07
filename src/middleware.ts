// Update: src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    console.log(
      "Middleware - Path:",
      pathname,
      "User:",
      token?.email,
      "Role:",
      token?.role
    );

    // Skip API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // ✅ Allow admin users to access admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        console.log(
          `Access denied: User ${token?.email} with role ${token?.role} tried to access admin area`
        );
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      // ✅ Allow access for admins
      return NextResponse.next();
    }

    // ✅ Allow regular users to access dashboard
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        console.log(
          "Access denied: No authentication token found for dashboard"
        );
        return NextResponse.redirect(new URL("/login", req.url));
      }
      // ✅ Allow access for authenticated users
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow all API routes
        if (pathname.startsWith("/api/")) {
          return true;
        }

        // Allow public routes
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/unauthorized"
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all paths except static files and API routes that should be public
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
