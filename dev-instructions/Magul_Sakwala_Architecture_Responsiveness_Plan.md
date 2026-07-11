# Magul Sakwala — Project Architecture & Responsiveness Plan

Stack (per project's package.json): React 19 + Vite + react-router-dom v7.

The folder/file structure is not prescribed here — the agent is responsible for designing and creating it, following the requirements and best practices below. It should be documented once decided (see Batch 1).

## Architecture Requirements (agent must satisfy, structure is its call)

- Colors/design tokens live in their own dedicated theme location, separate from everything else — single source of truth, not duplicated inline across components
- CSS lives in its own dedicated location/pattern, separate from component logic — co-located or centralized, agent's choice, but consistent across the whole project
- Shared/reusable UI pieces (buttons, cards, inputs, nav, footer, etc.) live in their own common/shared location, separate from page-specific code
- Each page (Home, HowItWorks, Register, ThankYou, PrivacyTrust, ContactFaq) lives in its own dedicated pages location, built only from the shared pieces above
- Routing, hooks, utilities, and constants (e.g. validation logic, district list) should each have a sensible, consistent home — agent decides based on React + Vite conventions
- No hardcoded colors, spacing, or breakpoints scattered through component files — everything pulls from the central theme

## Responsiveness Strategy

**Breakpoints (mobile-first, defined once centrally and reused everywhere — never redefined per component):**
- `sm`: 480px — large phones
- `md`: 768px — tablets
- `lg`: 1024px — small desktops / nav breakpoint (mobile menu ↔ full nav)
- `xl`: 1280px — desktop

**Rules:**
- Write base styles for mobile first, add `min-width` media queries upward — never the reverse
- Fluid type/spacing via `clamp()` instead of fixed breakpoint jumps where practical
- Images always `max-width: 100%; height: auto`
- Touch targets minimum 44x44px on all interactive elements
- No horizontal scroll at any breakpoint — test at 360px minimum width

**Mobile menu (critical requirement):**
- Full horizontal nav shown above `lg` (1024px)
- Below `lg`: hamburger icon replaces nav links
- Tapping hamburger opens an off-canvas panel (slide in from right) with a semi-transparent backdrop overlay
- Body scroll locked while menu is open
- Menu closes on: tapping a link, tapping the backdrop, or pressing Escape
- Animated open/close transition (200–300ms), consistent with the rounded/soft visual style from the design brief
- Hamburger icon animates to an X when open; `aria-expanded` toggled for accessibility

---

## Batches (Agent Prompts)

### Batch 1 — Design & Scaffold the Architecture
```
Before writing any feature code, design the project's folder/file
architecture for this React + Vite + react-router-dom app. Requirements
it must satisfy:

- A dedicated location for design tokens/theme (colors, typography,
  spacing, breakpoints) as a single source of truth
- A dedicated, consistent approach for CSS across the project
- A dedicated location for shared/reusable common components, separate
  from page-specific code
- A dedicated location for pages, one per route, built only from shared
  components
- Sensible homes for routing config, hooks, utilities, and constants

Decide the structure yourself based on React + Vite best practices, scaffold
the empty folders/files, and write out the structure you chose (as a short
tree or list) so it's clear before moving to the next batch. Do not add
styling or logic yet — this batch is structure only.
```

### Batch 2 — Theme Tokens
```
In the theme location you created, define design tokens as the single
source of truth:

- Colors: primary crimson #E63946, blush pink #FCE8ED/#F7D9E0, coral/
  salmon #F4867C, magenta-purple gradient stops #C147E9 → #E91E8C,
  lavender-grey #EEF0F7, white #FFFFFF, charcoal #333333
- Typography: font family, heading/body scale, weights
- Spacing: scale (4/8/12/16/24/32/48/64px)
- Breakpoints: sm 480, md 768, lg 1024, xl 1280

Mirror every token as a CSS custom property so both JS and CSS pull from
the same values — no duplication, no hardcoded colors anywhere else in
the project from this point forward.
```

### Batch 3 — Global Styles & CSS Architecture
```
Build the base CSS layer using the CSS approach you chose in Batch 1:
- A minimal modern reset (box-sizing, margin/padding reset, media defaults)
- Global defaults: body font/background/color, heading scale, link states
  — all sourced from the theme tokens from Batch 2
- A small set of utility helpers (visually-hidden, container, flex/stack
  helpers)

Confirm no unstyled-content flash and no hardcoded colors, spacing, or
font sizes outside the theme tokens.
```

### Batch 4 — Common Component Library
```
Build these shared components in your common/shared components location.
All must be responsive by default (fluid padding/font-size via clamp(),
no fixed pixel widths that break below 360px):

- Button: pill-shaped, gradient variants (primary red-to-pink, secondary
  purple-to-magenta), min touch target 44px height
- Card: rounded corners, soft shadow, flexible padding
- Input / Select: form field styling matching the design brief, clear
  focus states, 44px min height for touch
- Badge: circular badge for step numbers/small stats
- SectionDivider: scalloped/wave shape divider between page sections

Do not wire these into pages yet — build and visually verify each in
isolation first.
```

### Batch 5 — Navbar & Mobile Menu
```
Build a Navbar component and its mobile menu counterpart in your shared
components location:

- Above 1024px: full horizontal nav with logo + links
- Below 1024px: nav links hidden, hamburger icon shown
- Hamburger opens an off-canvas panel (slide in from right), semi-
  transparent backdrop behind it, body scroll locked while open
- Close on: link tap, backdrop tap, Escape key
- Animate open/close (200-300ms transition)
- Hamburger icon morphs to X when open; toggle aria-expanded and
  aria-controls for accessibility
- Build a reusable media-query hook for any JS-level breakpoint detection
  needed, but rely on CSS media queries for the actual show/hide

Test by resizing the browser through every breakpoint — menu must never
overlap content or cause horizontal scroll.
```

### Batch 6 — Footer Component
```
Build a Footer component in your shared components location:
- Desktop: four-column layout (Information / Account / Help / Legal) plus
  newsletter signup band
- Tablet: two columns
- Mobile: single stacked column, newsletter email input full-width
- Matches the bold red footer treatment from the design brief
```

### Batch 7 — Page Assembly & Routing
```
Build all six pages using ONLY the shared components from Batches 4-6
(no one-off styled elements inside pages):

- Home, HowItWorks, Register, ThankYou, PrivacyTrust, ContactFaq

Wire up routing with react-router-dom v7 in whatever location you
designated for routing config in Batch 1. Every page must be mobile-
first: single-column stack on mobile, expanding to multi-column/grid
layouts at md/lg breakpoints where the content calls for it (e.g. member
gallery grid, feature cards).
```

### Batch 8 — Registration Form Responsiveness & Validation
```
On the Register page: fields stack vertically full-width on mobile,
switch to a two-column layout on md+ where pairs make sense (e.g.
Gender + DOB side by side). All fields min 44px touch height. Add
client-side validation (required fields: Name, Email, Gender, DOB,
District; optional: Birth Time, Photo), using the utilities/constants
locations you set up in Batch 1 for validation logic and the district
list. On successful submit, route to the ThankYou page.
```

### Batch 9 — Responsiveness QA Pass
```
Test every page at 360px, 480px, 768px, 1024px, 1280px, and 1440px
widths. Verify: no horizontal scroll at any width, mobile menu opens/
closes correctly and traps scroll, all tap targets ≥44px, images scale
without distortion, text remains readable (no overflow/clipping) at
every breakpoint, and the layout transitions smoothly between breakpoints
with no abrupt jumps.
```

### Batch 10 — Accessibility Pass
```
Verify: mobile menu is operable via keyboard (Tab to hamburger, Enter to
open, Escape to close, focus trapped inside while open, focus returns to
hamburger on close), all interactive elements have visible focus states,
color contrast of text against backgrounds meets WCAG AA using the
theme palette, and all images have meaningful alt text (or alt="" for
decorative graphics).
```
