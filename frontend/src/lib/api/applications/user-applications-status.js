import { cookies } from "next/headers";

export async function userApplicationsStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/status`,
    {
      method: "GET",

      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get application.");
  }

  return result;
}

export async function logNewUser() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/users/create`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to log user.");
  }

  return result;
}
