export async function submitAgriculturalForm(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/agricultural`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit application.");
  }

  return result;
}
export async function getAgriculturalApplications() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/agricultural`,
    {
      method: "GET",
      credentials: "include",
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

export async function getAgriculturalStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/agricultural/status`,
    {
      method: "GET",
      credentials: "include",
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
