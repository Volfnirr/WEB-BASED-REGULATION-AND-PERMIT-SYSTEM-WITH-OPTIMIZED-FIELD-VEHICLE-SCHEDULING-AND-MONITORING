export async function submitTreeCuttingForm(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/tree-cutting`,
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

export async function getTreeCuttingApplications() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/tree-cutting`,
    {
      method: "GET",
      credentials: "include",
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

export async function getTreeCuttingStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/tree-cutting/status`,
    {
      method: "GET",
      credentials: "include",
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
