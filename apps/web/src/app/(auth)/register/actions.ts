"use server";

import { validateRegister } from "@flow/shared";
import { RegisterRequest } from "@flow/shared";
import { trpcFetch } from "@/lib/api";
import { setCookies } from "@/lib/auth/auth-cookies";

export interface RegisterActionResult {
  success: boolean;
  user?: { id: string; name: string; email: string; role: string };
  redirect?: string;
  fieldErrors?: Record<string, string>;
  error?: string;
}

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
    const { res, result } = await trpcFetch<{ user: { id: string; name: string; email: string; role: string } }>("auth.register", parsed.data);

    await setCookies(res.headers);
    return { success: true, user: result.user };
  } catch {
    return { success: false, error: "Cannot reach the server. Is the API running?" };
  }
}
