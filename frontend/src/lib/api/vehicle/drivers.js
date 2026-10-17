async function request(path = "", options = {}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/drivers${path}`,
    {
      credentials: "include",
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    const fields = data.errorContext?.fieldErrors;
    const detail = fields ? Object.values(fields).flat().join(" ") : null;
    throw new Error(
      data.message ||
        detail ||
        data.errorMessage ||
        "Unable to process the driver request.",
    );
  }
  return data;
}
export const listDrivers = () => request();
export const createDriver = (data) =>
  request("", { method: "POST", body: JSON.stringify(data) });
export const updateDriver = (id, data) =>
  request(`/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const availableDrivers = (params) =>
  request(`/available?${new URLSearchParams(params)}`);
export const driverSchedules = (params) =>
  request(`/schedules?${new URLSearchParams(params)}`);
export const saveDriverBlock = (id, data) =>
  request(id ? `/blocks/${id}` : "/blocks", {
    method: id ? "PATCH" : "POST",
    body: JSON.stringify(data),
  });
export const deleteDriverBlock = (id) =>
  request(`/blocks/${id}`, { method: "DELETE" });
export const driverName = (driver) =>
  [driver.firstName, driver.middleName, driver.lastName, driver.extensionName]
    .filter(Boolean)
    .join(" ");
