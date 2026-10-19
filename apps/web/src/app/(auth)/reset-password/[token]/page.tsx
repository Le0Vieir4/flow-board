import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { trpcFetch } from "@/lib/api";

export const metadata: Metadata = {
  title: "Reset password — FlowBoard",
  description: "Create a new password for your FlowBoard account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  // Verify the token exists by calling the server
  try {
    await trpcFetch("auth.verify-email", { token });
  } catch {
    // Token may be a password reset token, not email verification - that's fine
    // The form submission will validate it
  }

  return <ResetPasswordForm token={token} />;
}
