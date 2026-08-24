import { cookies } from "next/headers";
export async function residentialApplications() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/residential`,
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
      result.message || "Failed to retrieve residential applications.",
    );
  }

  return result;
}

export async function getResidentialFormDataById(id) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/residential/${id}`,
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
      result.message || "Failed to retrieve residential application form data.",
    );
  }

  return result;
}

export async function getResidentialAppStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/residential/status`,
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
      result.message || "Failed to retrieve residential application status.",
    );
  }

  return result;
}
