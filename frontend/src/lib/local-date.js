export function localDate(date) {
  return new Date(date).toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
  });
}

export function localDateTime(date) {
  return new Date(date).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
