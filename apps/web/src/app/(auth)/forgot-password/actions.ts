"use server";

import { ForgotPasswordRequest } from "@flow/shared";
import { trpcFetch } from "@/lib/api";

export interface ForgotPasswordActionResult {
  success: boolean;
  fieldErrors?: Record<string, string>;
  error?: string;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordActionResult> {
  try {
    await trpcFetch("auth.forgot-password", data);
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Cannot reach the server. Is the API running?",
    };
  }
}
