import RegisterForm from "@/components/landing-page/register-form";
import { getUserInfo } from "@/lib/api/userinfo-server-only";
import { getRoleRoute } from "@/lib/role-route";
import { redirect } from "next/navigation";
export default async function RegisterPage() {
  const { user } = await getUserInfo();

  if (user) {
    redirect(getRoleRoute(user.role));
  }
  return <RegisterForm />;
}
