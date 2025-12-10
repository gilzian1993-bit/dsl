import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        const pathname = req.nextUrl.pathname;
        if (pathname === "/login") {
          return true;
        }
        // If no token, redirect to login
        // This handles cases where JWT decryption fails (old secret)
        if (!token) {
          return false;
        }
        // Require token for all other admin routes
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

