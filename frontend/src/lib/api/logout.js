import { authClient } from "@/lib/auth-client";
export async function logout(router) {
  await authClient.signOut();

  router.push("/login");
}
