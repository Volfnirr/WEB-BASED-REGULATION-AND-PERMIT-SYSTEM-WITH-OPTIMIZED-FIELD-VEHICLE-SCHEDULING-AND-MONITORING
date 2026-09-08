import { cookies } from "next/headers";
export async function chainsawApplications() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/chainsaw`,
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
      result.message || "Failed to retrieve chainsaw applications.",
    );
  }

  return result;
}

export async function getChainsawFormDataById(id) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/chainsaw/${id}`,
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
      result.message || "Failed to retrieve chainsaw application form data.",
    );
  }

  return result;
}

export async function getChainsawAppStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/chainsaw/status`,
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
      result.message || "Failed to retrieve chainsaw application status.",
    );
  }

  return result;
}
