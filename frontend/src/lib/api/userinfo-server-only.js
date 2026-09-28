import "server-only";

import { cookies } from "next/headers";

export async function getUserInfo() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${process.env.API_URL}/api/auth/get-session`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      user: null,
      role: null,
      isLoggedIn: false,
    };
  }

  const result = await response.json();

  return {
    user: result?.user ?? null,
    role: result?.user?.role ?? null,
    isLoggedIn: !!result?.user,
  };
}
