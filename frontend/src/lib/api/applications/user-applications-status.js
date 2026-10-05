export async function userApplicationsStatus({ signal } = {}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/status`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get applications.");
  }

  return result.application;
}
