import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password — FlowBoard",
  description: "Reset your password. We'll send you a reset link to your email address.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      headline={
        <>
          Forgot your{" "}
          <span className="bg-gradient-to-r from-[#7f97ff] to-primary bg-clip-text text-transparent">
            password?
          </span>
        </>
      }
      paragraph="No problem. Enter your email and we'll send you a reset link."
      boardName=""
      columns={[]}
      toast={{ text: "", time: "" }}
      trustText="Free for teams up to 10 · No credit card required"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
