import "server-only";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/api/userinfo-server-only";

export async function requireRole(allowedRoles) {
  const { isLoggedIn, role, user } = await getUserInfo();

  if (!isLoggedIn) {
    redirect("/login");
  }

  if (!allowedRoles.includes(role)) {
    redirect("/unauthorized");
  }

  return { user, role };
}
