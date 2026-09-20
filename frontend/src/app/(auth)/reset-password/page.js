import { MissingToken } from "@/components/landing-page/missing-token";
import ResetPasswordUI from "@/components/landing-page/reset-password";

export default async function ResetPassword({ searchParams }) {
  const { token, error } = await searchParams;

  if (!token || error) {
    return <MissingToken />;
  }
  return <ResetPasswordUI token={token} />;
}
