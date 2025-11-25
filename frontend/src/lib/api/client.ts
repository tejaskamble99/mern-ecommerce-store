export async function apiFetch<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return (await res.json()) as T;
}
