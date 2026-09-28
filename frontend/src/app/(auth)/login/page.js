import LoginForm from "@/components/landing-page/login-form";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
// import { UserProvider } from "@/lib/api/userinfo";
import { getRoleRoute } from "@/lib/role-route";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { user } = await getUserInfo();

  if (user) {
    redirect(getRoleRoute(user.role));
  }
  return <LoginForm />;
}
