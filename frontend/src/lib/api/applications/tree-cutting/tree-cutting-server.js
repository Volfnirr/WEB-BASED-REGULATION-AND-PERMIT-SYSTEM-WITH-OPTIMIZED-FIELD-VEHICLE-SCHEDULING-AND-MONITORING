import { cookies } from "next/headers";
export async function treeCuttingApplications() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/tree-cutting`,
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
    throw new Error(
      result.message || "Failed to retrieve tree cutting applications.",
    );
  }

  return result;
}

export async function getTreeCuttingFormDataById(id) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/tree-cutting/${id}`,
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
    throw new Error(
      result.message ||
        "Failed to retrieve tree cutting application form data.",
    );
  }

  return result;
}

export async function getTreeCuttingStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/tree-cutting/status`,
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
    throw new Error(
      result.message || "Failed to retrieve tree cutting application status.",
    );
  }

  return result;
}
