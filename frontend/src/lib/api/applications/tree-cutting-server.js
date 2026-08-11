import { cookies } from "next/headers";
export async function treeCuttingApplications() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  console.log("COOKIE HEADER:", cookieHeader);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/tree-cutting/applications`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/tree-cutting/applications/${id}`,
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
