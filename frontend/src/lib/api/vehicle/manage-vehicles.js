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

export async function listAvailableVehicles({ startDate, endDate }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/schedules/available?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update vehicle.");
  }

  return result;
}

export async function submitTripAndSchedule(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/trip-ticket`,
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
    throw new Error(result.message || "Failed to submit trip ticket.");
  }

  return result;
}

export async function listVehiclesSchedules({ startDate, endDate }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/schedules?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to retrieve vehicle schedule data.",
    );
  }

  return result;
}

export async function updateTripAndSchedule({ id, data }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/trip-ticket/${id}`,
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
    throw new Error(result.message || "Failed to update vehicle.");
  }

  return result;
}
