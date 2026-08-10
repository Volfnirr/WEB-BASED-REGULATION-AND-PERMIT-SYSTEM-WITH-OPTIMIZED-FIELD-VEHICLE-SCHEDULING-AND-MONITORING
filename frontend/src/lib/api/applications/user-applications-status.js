import { cookies } from "next/headers";

export async function userApplicationsStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/status`,
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
    throw new Error(result.message || "Failed to submit application.");
  }

  return result.application;
}
