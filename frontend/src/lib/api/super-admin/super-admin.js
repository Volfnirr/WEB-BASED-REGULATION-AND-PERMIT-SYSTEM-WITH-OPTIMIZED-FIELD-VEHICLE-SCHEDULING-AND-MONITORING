import { authClient } from "@/lib/auth-client";

export async function createUser({ name, email, password, role }) {
  // return authClient.admin.createUser({ name, email, password, role });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/users`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to create user.");
  }

  return result;
}

export async function createAppAdmin({ assignServices }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/assign-services`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignServices),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error("Failed to assign user services.");
  }

  return result;
}
