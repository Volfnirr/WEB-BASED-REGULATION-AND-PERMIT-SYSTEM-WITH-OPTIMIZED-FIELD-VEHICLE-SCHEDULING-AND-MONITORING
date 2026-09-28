import { authClient } from "@/lib/auth-client";

export async function logout(router) {
  await authClient.signOut();

  localStorage.setItem("logout", Date.now().toString());

  router.refresh();
  window.location.replace("/login");
}
