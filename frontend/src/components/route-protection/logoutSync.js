"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/account-info-context";

export default function LogoutSync() {
  const router = useRouter();
  const { role, isPending, isLoggedIn } = useUser();

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "logout") {
        router.replace("/login");
        router.refresh();
      }
    };

    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  useEffect(() => {
    // Wait until Better Auth finishes checking
    if (isPending) return;

    // Not logged in
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }
  }, [isLoggedIn, isPending, role, router]);

  return null;
}
