"use server";

import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/api";
import { validateRegister } from "@flow/shared";

export interface RegisterActionResult {
  success: boolean;
  user?: { id: string; name: string; email: string; role: string };
  redirect?: string;
  fieldErrors?: Record<string, string>;
  error?: string;
}

import { RegisterRequest } from "@flow/shared";

export async function registerUser(data: RegisterRequest & { redirect?: string }): Promise<RegisterActionResult> {
  const { redirect, ...rawData } = data;
  
  const parsed = validateRegister(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [key, messages] of Object.entries(parsed.error.flatten().fieldErrors)) {
      fieldErrors[key] = Array.isArray(messages) ? messages[0] : String(messages);
    }
    return { success: false, fieldErrors };
  }

  try {
    const res = await fetch(`${getApiUrl()}/auth/register`, {
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

    const setCookieHeaders = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    
    // Fallback: parse Set-Cookie header manually if getSetCookie not available
    const cookieHeader = res.headers.get("set-cookie");
    const allCookieHeaders = setCookieHeaders.length > 0 ? setCookieHeaders : (cookieHeader ? [cookieHeader] : []);
    
    const cookieStore = await cookies();
    for (const cookieHeader of allCookieHeaders) {
      const [cookiePair, ...attributes] = cookieHeader.split(";").map((s) => s.trim());
      const [name, ...valueParts] = cookiePair.split("=");
      const value = valueParts.join("=");
      const opts: Record<string, string | number | boolean | undefined> = {};
      for (const attr of attributes) {
        const [key, val] = attr.split("=").map((s) => s.trim());
        const lowerKey = key.toLowerCase();
        if (lowerKey === "httponly") opts.httpOnly = true;
        else if (lowerKey === "secure") opts.secure = true;
        else if (lowerKey === "samesite") opts.sameSite = val as "lax" | "strict" | "none";
        else if (lowerKey === "path") opts.path = val;
        else if (lowerKey === "max-age") opts.maxAge = Number(val);
        else if (lowerKey === "expires") opts.expires = val;
        // Skip domain - let it default to current host (Next.js app domain)
      }
      cookieStore.set(name, value, opts);
    }

    const redirectTo = redirect || "/boards";
    return { success: true, user: data.user, redirect: redirectTo };
  } catch {
    return { success: false, error: "Cannot reach the server. Is the API running?" };
  }
}