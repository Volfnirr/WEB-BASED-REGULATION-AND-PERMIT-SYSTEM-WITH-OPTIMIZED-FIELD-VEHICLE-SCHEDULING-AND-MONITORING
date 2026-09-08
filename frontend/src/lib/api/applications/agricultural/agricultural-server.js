import { cookies } from "next/headers";
export async function agriculturalApplications() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/agricultural`,
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
      result.message || "Failed to retrieve agricultural applications.",
    );
  }

  return result;
}

export async function getAgriculturalFormDataById(id) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/agricultural/${id}`,
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
      result.message || "Failed to retrieve agricultural application form data.",
    );
  }

  return result;
}

export async function getAgriculturalAppStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(
    `${process.env.API_URL}/api/v1/applications/agricultural/status`,
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
      result.message || "Failed to retrieve agricultural application status.",
    );
  }

  return result;
}
