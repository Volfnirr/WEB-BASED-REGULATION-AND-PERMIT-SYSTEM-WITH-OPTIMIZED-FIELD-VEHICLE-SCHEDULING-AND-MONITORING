"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/lib/context/account-info-context";
import Loading from "@/components/ui/loading";
export default function CheckRole({ userRoles, children }) {
  const router = useRouter();

  const { role, isPending, isLoggedIn } = useUser();

  useEffect(() => {
    // Wait until Better Auth finishes checking
    if (isPending) return;

    // Not logged in
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    // Logged in but wrong role
    if (!userRoles.includes(role)) {
      router.replace("/unauthorized");
      return;
    }
  }, [userRoles, isLoggedIn, isPending, role, router]);

  // Show loading while checking
  // if (isPending) {
  //   return <Loading />;
  // }

  if (!isLoggedIn || !userRoles.includes(role)) {
    return null;
  }
  return children;
}
