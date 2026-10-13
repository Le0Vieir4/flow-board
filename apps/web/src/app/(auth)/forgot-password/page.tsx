import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Forgot password — FlowBoard",
  description:
    "Password reset is coming soon to FlowBoard. We'll send you a reset link the moment it's ready.",
};

export default function ForgotPasswordPage() {
  return (
    <ComingSoonPage
      title="Password reset is coming soon"
      description="We're building the reset flow. When it's ready, a reset link will land in your inbox in seconds — in the meantime, keep your credentials close."
    />
  );
}
