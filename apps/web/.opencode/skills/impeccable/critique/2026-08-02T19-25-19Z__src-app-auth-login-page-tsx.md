---
target: login and register pages (round 2)
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-02T19-25-19Z
slug: src-app-auth-login-page-tsx
---
# Critique — FlowBoard Login & Register pages (round 2, post-fix)

Method: dual-agent (A: ses_03c17e25fffeMk5ows2594IXZR · B: ses_03c17d3d0ffeTfYbQiPWE77Btt)
Browser evidence: partial — Assessment A verified live DOM behavior (empty-submit errors render, stale errors persist); Assessment B captured screenshots but could not read them and had no script-injection tool. No pixel-level verification; dev server live (HTTP 200 both pages).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Spinner/banner/aria-busy work; success banner promises a redirect that doesn't happen |
| 2 | Match System / Real World | 4 | Honest copy throughout; trust claim now true |
| 3 | User Control and Freedom | 2 | Google/GitHub buttons are dead; stub pages offer one exit |
| 4 | Consistency and Standards | 3 | Uniform error pattern; hover:underline inconsistent across links |
| 5 | Error Prevention | 2 | Validation only on submit; no live feedback |
| 6 | Recognition Rather Than Recall | 3 | autofocus/autocomplete/placeholders correct |
| 7 | Flexibility and Efficiency | 2 | Dead social buttons kill the fastest path; no shortcuts |
| 8 | Aesthetic and Minimalist Design | 3 | Left panel over-tells; trust claim duplicated (panel + register footer) |
| 9 | Error Recovery | 4 | Inline + banner + actionable copy, end-to-end ARIA; docked for stale errors |
| 10 | Help and Documentation | 1 | Forgot-password — the highest-anxiety path — is a "coming soon" stub |
| **Total** | | **27/40** | **Acceptable** (up from 23/40) |

## Design Specificity Verdict

**Materially improved: 23 → 27 reflects real system work, not polish.** Error Red is now a first-class token (`--color-error: #e5484d`), the error focus glow is a deliberate red echo of the blue beacon — the observatory metaphor applied to failure. The "Auth Surface Steps" register 34px/26px/22px/12px into DESIGN.md, and the Single Light Source / Weight-Only rules are enforceable. Remaining half-measure: `button-primary` is documented in DESIGN.md but exists only as inline hex (`from-[#5b76ff] to-[#3f56e8]`) — no token in globals.css; the auth pages comply with the named rules while the landing page violates Single Light Source (four gradient beacons).

**Deterministic scan (Assessment B):** 18 findings — 4 color + 12 font-size + 2 gradient-text. After mechanical FP filtering against DESIGN.md: **0 strictly genuine**. All font sizes and star-opacity values are documented (Auth Lead 34px, Form Heading 26px, Stub 22px, Error Text 12px, 19px wordmark, 11–11.5px band, 10.5px tags); both gradient-text flags are the sanctioned single-word headline accent (borderline: the spans hold 2–3 tokens vs "a single word"). No findings in terms/privacy pages.

**Visual overlays:** unavailable (no script injection tool in the connected browser; screenshots unreadable by the agent).

## Overall Impression

The fix round earned its score: the error system is genuinely good, ARIA is wired end-to-end, and DESIGN.md is now an enforceable contract. The remaining problems are *truth problems*, not craft problems: users are asked to consent to Terms that don't exist, the most anxious link (forgot password) dead-ends at a stub, the success banner promises a redirect that never happens, and stale errors never clear while typing. Fix the truth, and this surface is within one round of "Good."

## What's Working

1. **The error system is the observatory applied to failure** — red glow mirrors the blue light source, tokens verified AA (4.6:1 error on field), ARIA wired end-to-end (`aria-invalid`, `aria-describedby`, `role="alert"`, `role="status"`). Verified live: all four register errors render with icons.
2. **DESIGN.md is now an enforceable contract** — tokens, named rules, and Auth Surface Steps mean the next surface builds without inventing anything.
3. **The trust-copy fix is brand-building** — "Free for teams up to 10 · No credit card required" replaces fabricated social proof with a claim the product can honor.
4. **Keyboard/AT fundamentals landed** — global focus-visible rule, 28px password toggle with `aria-label`/`aria-pressed`, name + autocomplete + autofocus on every field.

## Priority Issues

**1. [P1] Register requires consent to Terms/Privacy that are stubs.** (register-form.tsx:156-166 → terms/page.tsx, privacy/page.tsx). Users must check a box committing them to documents that say "we're drafting these."
*Why it matters*: a legal commitment you can't show is trust poison at the exact moment you're onboarding someone.
*Fix*: drop the checkbox's `required`; use informational consent — "By creating an account, you agree to our Terms of Service and Privacy Policy" — as links until the documents exist.
*Suggested command*: /impeccable harden

**2. [P1] Forgot-password dead-ends at "coming soon."** (forgot-password/page.tsx). The most emotional link on the page routes to a stub with no alternative path.
*Why it matters*: locked-out users churn loudly; the valley happens exactly at the highest-stakes moment.
*Fix*: add a real fallback — a support contact (mailto) — and honest copy about what happens next; the stub should at minimum accept the email and explain the flow.
*Suggested command*: /impeccable harden

**3. [P1] Stale inline errors never clear on input.** (login-form.tsx, register-form.tsx — no onChange handling; verified live on /register with a 13-char password while the error persisted).
*Why it matters*: the UI asserts an error about input the user already corrected — every subsequent error loses credibility.
*Fix*: clear the per-field error (and aria-invalid) on change.
*Suggested command*: /impeccable harden

**4. [P2] Mobile has no h1; desktop has two competing 800-weight headlines.** Brand h1 is `display:none` below 980px (empty heading outline for screen readers); on desktop the 34px brand headline and 26px form heading fight at the same weight.
*Why it matters*: broken document outline on mobile; split hierarchy on desktop.
*Fix*: make the form heading the page's single h1 (works on both breakpoints); demote the brand headline to h2; change the decorative "Product Launch v2" h4 to a div.
*Suggested command*: /impeccable audit

**5. [P2] Dead social buttons + a success message that promises a redirect that doesn't exist.** Google/GitHub are `type="button"` no-ops; the success banner says "redirecting to your boards" and nothing happens.
*Why it matters*: both are truth failures at the conversion moment — Casey clicks Google and nothing happens; Jordan waits for a redirect.
*Fix*: disable the social buttons with an explanatory affordance ("coming soon") or wire them; change the success copy to not promise a redirect until one exists.
*Suggested command*: /impeccable clarify

## Persona Red Flags

**Jordan (first-timer):** register fires a wall of 4 simultaneous red errors; the "Electric Blue" tag label in the preview means nothing; the success message says "redirecting" and he waits — nothing happens; weeks later he forgets his password and lands on a stub.

**Sam (a11y-dependent):** no h1 on mobile (the brand h1 is display:none); inline field errors are not announced — after a failed submit, focus stays on the CTA while errors appear above it with no aria-live on the fields (the banner announces; the per-field errors don't); decorative h4 "Product Launch v2" adds heading noise.
*(Note: Assessment A's "double focus ring on inputs" claim is not supported by source — text inputs are excluded from the global focus-visible outline rule; they carry only the shadow ring.)*

**Casey (distracted mobile):** the entire brand panel (and the trust line) vanishes below 980px — a bare form on a black void as the first contact; "Forgot password?" and the password toggle remain sub-44px targets (below WCAG 2.5.8's pointer minimum — a regression-class gap worth noting, the toggle is at least hit-able at 28px but still under the 44px recommendation).

## Minor Observations

- **Production leak:** `app/layout.tsx:23-25` ships the `impeccable-live` script with a token URL in `<body>` — must be removed before any deploy (also the standing lint error).
- Same-class problem moved, not fixed: pravatar stock faces, a named fake person ("Danen Saana commented"), and fabricated "TRUSTED BY MODERN TEAMS" logos remain on the landing page (page.tsx) — out of scope for this surface, but the auth pages are now more honest than the funnel above them.
- Register hint duplication: "At least 8 characters" stays visible while the error "Password must be at least 8 characters" is shown directly beneath it (verified live) — hide the hint when the error fires.
- Trust claim duplicated: left panel + register footer (register-form.tsx:202).
- Landing page `Invite` chip has competing background utilities (`bg-white/[0.04]` + gradient) — CSS order decides.
- Toast lost its animation correctly; "Just now" on a static mock is fine.
- "keep your credentials close" (forgot-password) reads like a security newsletter aside, not a reset-flow promise.
- The Google/GitHub icons keep the platform convention (color vs monochrome) — intentional, per round 1.

## Questions to Consider

1. If the observatory rule is "one beacon per scene," does the login viewport's left panel (headline + board mock + toast + trust row) sell the product, or admit the form can't carry the page alone?
2. You require consent to Terms that don't exist, yet the page a locked-out user desperately needs is a "coming soon" stub — which betrays "beautiful is functional" more?
3. The success banner tells users "redirecting to your boards" and no redirect exists — what does the emotional journey do between that sentence and the moment the user realizes nothing is happening?
4. On mobile you delete the entire brand panel — is the 980px cutoff a layout convenience or a brand decision?
5. Why is fabricated social proof unacceptable at the form but still live one click up the funnel on the landing page?
