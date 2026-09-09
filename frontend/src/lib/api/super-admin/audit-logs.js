import { cookies } from "next/headers";
export async function listAllAuditLogs() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/super-admin/audit-logs`,
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
    throw new Error(result.message || "Failed to retrieved audit logs.");
  }

  return result;
}
