export async function submitChainsawForm(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/chainsaw`,
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

export async function getChainsawApplications() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/chainsaw`,
    {
      method: "GET",
      credentials: "include",
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

export async function getChainsawStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/chainsaw/status`,
    {
      method: "GET",
      credentials: "include",
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
