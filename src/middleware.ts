import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {

    const token = req.nextauth.token; // Get the authentication token from the request
    const { pathname } = req.nextUrl; // Get the current request path

    console.log("Middleware - Path:", pathname, "User:", token?.email, "Role:", token?.role);

    // Admin routes - only ADMIN can access
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        console.log(`Access denied: User ${token?.email} with role ${token?.role} tried to access admin area`);
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // User dashboard routes - authenticated users
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        console.log("Access denied: No authentication token found for dashboard");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Redirect based on role after login
    if (pathname === "/") {
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (token?.role === "USER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    console.log(`Access granted: User ${token?.email} with role ${token?.role} accessing ${pathname}`);
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes that don't need authentication
        const publicRoutes = [
          "/", 
          "/login", 
          "/register", 
          "/about", 
          "/contact",
          "/unauthorized"
        ];
        
        // Allow public routes
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // All other routes need authentication
        return !!token;
      },
    },
  }
);

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*"
  ]
};