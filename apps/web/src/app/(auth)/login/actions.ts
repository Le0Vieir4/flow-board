"use server";

import { validateLogin } from "@flow/shared";
import { LoginRequest } from "@flow/shared";
import { trpcFetch } from "@/lib/api";
import { setCookies } from "@/lib/auth/auth-cookies";

export interface LoginActionResult {
  success: boolean;
  user?: { id: string; name: string; email: string; role: string };
  redirect?: string;
  fieldErrors?: Record<string, string>;
  error?: string;
}

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
    const { res, result } = await trpcFetch<{ user: { id: string; name: string; email: string; role: string } }>("auth.login", parsed.data);

    await setCookies(res.headers);

    return { success: true, user: result.user };
  } catch {
    return {
      success: false,
      error: "Cannot reach the server. Is the API running?",
    };
  }
}
