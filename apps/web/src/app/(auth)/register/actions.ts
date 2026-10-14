"use server";

import { getApiUrl } from "@/lib/api";
import { validateRegister } from "@flow/shared";
import { RegisterRequest } from "@flow/shared";
import { setCookies } from "@/lib/auth/auth-cookies";

export interface RegisterActionResult {
  success: boolean;
  user?: { id: string; name: string; email: string; role: string };
  redirect?: string;
  fieldErrors?: Record<string, string>;
  error?: string;
}

const apiUrl = getApiUrl();

export async function registerUser(data: RegisterRequest): Promise<RegisterActionResult> {
  const parsed = validateRegister(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    
    for (const [key, messages] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = messages?.[0] ?? "Invalid field";
    }
    return { success: false, fieldErrors };
  }

  try {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 409) {
        return { success: false, fieldErrors: { email: "This email already has an account — log in instead" } };
      }
      if (res.status === 400 && data?.fieldErrors) {
        return { success: false, fieldErrors: data.fieldErrors };
      }
      return { success: false, error: data?.message?.[0] ?? "Registration failed" };
    }
    await setCookies(res.headers);
    return { success: true, user: data.user, redirect: data.redirect };
  } catch {
    return { success: false, error: "Cannot reach the server. Is the API running?" };
  }
}