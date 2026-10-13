---
target: login and register pages
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-02T19-05-32Z
slug: src-app-auth-login-page-tsx
---
# Critique — FlowBoard Login & Register pages

Method: dual-agent (A: ses_03c24a36affeRTZLZPxlNlvSft · B: ses_03c248c3bffeFknISE5k7jd6pB)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Submit is preventDefault; no loading/success/error feedback anywhere |
| 2 | Match System / Real World | 4 | Natural copy, concrete placeholders; "Work email" slightly off-market |
| 3 | User Control and Freedom | 2 | Only recovery exit (Forgot password?) is a dead link |
| 4 | Consistency and Standards | 3 | Cohesive with landing page; dead links + absent focus styles break platform norms |
| 5 | Error Prevention | 2 | Native email/required only; nothing for wrong password, dupes, weak passwords |
| 6 | Recognition Rather Than Recall | 4 | All visible, labels persistent, autoComplete served correctly |
| 7 | Flexibility and Efficiency | 2 | No autofocus on email; no accelerator paths |
| 8 | Aesthetic and Minimalist Design | 3 | Form disciplined; animated toast + 12k-teams claim add noise |
| 9 | Error Recovery | 1 | Native tooltips only; no error UI, no aria-live |
| 10 | Help and Documentation | 1 | Only help affordance is a dead link |
| **Total** | | **23/40** | **Acceptable** |

## Design Specificity Verdict

**Partially grounded: composition interchangeable, content product-native (6/10).** The split-screen brand-theater + form column is the industry-default dark SaaS skeleton (Linear, Vercel, Supabase all use it). What earns credit is the content: the preview board "Product Launch v2" is the same board from the landing hero, with the real tag system and a real-time toast dramatizing the actual differentiator. Login shows In Progress/Review (returning to mid-flight work); register shows Backlog/Todo (fresh start) — product-true storytelling. But: the preview strips card IDs, avatars, checklists that make the landing mock feel alive; the "12,000+ teams" trust row with pravatar stock faces is the most category-generic pattern on the page — and a fabricated claim for a pre-alpha product.

**Deterministic scan** (Assessment B): 14 findings — 10 design-system-font-size, 4 design-system-color, 2 gradient-text. Most are **false positives**: star-opacity values (0.15–0.35) are within DESIGN.md's documented starfield allowance; 19px is the documented wordmark size; 11–11.5px sits inside the documented 11–12px timestamp band; 10.5px is the documented tag size; both gradient-text flags are single-word headline accents explicitly permitted by DESIGN.md's "gradient accent on a single word" rule. **Genuine drift**: 34px h1 (Display ramp starts at 44px), 26px form headings (no ramp step between Title 14.5px and Display 44px), 9.5px tag text (tags documented at 10.5px). Note: the 26px/34px sizes come straight from the approved reference mockups, so they are deliberate surface decisions — but they are unregistered on the ramp.

**Visual overlays**: unavailable — Browser MCP is not connected (extension error: "No connection to browser extension"). CLI scan ran clean; live-server.mjs started and served detect.js (200), but injection never happened without a browser session. Fallback signal: dev server verified live via curl (/login, /register → 200); no pixel-level evidence.

## Overall Impression

Faithful, warm, and beautifully on-brand for a mockup — but it's a *mockup-quality* surface: no error states, no loading states, dead legal links, and an animated toast competing with the form. The biggest opportunity: auth is the highest-stakes moment in the product, and right now the system has no way to express failure at all (there is no error color in the token set).

## What's Working

1. **Product-continuity storytelling.** The board preview uses the real board name, tag system, and a real-time toast — the auth pages dramatize the real-time differentiator. Login (In Progress/Review) vs register (Backlog/Todo) is a subtle, correct emotional distinction.
2. **Single Light Source discipline on the form.** One gradient CTA, flat social buttons, flat links — the beacon pattern holds exactly where attention must land.
3. **Input focus design.** Blue border + soft 3px ring is on-brand, visible on near-black, distinct from hover — the best-crafted state in the system. Plus correct autoComplete wiring for password managers.

## Priority Issues

**1. [P0] No error, loading, or success architecture.** No wrong-password state, no duplicate-account state, no network-failure state, no button loading state. Every failure currently lands on raw browser tooltips. Auth is the highest-stakes surface — and the palette has no error color at all.
*Why it matters*: A mistyped password gets zero guidance; the next attempt happens in anxiety. Register can't say "this email already has an account."
*Fix*: Add `--color-error` tuned to the warm-dark palette; design inline field errors (icon + text + aria-describedby + aria-live); submit loading state (spinner, disabled, aria-busy); duplicate-email path on register.
*Suggested command*: /impeccable harden

**2. [P0] Dead links at trust-critical moments.** `Forgot password?`, `Terms of Service`, `Privacy Policy` are all `href="#"` (login-form.tsx:57,75-81; register-form.tsx:70-75). Register *requires consent* to legal documents that cannot be opened.
*Why it matters*: The checkbox is a legal commitment at the emotional peak; discovering the docs are stubs is a first-minute trust violation.
*Fix*: Ship real routes before the consent checkbox exists, or remove the checkbox requirement until the pages exist.
*Suggested command*: /impeccable harden

**3. [P1] Contrast failures on small text and tags.** `muted-foreground` #6b7080 on #05070d ≈ 4.2:1, used for placeholders, terms line, trust row, toast timestamps, divider (all ≤12.5px) — fails WCAG AA 4.5:1. Tags `low` #2b8f5e and `medium` #b5762e with 9.5px white text ≈ 3.9–4.1:1 — failing, and the tag system ships into the product.
*Why it matters*: Locked-out tertiary text for low-vision users; brand-system debt beyond this page.
*Fix*: Lift muted-foreground to ≥ #7a8090 or use muted #9a9fae for these roles; raise tag text to 10.5px or lighten low/medium tag backgrounds.
*Suggested command*: /impeccable audit

**4. [P1] No focus-visible styles on buttons or checkboxes.** Inputs get a ring, but the submit button, both social buttons, the password toggle, and both checkboxes have no focus treatment. The toggle is a 15×15px target — below WCAG 2.5.8 (24px minimum).
*Why it matters*: Keyboard users can't tell where they are on the two most important actions; the toggle is nearly unhittable on touch.
*Fix*: Standardize a focus-visible ring across all interactive elements; bump the toggle to a 28–32px hit area.
*Suggested command*: /impeccable audit

**5. [P2] Animated toast + fabricated social proof distract and mislead.** The floating toast is the strongest motion on the viewport, adjacent to the form; "12,000+ teams" with stock avatars is false advertising for a pre-alpha.
*Why it matters*: Motion fights the form for attention (cognitive-load failure); the claim becomes the brand's first credibility debt.
*Fix*: Pause ambient animation on the auth surface (or make it static); replace the claim/avatars with something true (e.g. "Free for teams up to 10", or a live product teaser).
*Suggested command*: /impeccable quieter

## Persona Red Flags

**Jordan (confused first-timer):**
- Eyes land on the animated toast before the form.
- "Work email" contradicts the product's own audience — PRODUCT.md names freelancers and solopreneurs, who often have no work email.
- Clicks "Forgot password?" → nothing happens. Dead end at the exact point of friction.
- Register's password field states no requirements and gives no feedback.
- On mobile, all persuasion (board preview, "under a minute" headline) vanishes.

**Sam (accessibility-dependent):**
- Placeholders, terms line, trust row, toast time, divider text, and low/medium tags all fail 4.5:1.
- No focus-visible ring on any button or checkbox.
- Labels are correctly associated and the toggle has an aria-label — but no `aria-pressed`, no `aria-live` anywhere, so future errors will be announced to no one.
- 15px toggle and 15px checkboxes are below minimum target size.
- 9.5px bold tag text is legibility-hostile even before the ratio check.

**Casey (distracted mobile):**
- Left panel correctly hidden; form centered with adequate padding — functionally sound.
- 15px password toggle is a thumb-target miss mid-form.
- No autofocus means the first tap goes to layout, not the email field.
- Register's inline Terms links are easy to mis-tap and lead nowhere.
- autoComplete is correct — password managers will work; the single biggest mobile saver.

## Minor Observations

- No `name` attributes on any input — the moment real submission lands, form data will silently be empty.
- Google icon is full color; GitHub icon is monochrome — inconsistent within one row.
- No autofocus on the login email field — free efficiency.
- Tag label "Electric Blue" names a color, not a category.
- Two h1-scale claims fight on desktop (34px left vs 26px right).
- Mobile shows two gradient light sources (logo + CTA) in one viewport.
- No "Back to FlowBoard" affordance — auth pages are a navigation dead end.
- Hardcoded hexes (#8fa3ff, #7d95ff, #e2b13c, #d7d9e2, #e7e9f0) exist outside the token system and will drift.
- Detector's genuine ramp drift (34px, 26px, 9.5px) comes from the approved mockups — deliberate but unregistered.

## Questions to Consider

1. What if the left panel showed the *user's* boards after first login — "Welcome back, Maria" with real in-flight work — instead of a canned board? The auth page could be the first proof of real-time sync.
2. If the observatory rule is one beacon per scene, is the animated toast actually the primary CTA of this viewport?
3. Can register absorb the "under a minute" promise into the form itself — a 3-step inline sequence that demonstrates the speed claim instead of asserting it?
4. Is "Work email" the label of a PM product or an enterprise product? The label quietly contradicts the target market.
5. What would failure look like in this observatory? When a wrong-password moment arrives, does the dark, calm system make the user feel held rather than blamed — and is the palette even capable of that before `--color-error` exists?
