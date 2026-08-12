export function localDate(date) {
  return new Date(date).toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
  });
}
