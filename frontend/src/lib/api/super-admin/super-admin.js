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

export async function banUser({ userId, banReason, banExpiresIn }) {
  // return authClient.admin.createUser({ name, email, password, role });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/users/ban`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, banReason, banExpiresIn }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to ban user.");
  }

  return result;
}

export async function unbanUser({ userId }) {
  // return authClient.admin.createUser({ name, email, password, role });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/users/unban`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to create user.");
  }

  return result;
}

export async function changeUserPassword({ userId, password }) {
  // return authClient.admin.createUser({ name, email, password, role });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/users/password`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to change user password.");
  }

  return result;
}

export async function changeUserRole({ userId, role }) {
  // return authClient.admin.createUser({ name, email, password, role });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/users/role`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to change user role.");
  }

  return result;
}

export async function changeUserName({ userId, name }) {
  // return authClient.admin.createUser({ name, email, password, role });
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/users/name`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, name }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to change user name.");
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

// INSPECTOR START
export async function createInspector({ data }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/inspectors`,
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
    console.log(result.message);
    throw new Error("Failed to create inspector.");
  }

  return result;
}

export async function updateInspector({ data, id }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/super-admin/inspectors/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log(result.message);
    throw new Error(result.message || "Failed to create inspector.");
  }

  return result;
}
// INSPECTOR END
