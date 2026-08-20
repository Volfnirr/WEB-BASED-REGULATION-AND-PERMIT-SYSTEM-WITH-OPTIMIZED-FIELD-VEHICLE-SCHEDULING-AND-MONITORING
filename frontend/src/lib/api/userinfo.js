import { authClient } from "@/lib/auth-client";
export function useUserInfo() {
  const { data: session, isPending, error } = authClient.useSession();
  return {
    user: session?.user ?? null,
    role: session?.user?.role ?? null,
    isLoggedIn: !!session,
    isPending,
    error,
  };
}
