// Update: src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // ✅ Skip ALL API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    console.log(
      "Middleware - Path:",
      pathname,
      "Role:",
      token?.role,
      "Has token:",
      !!token
    );

    // ✅ Skip processing if already on login page
    if (pathname === "/login") {
      return NextResponse.next();
    }

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (!token) {
        console.log("Admin route - No token, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (token.role !== "ADMIN") {
        console.log(`Admin access denied for user with role: ${token.role}`);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      console.log("Admin route - Access granted");
      return NextResponse.next();
    }

    // Dashboard routes
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        console.log("Dashboard route - No token, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }

      console.log("Dashboard route - Access granted");
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ✅ Always allow API routes
        if (pathname.startsWith("/api/")) {
          return true;
        }

        // ✅ Allow authentication routes (login, register)
        if (
          pathname === "/" ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/unauthorized" ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/images")
        ) {
          return true;
        }

        // ✅ For protected routes, require token
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/dashboard")
        ) {
          return !!token;
        }

        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // ✅ More specific matcher
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};
