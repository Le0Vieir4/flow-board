import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { trpcFetch } from "@/lib/api";
import { Icons } from "@flow/ui/icons";

export const metadata: Metadata = {
  title: "Verify email — FlowBoard",
  description: "Verify your email address to complete your FlowBoard account setup.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  try {
    await trpcFetch("auth.verify-email", { token });
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg">
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-success/10 text-success mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Email verified</h1>
        <p className="text-body text-muted max-w-sm mx-auto mb-8">
          Your email address has been verified. You can now log in and access all your boards.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] px-5 py-[11px] text-[14.5px] font-bold text-white shadow-button transition-all duration-150 hover:-translate-y-px hover:shadow-[0_10px_28px_rgba(63,90,255,0.5)]"
        >
          <Icons.ArrowRightIcon className="w-3.5 h-3.5" />
          Log in
        </a>
      </div>
    </div>
  );
}
