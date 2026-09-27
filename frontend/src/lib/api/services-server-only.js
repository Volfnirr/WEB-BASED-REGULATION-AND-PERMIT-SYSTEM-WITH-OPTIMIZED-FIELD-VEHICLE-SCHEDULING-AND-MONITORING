import "server-only";

import { cookies } from "next/headers";
// VEHICLE START
export async function getAppAdminServices() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(`${process.env.API_URL}/api/v1/services/my`, {
    method: "GET",

    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved services.");
  }
  console.log("SERVICES", result);
  return result;
}
