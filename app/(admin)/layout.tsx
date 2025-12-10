import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SessionProvider from "./components/SessionProvider";
import AdminLayoutWrapper from "./components/AdminLayoutWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // Handle JWT decryption errors (happens when secret changes)
    // Clear the invalid session by not setting session
    console.log("Session error (likely old token with different secret):", error);
    session = null;
  }

  // Allow login page without session, protect other routes
  // Middleware will handle redirects, but we check here for layout rendering
  if (!session) {
    // Let middleware handle redirect, but allow login page to render
    return (
      <SessionProvider>
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </SessionProvider>
  );
}

