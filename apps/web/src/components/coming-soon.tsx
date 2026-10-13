import Link from "next/link";
import { LogoMark } from "./auth/auth-shell";

export function ComingSoonPage({
  title,
  description,
  backLabel = "Back to log in",
}: {
  title: string;
  description: string;
  backLabel?: string;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-bg p-6">
      <div
        className="pointer-events-none absolute top-[-220px] left-1/2 -translate-x-1/2 w-[760px] h-[760px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(63,90,255,0.22), rgba(63,90,255,0.07) 40%, transparent 70%)",
        }}
      />
      <div className="relative z-[2] w-full max-w-[420px] rounded-2xl border border-line bg-panel p-8 text-center">
        <div className="flex justify-center mb-5">
          <LogoMark />
        </div>
        <h1 className="text-[22px] font-extrabold -tracking-[0.02em] mb-3">{title}</h1>
        <p className="text-[14.5px] leading-[1.6] text-muted mb-7">{description}</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 font-bold text-[14.5px] px-5 py-[13px] rounded-[10px] text-white bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] shadow-[0_8px_24px_rgba(63,90,255,0.35)] hover:-translate-y-px hover:shadow-[0_10px_28px_rgba(63,90,255,0.5)] transition-all duration-150 w-full"
        >
          {backLabel}
        </Link>
      </div>
    </main>
  );
}
