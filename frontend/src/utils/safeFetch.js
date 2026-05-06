export async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  let payload;

  try {
    if (contentType.includes("application/json")) {
      payload = await res.json();
    } else {
      payload = await res.text();
    }
  } catch {
    payload = await res.text().catch(() => null);
  }

  return { res, ok: res.ok, status: res.status, payload };
}
