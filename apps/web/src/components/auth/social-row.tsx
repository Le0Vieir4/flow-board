"use client";

import { oauthUrl } from "@/hooks/useAuth";
import { Icons } from "@flow/ui";

export function SocialRow() {
  return (
    <div className="flex gap-3 mb-6.5">
      <button
        type="button"
        onClick={() => window.location.assign(oauthUrl("google"))}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-field border border-line bg-white/3 text-sm font-semibold text-foreground cursor-pointer hover:bg-white/6 hover:-translate-y-px transition-all duration-150"
      >
        <Icons.ChromeIcon className="w-4 h-4" strokeWidth={1.8} />
        Google
      </button>
      <button
        type="button"
        onClick={() => window.location.assign(oauthUrl("github"))}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-field border border-line bg-white/3 text-sm font-semibold text-foreground cursor-pointer hover:bg-white/6 hover:-translate-y-px transition-all duration-150"
      >
        <Icons.GithubIcon className="w-4 h-4" strokeWidth={1.8} />
        GitHub
      </button>
    </div>
  );
}