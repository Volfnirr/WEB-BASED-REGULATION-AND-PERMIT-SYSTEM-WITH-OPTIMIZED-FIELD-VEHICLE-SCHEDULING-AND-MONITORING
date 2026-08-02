"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
export default function CheckRole({ userRoles, children }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Wait until Better Auth finishes checking
    if (isPending) return;

    // Not logged in
    if (!session) {
      router.replace("/auth");
      return;
    }

    // Logged in but wrong role
    if (!userRoles.includes(session.user.role)) {
      router.replace("/unauthorized");
      return;
    }
  }, [session, isPending, userRoles, router]);

  // Show loading while checking
  if (isPending) {
    return <p>Loading...</p>;
  }

  // Don't render anything while redirecting
  if (!session || !userRoles.includes(session.user.role)) {
    return null;
  }
  return children;
}
