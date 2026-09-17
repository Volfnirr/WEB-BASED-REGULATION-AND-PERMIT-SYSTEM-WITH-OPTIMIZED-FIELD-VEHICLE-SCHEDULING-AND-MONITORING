export async function logNewUser() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/users/create`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to log user.");
  }

  return result;
}
