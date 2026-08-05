"use client";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
export default function UnauthorizedUI() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  useEffect(() => {
    if (isPending) return;

    // Not logged in
    if (!session) {
      router.replace("/login");
      return;
    }
  }, [session, isPending, router]);

  return (
    <div className="min-w-screen min-h-screen flex flex-col items-center justify-center bg-black">
      <ShieldAlert className="text-red-900 size-40  md:size-60" />
      <p className="text-center text-red-900 text-3xl md:text-7xl">
        Unauthorized access
      </p>
    </div>
  );
}
