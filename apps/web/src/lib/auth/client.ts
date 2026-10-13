import { getApiUrl } from "@/lib/api";

export async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const API_URL = getApiUrl();
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (res.status === 401) {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      return fetch(`${API_URL}${path}`, { credentials: "include", ...init });
    }
  }
  return res;
}