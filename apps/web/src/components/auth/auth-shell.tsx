import type { ReactNode } from "react";
import Link from "next/link";
import { Icons } from "@flow/ui";

export type AuthTag = { label: string; color: string };
export type AuthCard = { title: string; tag?: AuthTag };
export type AuthColumn = { name: string; count: string; cards: AuthCard[] };

export function LogoMark({ size = "default" }: { size?: "default" | "small" }) {
  return (
    <span
      className={
        size === "small"
          ? "flex items-center justify-center w-5.5 h-5.5 rounded-md bg-linear-to-br from-primary-2 to-[#3549d1] shrink-0"
          : "flex items-center justify-center w-8.5 h-8.5 rounded-card bg-linear-to-br from-primary-2 to-[#3549d1] shadow-card-glow shrink-0"
      }
    >
      <svg viewBox="0 0 24 24" fill="none" className={size === "small" ? "w-2.75 h-2.75" : "w-4 h-4"}>
        <path d="M4 4h16M4 12h11M4 20h7" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Stars() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.35) 0, transparent 40%)," +
          "radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,0.25) 0, transparent 40%)," +
          "radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.2) 0, transparent 40%)," +
          "radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.2) 0, transparent 40%)," +
          "radial-gradient(1px 1px at 60% 45%, rgba(255,255,255,0.15) 0, transparent 40%)",
      }}
    />
  );
}

export function AuthShell({
  headline,
  paragraph,
  boardName,
  columns,
  toast,
  trustText,
  children,
}: {
  headline: ReactNode;
  paragraph: string;
  boardName: string;
  columns: AuthColumn[];
  toast: { text: ReactNode; time: string };
  trustText: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.05fr_1fr] min-h-screen max-[980px]:grid-cols-1">
      <div className="relative overflow-hidden flex flex-col justify-between p-12 pl-14 border-r border-line max-[980px]:hidden">
        <div
          className="pointer-events-none absolute -top-40 -left-40 w-225 h-225"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(63,90,255,0.28), rgba(63,90,255,0.09) 40%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-55 -right-40 w-160 h-160"
          style={{ background: "radial-gradient(circle, rgba(139,108,245,0.14), transparent 70%)" }}
        />
        <Stars />

        <div className="relative z-2 flex items-center gap-2.5 font-extrabold text-lg tracking-[-0.01em]">
          <LogoMark />
          FlowBoard
        </div>

        <div className="relative left-1/2 -translate-x-1/2 mt-7.5 mb-12.5 max-w-110">
          <div className="relative z-2">
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] leading-[1.18] mb-3.5">{headline}</h2>
            <p className="text-sm leading-[1.6] text-muted">{paragraph}</p>

            <div className="relative z-2 mt-10">
              <div className="bg-linear-to-br from-panel-2 to-[#0c0e16] border border-white/9 rounded-2xl p-4.5 shadow-card-deep max-w-105">
                <div className="flex justify-between items-center mb-3.5">
                  <div className="text-sm font-bold text-white">{boardName}</div>
                  <span className="text-star text-sm">★</span>
                </div>
                <div className="flex gap-3">
                  {columns.map((column) => (
                    <div key={column.name} className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs font-semibold text-muted mb-2">
                        {column.name} <span>{column.count}</span>
                      </div>
                      {column.cards.map((card) => (
                        <div
                          key={card.title}
                          className="bg-card border border-white/6 rounded-field p-2.5 mb-2"
                        >
                          <div className="text-xs text-foreground mb-1.75 font-medium leading-[1.3]">
                            {card.title}
                          </div>
                          {card.tag && (
                            <span className={`inline-block text-2xs font-bold px-1.75 py-0.5 rounded-tag text-white ${card.tag.color}`}>
                              {card.tag.label}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
          
        </div>
         <div className="absolute right-10 bottom-5 w-13 bg-panel-2 border border-white/9 rounded-xl p-3 flex gap-2.5 items-start shadow-toast-deep">
            <span className="w-7 h-7 rounded-lg bg-linear-to-br from-[#5b76ff] to-[#3f56e8] flex items-center justify-center shrink-0">
              <Icons.ZapIcon className="w-3.25 h-3.25 text-white" strokeWidth={1.8} />
            </span>
            <div className="text-xs leading-[1.45]">
              {toast.text}
              <span className="block text-muted-foreground text-2xs mt-px">{toast.time}</span>
            </div>
          </div>

        <div className="relative z-2 flex items-center gap-2.5 text-muted-foreground text-xs">
          <Icons.CheckCircleIcon className="w-3.5 h-3.5 text-success/80" strokeWidth={1.8} />
          {trustText}
        </div>
      </div>

      <div className="flex items-center justify-center p-10 bg-bg">
        <div className="w-full max-w-95">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 mb-6"
          >
            <Icons.ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
            Back to FlowBoard
          </Link>
          <div className="hidden max-[980px]:flex items-center gap-2.5 font-extrabold text-lg mb-9">
            <LogoMark />
            FlowBoard
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
