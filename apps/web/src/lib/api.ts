export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
}

export async function trpcFetch<T>(
  method: string,
  params?: unknown,
  init?: RequestInit,
): Promise<{ res: Response; result: T }> {
  const res = await fetch(`${getApiUrl()}/trpc`, {
    ...init,
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: JSON.stringify({ id: "1", jsonrpc: "2.0", method, params }),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    throw new Error(json.error?.message ?? `tRPC ${method} failed (${res.status})`);
  }
  return { res, result: json.result as T };
}
