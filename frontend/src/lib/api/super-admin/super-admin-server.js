"use server";
import { cookies } from "next/headers";
import { authClient } from "@/lib/auth-client";

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

export async function listAllUsers({
  searchValue,
  searchField = "name",
  searchOperator = "contains",
  limit = 100,
  offset = 0,
  sortBy = "createdAt",
  sortDirection = "desc",
} = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data, error } = await authClient.admin.listUsers({
    query: {
      searchValue,
      searchField,
      searchOperator,
      limit,
      offset,
      sortBy,
      sortDirection,
    },
    fetchOptions: {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to list users.");
  }

  return data;
}
