export function getUtcOffsetDate(offsetHours = 8) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + offsetHours * 60 * 60 * 1000).toDateString();
}

function parseCustomDate(dateInput) {
  if (dateInput instanceof Date) {
    return new Date(
      Date.UTC(
        dateInput.getFullYear(),
        dateInput.getMonth(),
        dateInput.getDate(),
      ),
    );
  }
  if (typeof dateInput === "string") {
    const [y, m, d] = dateInput.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }
  return null;
}

export function getNextDaysUtc8(daysCount, dateInput, offsetHours = 8) {
  const start = parseCustomDate(dateInput) ?? getUtcOffsetDate(offsetHours);

  const result = [];
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);

    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");

    result.push(`${y}-${m}-${day}`);
  }

  return result;
}

export function getDayName(dateString) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[new Date(dateString).getDay()];
}
