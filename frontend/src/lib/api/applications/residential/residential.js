export async function submitResidentialForm(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/residential`,
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

export async function getResidentialApplications() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/residential`,
    {
      method: "GET",
      credentials: "include",
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

export async function getResidentialStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/residential/status`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieve residential status.");
  }

  return result;
}
