import { cookies } from "next/headers";
// VEHICLE START
export async function listAllVehicles() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(`${process.env.API_URL}/api/v1/vehicles`, {
    method: "GET",

    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved vehicles.");
  }

  return result;
}

export async function vehiclesStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/vehicles/status`,
    {
      method: "GET",

      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved vehicles status.");
  }

  return result;
}

// VEHICLE END

// TRIP TICKET START

export async function tripTicketList() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/vehicles/trip-ticket`,
    {
      method: "GET",

      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved trip ticket list.");
  }

  return result;
}

export async function tripTicketStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/vehicles/trip-ticket/status`,
    {
      method: "GET",

      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message || "Failed to retrieved trip ticket status.",
    );
  }

  return result;
}

// TRIP TICKET END

// DASHBOARD START

export async function dashboardStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/vehicles/dashboard`,
    {
      method: "GET",

      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to dashboard status.");
  }

  return result;
}
// DASHBOARD END

// VEHICLES SCHEDULES START

export async function vehicleSchedulesStatus() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const response = await fetch(
    `${process.env.API_URL}/api/v1/vehicles/schedules/status`,
    {
      method: "GET",

      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.message || "Failed to retrieve vehicle schedules status.",
    );
  }

  return result;
}

// VEHICLES SCHEDULES END
