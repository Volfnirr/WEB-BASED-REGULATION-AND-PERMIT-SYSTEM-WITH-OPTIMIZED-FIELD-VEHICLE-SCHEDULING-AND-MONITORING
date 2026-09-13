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

// export async function listAllUsers({
//   searchValue,
//   searchField = "name",
//   searchOperator = "contains",
//   limit = 100,
//   offset = 0,
//   sortBy = "createdAt",
//   sortDirection = "desc",
// } = {}) {
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore.toString();

//   const { data, error } = await authClient.admin.listUsers({
//     query: {
//       searchValue,
//       searchField,
//       searchOperator,
//       limit,
//       offset,
//       sortBy,
//       sortDirection,
//     },
//     fetchOptions: {
//       headers: {
//         Cookie: cookieHeader,
//       },
//       cache: "no-store",
//     },
//   });

//   if (error) {
//     throw new Error(error.message || "Failed to list users.");
//   }

//   return data;
// }

export async function listAllUsers({
  searchValue,
  searchField = "name",
  searchOperator = "contains",
  limit = 500,
  offset = 0,
  sortBy = "updatedAt",
  sortDirection = "desc",
  // filterField,
} = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const params = new URLSearchParams();
  if (searchValue) {
    params.set("searchValue", searchValue); // The value to search for.
    params.set("searchField", searchField); // The field to search in, defaults to email. Can be `email` or `name`.
    params.set("searchOperator", searchOperator); // The operator to use for the search. Can be `contains`, `starts_with` or `ends_with`.
  }
  params.set("limit", String(limit)); // The number of users to return. Defaults to 100.
  params.set("offset", String(offset)); // The offset to start from.
  params.set("sortBy", sortBy); // The field to sort by.
  params.set("sortDirection", sortDirection); // The direction to sort by.
  // params.set("filterField", filterField) // The field to filter by.

  const response = await fetch(
    `${process.env.API_URL}/api/v1/super-admin/users?${params.toString()}`,
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
    throw new Error(result.message || "Failed to retrieve users.");
  }

  return result;
}
