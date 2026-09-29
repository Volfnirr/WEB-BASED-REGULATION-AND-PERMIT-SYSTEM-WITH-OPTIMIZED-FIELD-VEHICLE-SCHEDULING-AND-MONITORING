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
    throw new Error(result.message || "Failed to list available vehicles.");
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

export async function exportTripTicket(tripId, tripTicketNo) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/trip-ticket/excel/${tripId}/export`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to download excel.");
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trip-ticket-${tripTicketNo}-${tripId}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  return {
    message: "Sucessfully downloaded excel file",
  };
}

export async function scheduleVehicleMaintenance(id, data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/maintenance/${id}/schedule`,
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
    throw new Error(
      result.message || "Failed to schedule vehicle maintenance.",
    );
  }

  return result;
}
// For react query - HEHE
export async function getVehicleDashboard() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/dashboard`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieve dashboard.");
  }

  return result;
}

export async function getTripTicketList() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/trip-ticket`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved trip ticket list.");
  }

  return result;
}

export async function getTripTicketStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/trip-ticket/status`,
    {
      method: "GET",
      credentials: "include",
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

export async function getVehicleSchedulesStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/schedules/status`,
    {
      method: "GET",
      credentials: "include",
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

export async function getListAllVehicles() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles`,
    {
      method: "GET",

      credentials: "include",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved vehicles.");
  }

  return result;
}

export async function getVehiclesStatus() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/status`,
    {
      method: "GET",

      credentials: "include",
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to retrieved vehicles status.");
  }

  return result;
}

export async function submitCompleteTripTicket(data) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/complete-trip-ticket`,
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
    throw new Error(
      result.message || "Failed to submit trip ticket.",
    );
  }
  
  return result;
}

// Paste this into manage-vehicles.js, right after submitCompleteTripTicket.
export async function updateCompleteTripTicket({ id, data }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/complete-trip-ticket/${id}`,
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
    throw new Error(
      result.message || "Failed to update trip ticket completion.",
    );
  }

  return result;
}

export async function checkTicketNumberExists(tripTicketNo) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/trip-ticket/check-exists?ticketNo=${encodeURIComponent(tripTicketNo)}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  
  if (!response.ok) {
    throw new Error("Failed to validate ticket number");
  }
  
  const data = await response.json();
  return data.exists;
}

export async function getTripTickets() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/vehicles/complete-trip-ticket`;
  console.log("1. Requesting trip tickets from:", url);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  console.log("2. Response status:", response.status);

  const result = await response.json();
  console.log("3. Raw data from backend:", result);

  if (!response.ok) {
    throw new Error(result.message || `Failed with status ${response.status}`);
  }

  return result.data || result;
}