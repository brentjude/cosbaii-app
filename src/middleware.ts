// Update: src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    console.log("Middleware - Path:", pathname, "Role:", token?.role);

    // Skip API routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        console.log(`Admin access denied for user with role: ${token?.role}`);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    // Dashboard routes
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        console.log("Dashboard access denied: No token");
        // ✅ Use relative path only, not full URL
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname); // ✅ Just the pathname
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes
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

        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
