export async function createVehicle(formData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add vehicle.");
  }

  return result;
}

export async function updateVehicle({ id, formData }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update vehicle.");
  }

  return result;
}
