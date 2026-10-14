"use server";

import { validateLogin } from "@flow/shared";
import { getApiUrl } from "@/lib/api";
import { LoginRequest } from "@flow/shared";
import { setCookies } from "@/lib/auth/auth-cookies";

export interface LoginActionResult {
  success: boolean;
  user?: { id: string; name: string; email: string; role: string };
  redirect?: string;
  fieldErrors?: Record<string, string>;
  error?: string;
}

const apiUrl = getApiUrl();

export async function loginUser(data: LoginRequest): Promise<LoginActionResult> {
  const parsed = validateLogin(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const [key, messages] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      fieldErrors[key] = messages?.[0] ?? "Invalid field";
    }
    return { success: false, fieldErrors };
  }

  try {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, error: "Invalid email or password" };
      }
      if (res.status === 400 && data?.fieldErrors) {
        return { success: false, fieldErrors: data.fieldErrors };
      }
      return { success: false, error: data?.message?.[0] ?? "Login failed" };
    }

    await setCookies(res.headers);

    return { success: true, redirect: data.redirect };
  } catch {
    return {
      success: false,
      error: "Cannot reach the server. Is the API running?",
    };
  }
}
