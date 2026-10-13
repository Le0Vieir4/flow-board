---
name: FlowBoard
description: A dark-first Kanban platform with real-time collaboration at its core
colors:
  neutral-bg: "#05070d"
  neutral-bg-2: "#070a13"
  neutral-panel: "#10131c"
  neutral-panel-2: "#12151f"
  neutral-card: "#171a26"
  neutral-foreground: "#f2f3f7"
  neutral-muted: "#9a9fae"
  neutral-muted-foreground: "#7a8090"
  primary-blue: "#4f6bff"
  primary-blue-light: "#6d8bff"
  primary-blue-glow: "#3a56ff"
  semantic-success: "#34c77b"
  semantic-warning: "#e2924a"
  semantic-error: "#e5484d"
  semantic-secondary: "#8b6cf5"
  interaction-link: "#8fa3ff"
  interaction-star: "#e2b13c"
  interaction-label: "#d7d9e2"
  surface-field: "#0d0f18"
  tag-electric: "#3b5bff"
  tag-design: "#6a4fd6"
  tag-medium: "#9c6327"
  tag-high: "#c24545"
  tag-low: "#217a4d"
  presence-offline: "#3a3f4e"
  presence-online: "#34c77b"
  toast-gradient-start: "#5b76ff"
  toast-gradient-end: "#3f56e8"
  glow-primary: "rgba(63, 90, 255, 0.30)"
  glow-secondary: "rgba(63, 90, 255, 0.10)"
  glow-tertiary: "rgba(63, 90, 255, 0.16)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 3.625rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.90625rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.03125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
  meta-small:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.71875rem"
    fontWeight: 500
    lineHeight: 1.4
  tiny:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.65625rem"
    fontWeight: 600
    lineHeight: 1.4
  stub-heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 800
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "18px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, #5b76ff, #3f56e8)"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "11px 20px"
  button-primary-hover:
    backgroundColor: "linear-gradient(135deg, #5b76ff, #3f56e8)"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "11px 20px"
  button-outline:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "{colors.neutral-foreground}"
    rounded: "{rounded.md}"
    padding: "11px 20px"
  card-default:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.md}"
    padding: "11px 12px"
  tag:
    backgroundColor: "{colors.tag-electric}"
    textColor: "#ffffff"
    rounded: "6px"
    padding: "3px 8px"
---

# Design System: FlowBoard

## Overview

**Creative North Star: "The Observatory"**

FlowBoard's visual system is a night-time observatory — a deep, immersive dark canvas where focused beams of light reveal structure and activity. The near-black background (#05070d) creates an infinite void; everything that matters sits on elevated panel surfaces that feel like floating instrument consoles. Blue primary accents act as guide lights — they're the brand's voice, not decorative noise.

The system is dark-mode-first by commitment (no light mode). Surfaces are stacked through tonal layering rather than heavy shadows: background → bg-2 → panel → panel-2 → card, each step a slightly lighter shade of near-black. Shadows are reserved for floating elements that need to lift above the stack — cards, modals, toasts.

Key characteristics:
- Deep-space dark background as the canvas, not a mode switch
- Blue-primary light sources (gradient buttons, glowing accents, floating UI elements)
- Tonal surface stacking for depth instead of heavy shadow use
- Ambient glow and subtle starfield texture for atmosphere
- Float animations on interactive/notification elements for ambient motion
- Generous border radius (14px surfaces, 10px cards) for approachability
- Typography is crisp and large — Inter at heavy weights drives hierarchy
- Color tags (electric, design, high, medium, low) as the primary metadata system

## Colors

The palette is built around a near-black neutral core with a single primary blue accent. All surfaces are warm-dark (slightly blue-tinted blacks), never pure #000.

### Primary
- **Signal Blue** (#4f6bff → #6d8bff): The active color. Used for primary buttons, interactive accents, glowing elements, and brand mark. Applied as a gradient (135deg #5b76ff → #3f56e8) on buttons and badges to give a luminous quality.

### Neutral
- **Void** (#05070d): The canvas. Page background, the infinite dark.
- **Void-2** (#070a13): Secondary background zone, subtly separated from void.
- **Panel** (#10131c): Surface cards, sidebars, elevated containers.
- **Panel-2** (#12151f): Interactive panels, dropdowns, toast backgrounds.
- **Card** (#171a26): The lightest surface — task cards, floating elements.
- **Foreground** (#f2f3f7): Primary text, headings, high-emphasis content.
- **Muted** (#9a9fae): Secondary text, descriptions, feature item text.
- **Muted-Foreground** (#7a8090): Tertiary text, timestamps, breadcrumbs, metadata. Lifted from #6b7080 to meet WCAG AA 4.5:1 on the #05070d canvas.
- **Error Red** (#e5484d): Failure states — field errors, form-level error banners, destructive feedback. The system's fourth semantic color; tuned to hold 4.5:1 against field and panel surfaces.

### Semantic
- **Success Green** (#34c77b): Completion states, online presence dots.
- **Warning Amber** (#e2924a): Medium-priority indicators.
- **Secondary Purple** (#8b6cf5): Secondary accent, available for charts or secondary actions.

### Tags (Board metadata system)
- **Electric Blue** (#3b5bff): Priority/category tag.
- **Design Purple** (#6a4fd6): Design review tag.
- **Medium Amber** (#9c6327): Medium priority tag.
- **High Red** (#c24545): High priority tag.
- **Low Green** (#217a4d): Low priority tag.
- Medium and Low were darkened from #b5762e / #2b8f5e so 10.5px white tag text clears 4.5:1.

### Interaction Colors

- **Link Blue** (#8fa3ff): Inline links and secondary link-style actions (form links, toast links).
- **Star Gold** (#e2b13c): Favorites, star ratings.
- **Label Gray** (#d7d9e2): Form field labels, emphasis text just below foreground.
- **Field** (#0d0f18): Form input backgrounds — one step below panel for inset depth.

### Named Rules
**The Single Light Source Rule.** The blue gradient appears on exactly one interactive element per viewport — usually the primary CTA. A second blue element must be noticeably less luminous (flat blue, not gradient). This preserves the observatory metaphor: one beacon per scene.

**The No-Gray-On-Surface Rule.** Secondary text on colored surfaces is tinted from the surface hue, not desaturated to gray. On panel backgrounds, muted text (#9a9fae) carries a slight blue cast from the #10131c foundation.

## Typography

**Display Font:** Inter (with ui-sans-serif, system-ui, sans-serif fallback)
**Body Font:** Inter (same stack)

**Character:** Precision-engineered sans-serif with generous weight steps. The 800-weight display dominates hero sections with tight letter-spacing (-0.02em); 400-weight body stays readable at 1.65 line-height. No secondary font — Inter handles every role through weight and size contrast alone.

### Hierarchy
- **Display** (800, clamp(44px, 7vw, 58px), 1.08): Hero headlines only. Tight tracking (-0.02em). May carry a gradient accent on a single word.
- **Headline** (700, 18px, 1.3): Section titles, board names, modal headings.
- **Title** (600, 14.5px, 1.4): Card titles, feature labels, nav text.
- **Body** (400, 16.5px, 1.65): Paragraph text, descriptions. 65-75ch max width.
- **Label** (500, 13px, 1.4): Buttons, tags, badges, metadata. Smaller sizes (11-12px) for timestamps, breadcrumbs, card IDs use 400 weight.

### Auth Surface Steps

Registered additions used only by the login/register/coming-soon surfaces (approved mockup decisions, kept out of the marketing ramp):

- **Auth Lead** (800, 34px, 1.18): The brand-panel headline on auth pages. Sits between Headline and Display; tracking -0.02em.
- **Auth Form Heading** (800, 26px, 1.2): The form title ("Welcome back" / "Create your account"). Sits between Headline and Auth Lead; tracking -0.02em.
- **Stub Heading** (800, 22px, 1.2): Titles on coming-soon placeholder pages. Sits between Auth Form Heading and Headline; tracking -0.02em.
- **Error Text** (400, 12px, 1.45): Inline field errors and helper hints. Rides the 11-12px band at 12px for legibility; error color #e5484d at 4.5:1+ on field surfaces.

### Named Rules
**The Weight-Only Hierarchy Rule.** Hierarchy is expressed through weight and size, never through font switching, color changes, or text decoration. A headline at 700/18px and body at 400/16.5px — the contrast comes from the weight jump, not a different face.

## Layout

The layout uses a max-width 1440px container centered on the viewport. Side padding is 64px on desktop, narrowing to 28px below 1100px.

The hero section uses a two-column grid (1fr / 1.28fr) on desktop, collapsing to single-column below 1100px where the visual column (board mockup, floating cards) is hidden.

Tight groups inside generous sections — feature items sit close together (34px gap) inside a spacious hero section (60px top padding, 56px below CTAs). More space above headings than below them.

### Named Rules
**The 1100 Breakpoint Rule.** All responsive layout changes collapse at 1100px. Below this: the hero visual hides, nav links collapse, container padding shrinks, and the hero title scales down from 58px to 44px.

## Elevation & Depth

The system uses **tonal layering as the primary depth mechanism**, with shadows reserved for elevated/floating elements.

Surface stacking (lightest to darkest):
- Card (#171a26) — highest surface, task cards
- Panel-2 (#12151f) — floating panels, toasts
- Panel (#10131c) — sidebar, board surface
- Bg-2 (#070a13) — subtle background separation
- Bg (#05070d) — page canvas

### Shadow Vocabulary
- **Card Shadow** (`0 8px 20px rgba(0,0,0,0.25)`, `--shadow-card`): Default task cards in the board view.
- **Elevated Shadow** (`0 20px 40px rgba(0,0,0,0.4)`, `--shadow-elevated`): Floating UI elements (comment card, avatar stack); hover elevation for board cards.
- **Modal Shadow** (`0 30px 60px rgba(0,0,0,0.55)`, `--shadow-modal`): High-elevation elements (toast notifications, floating task cards).
- **Button Shadow** (`0 6px 20px rgba(63,90,255,0.35)`, `--shadow-button`): Primary buttons only — colored shadow tied to the blue glow.
- **Board Shadow** (`0 50px 100px -20px rgba(0,0,0,0.65)`, `--shadow-board`): The hero board mockup — deepest shadow in the system.

### Named Rules
**The Flat-By-Default Rule.** Surfaces at rest are flat. Shadows appear only as elevation signals — cards don't cast shadows in a column; they only cast shadows when they float above the board (toasts, comment cards, modals).

## Shapes

The system uses generous, consistent rounding. Every surface is rounded; sharp 0-radius corners do not appear.

- **Panels & surfaces** — 14px radius (--radius)
- **Task cards** — 10px radius (--radius-card)
- **Buttons** — 10px radius
- **Badges/pills** — 12px radius (small), full-radius for large pills
- **Small tags & chips** — 6px radius
- **Logo mark** — 9px radius
- **Avatars** — full rounded (50%)
- **Board mockup** — 18px radius (hero presentation only)

Borders are ultra-subtle: `rgba(255,255,255,0.08)` for standard lines, `rgba(255,255,255,0.06)` for soft dividers. No thick borders, no colored left borders.

### Named Rules
**The Generous Curve Rule.** Every rectilinear element has a visible radius. The smallest radius (6px) is still noticeable — nothing is squared off. This prevents the dark theme from feeling harsh or industrial.

## Components

### Buttons
- **Shape:** 10px radius, no border (primary) or 1px solid --color-line (outline)
- **Primary:** Gradient background (#5b76ff → #3f56e8), white text, 600 weight, 14.5px. Blue-tinted shadow. Hover lifts 1px and deepens shadow.
- **Outline:** `rgba(255,255,255,0.03)` background, foreground text, --color-line border. Hover increases background opacity to 6%.
- **Transition:** 150ms ease on transform, box-shadow, and background. No transition on color properties.
- **Icon:** 15px SVG inline, placed after text, arrow-right for primary CTAs, play for demo.

### Tags
- **Shape:** 6px radius, solid background, white text, 10.5px, 600 weight
- **Colors:** Electric Blue (#3b5bff), Design (#6a4fd6), High (#c24545), Medium (#9c6327), Low (#217a4d)
- **Usage:** Board card metadata, positioned left of the card footer. Used for priority and category classification.

### Cards (Task Cards)
- **Corner Style:** 10px radius
- **Background:** --color-card (#171a26)
- **Border:** `1px solid rgba(255,255,255,0.06)` — barely visible, separates card from panel
- **Shadow Strategy:** Card shadow (0 8px 20px rgba(0,0,0,0.25)) only when card is rendered on a lighter surface
- **Internal Padding:** 11px 12px
- **Internal structure:** ID (10.5px, muted-foreground) → Title (12.5px, #eef0f6, medium weight, 1.35 line-height) → Footer row with tag left + avatars/checklist right

### Navigation
- **Style:** Horizontal bar, transparent background, left-aligned logo + center links + right-side auth/CTA
- **Logo:** Gradient mark (34px, 9px radius) + "FlowBoard" wordmark (800 weight, 19px)
- **Nav links:** 14.5px, 500 weight, #cfd2dc default → white on hover, 150ms color transition. Hidden on mobile.
- **Mobile:** Links collapse; only logo + auth/CTA remain visible below 1100px.

### Badge
- **Shape:** Full rounded pill (20px+), `rgba(255,255,255,0.04)` background, --color-line border
- **Content:** "New" pill (gradient badge) + text label + arrow icon
- **Usage:** Feature announcement, hero section kicker

### Ambient Elements
- **Glow Primary:** Large radial gradient (1100px, blurred 10px) at top-right: `rgba(63, 90, 255, 0.30)` → `rgba(63, 90, 255, 0.10)` 40% → transparent 70%. Used on `/boards` entry page only.
- **Glow Secondary:** Medium radial gradient (700px) at bottom-left: `rgba(63, 90, 255, 0.10)` → transparent 70%. Used on `/boards` entry page only.
- **Glow Tertiary:** Subtle radial gradient for empty states and modals: `rgba(63, 90, 255, 0.16)` → transparent 70%.
- **Starfield:** Multiple 1px radial-gradient dots at varied opacities (15-35%), spread across the viewport. Opacity 0.6 default, reduced to 0.3 with `prefers-reduced-motion`.
- **Float Animation:** 6-7s ease-in-out infinite, 8px Y-offset. Applied to notification cards, toasts, floating elements only — never to structural components. Disabled with `prefers-reduced-motion`.

## App Surfaces (Dashboard)

Rules that survived the dashboard build, registered so the small-type band and app-state colors are intentional system steps rather than drift.

### Type Band for Dense Surfaces

The dashboard adds a small-type band below Label for high-density working surfaces. All steps are Inter, same family, weight 500 except where noted:

- **Label** (500, 13px): Column headers, sidebar nav items, board names, chip labels.
- **Meta** (500, 12px): Board card descriptions, toast body text, view-chip labels.
- **Meta-Small** (500, 11.5px): Field labels in the task modal, section counts, sidebar group labels, time chips.
- **Tiny** (500, 11px): Due dates, comment timestamps, column count badges, breadcrumb.
- **Micro** (600, 10.5px): Tag text, card IDs, "Soon" badges. Weight 600 at the smallest size to hold legibility; white at 4.5:1 against tag colors and muted-foreground on card surfaces.

### App Shell

- Sidebar is a fixed 232px panel on `panel` surface, separated from content by a standard line. Content surface is `bg` (page canvas) — panels float on void.
- Primary navigation is 14.5px/500 (existing nav rule); section group labels use Meta-Small muted-foreground.
- Below 900px the sidebar becomes an off-canvas drawer (264px) with a full-height scrim overlay; the topbar shows a menu toggle. This is the dashboard's own breakpoint, separate from the marketing 1100px rule.
- "My Tasks" (`/tasks`) and "Notifications" (`/notifications`) are live nav items. The Notifications item carries an unread pill: Micro (10px) bold white on flat `tag-electric` — a signal from the tag system, never a second gradient source.

### My Tasks (Triage Wall)

- Surface: page on void; 22px/800 heading with an open-task count (Meta). The scope switch (My tasks / All tasks) is a flat segmented chip group — no gradient, no primary action on this surface.
- Tasks group by due date into **Overdue / Today / Upcoming / No due date**; section headers + counts reuse the Boards Home band (14.5px/700 label, Meta-Small count pill).
- Row cards: `panel` surface, line-soft border, 10px radius; title 13.5px/600, subline rides Tiny (label · board · column · relative time). Left-aligned tags; right-aligned due chips — **overdue is a flat warning-tinted pill** (warning/10 fill, warning text), never an error-red fill. Assignee AvatarStack (22px) with presence dots on the row tail.
- Completed checklists are excluded from the list; a finished task's title renders struck in muted-foreground (checklist-complete is the done signal, not a section).
- Rows deep-link to their board. Columns are constrained to 860px max for scanability (the measure rule applied to a working list).

### Notifications (Inbox)

- Content on void; one flat "Mark all read" outline chip (link-emphasis is forbidden a gradient), shown only when something is unread.
- Rows: 26px actor avatar; unread = 6px electric-blue dot + `white/[0.03]` fill; read = 5px `white/[0.06]` dot, no fill. Actor name is semibold (foreground unread, muted read); the action reads as one sentence — "moved FB-134 to Review".
- Groups Today / Yesterday / Earlier with counts. Rows deep-link to the board and auto-mark read.
- The feed is **event-driven**: inbound relay moves append entries live; a queryable in-memory store (`notification-store`) with a demo seed land the first five, so the inbox is never empty in the demo.

### Boards Home (Status Wall)

- Boards group into sections by status: **Active**, **On hold**, **Archived**. Section headers sit on `bg-2`-style separators; each section's count uses Meta-Small muted-foreground.
- Each board card: name (Headline 18px/700), description (Meta, muted), a mini column strip of the board's columns, avatar presence stack, and "Updated <relative time>" (Meta, muted-foreground).
- Freshness dot on the card foot uses success green when the board was touched recently; muted-foreground otherwise.
- Empty state: centered 22px/800 heading on the same band as Stub Heading, muted body copy, one gradient CTA.

### Board View

- Topbar: breadcrumb (Tiny, muted-foreground), editable board title (Headline), a **Live chip** — flat, 6px radius, success-green presence dot + "Live" label, tinted surface — and a presence AvatarStack at the right. View chips (Board / List / Calendar) are secondary; Board is active.
- Columns are 272px wide on `panel` surface, separated by a 16px gap, vertical scroll. Column header: name (Label) + count badge (Tiny on `panel-2`). Column menu (rename/delete) and the add-column tile are outline/ghost actions — never gradient.
- The gradient CTA per viewport on the board view is the primary action (e.g. "New task" composer); the Live chip and view chips stay flat.
- The Single Light Source Rule applies: exactly one gradient interactive element per viewport. When a modal is open, its CTA is that element; the sidebar's New Board button recedes to flat.
- Task card anatomy is the registered Card component (10.5px ID → 12.5px title → footer: tag + avatars/checklist). Drag state lifts the card with Elevated Shadow; drag-over column gets a 2px dashed accent line.

### Task Modal

- Panels: surface `panel-2`, 18px radius, Modal Shadow. Title field (18px/700), description (Body 16.5px), fields use Meta-Small labels on `field` surfaces. Checklist items are 13px/500.
- The delete action is flat error-red text, never a red button.
- **Assignee row:** avatars are display-only; the flat "Assign" chip opens a member picker — a 240px `panel-2` surface with Elevated Shadow, anchored fixed above the footer because the modal panel clips overflow. Members toggle with a flat primary check circle; Escape and outside-click dismiss.

### Toasts

- Stack bottom-right, 320px wide, `panel-2` surface, Modal Shadow. Icon tile is 34px with the registered button gradient — actor-colored signal — and the actor name is Link Blue.
- Auto-dismiss at 5200ms with 180ms entrance (`toast-in`) and 300ms count bump on column badges (`count-bump`) — the only two authored motion steps; both respect `prefers-reduced-motion`.

### Presence

- Presence dots: success green (#34c77b) online, `presence-offline` (#3a3f4e) away. The offline dot is a documented token, not a gray fallback. One lit dot + "2 others" label keeps the stack compact.

## Do's and Don'ts

### Do:
- **Do** use the tonal surface stack (bg → bg-2 → panel → panel-2 → card) for depth instead of shadows
- **Do** apply the blue gradient to exactly one primary action per viewport
- **Do** use generous border radius (14px for panels, 10px for cards) on all rectilinear surfaces
- **Do** keep the float animation limited to notification/ambient elements only
- **Do** use Inter weight contrast (800 vs 400) as the primary hierarchy mechanism

### Don't:
- **Don't** introduce a light mode or light-themed variant
- **Don't** use sharp 0px corners — every surface must have visible rounding
- **Don't** add shadows to in-flow cards — shadows are for elevated/floating elements only
- **Don't** use gradient text outside the hero headline's single-word accent
- **Don't** add a second accent color that competes with Signal Blue
- **Don't** use glass, backdrop-filter blur, or frosted-glass effects as decoration
