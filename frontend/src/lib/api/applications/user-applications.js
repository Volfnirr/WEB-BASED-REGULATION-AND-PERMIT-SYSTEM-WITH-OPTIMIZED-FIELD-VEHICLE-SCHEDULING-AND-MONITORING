export async function logNewUser(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to log user.");
  }

  return result;
}
