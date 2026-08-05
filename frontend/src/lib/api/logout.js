import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export async function logout(router) {
  await authClient.signOut();

  toast.success("Logged out successfully.", {
    position: "top-center",
  });
  router.push("/login");
}
