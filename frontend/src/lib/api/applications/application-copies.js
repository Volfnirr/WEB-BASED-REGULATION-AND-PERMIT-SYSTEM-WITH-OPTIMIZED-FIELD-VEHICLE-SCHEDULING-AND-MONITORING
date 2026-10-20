const base = () =>
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/application-copies`;
async function errorMessage(response) {
  const result = await response.json().catch(() => ({}));
  return result.message || "Could not load the application. Please try again.";
}
export async function getApplicationCopy(id, signal) {
  const response = await fetch(`${base()}/${encodeURIComponent(id)}`, {
    credentials: "include",
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(await errorMessage(response));
  return (await response.json()).application;
}
export async function downloadApplicationCopies(ids, format = "pdf") {
  const single = ids.length === 1;
  const response = await fetch(
    single
      ? `${base()}/${encodeURIComponent(ids[0])}/export?format=${encodeURIComponent(format)}`
      : `${base()}/export`,
    {
      method: single ? "GET" : "POST",
      credentials: "include",
      cache: "no-store",
      ...(single
        ? {}
        : {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ids,
              format,
            }),
          }),
    },
  );
  if (!response.ok) throw new Error(await errorMessage(response));
  const url = URL.createObjectURL(await response.blob()),
    link = document.createElement("a");
  link.href = url;
  link.download =
    /filename="([^"]+)"/.exec(
      response.headers.get("Content-Disposition") || "",
    )?.[1] ||
    (single ? `application-${ids[0]}.${format}` : `applications-${format}.zip`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
