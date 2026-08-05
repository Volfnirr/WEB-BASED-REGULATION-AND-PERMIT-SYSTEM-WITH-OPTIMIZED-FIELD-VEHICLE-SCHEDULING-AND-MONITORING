export async function getMyServices() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/my`,
    {
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}
