# Magul Sakwala — Build Batches

Source plan: `Magul_Sakwala_Phase1_Website_Plan   dev.md` (site map + design/look-and-feel brief).
Goal: build full Phase 1 site, batch by batch.

---

### Batch 1 — Project Setup & Design System
- Install router (React Router)
- Set up design tokens: colors, typography, spacing from design brief
  - Primary crimson `#E63946`, blush `#FCE8ED` / `#F7D9E0`, coral `#F4867C`,
    magenta-purple gradient `#C147E9` → `#E91E8C`, lavender-grey `#EEF0F7`,
    charcoal `#333333`
- Build shared layout: header, footer, nav (rounded, pill-button style)
- Build reusable components: pill button, rounded card, circular badge,
  circular ring-bordered image placeholder
- Build a generic `ImagePlaceholder` component (labeled gray box, shows
  required dimensions + alt text) per image-handling rules in the brief

### Batch 2 — Home Page
- Hero section: placeholder 1600x900 (16:9) hero image, pitch copy, trust
  principles (private, curated, no public profiles)
- CTA button linking to Register
- "How It Works" teaser section with link to full page
- Alternating section background bands (white / lavender-grey / bold red)

### Batch 3 — How It Works Page
- Step-by-step process content: register → private review → we contact
  both sides → mutual consent → introduction
- Circular numbered step badges, scalloped/wave section dividers

### Batch 4 — Register Page (Form UI)
- Build form: Name, Email, Gender, Date of Birth, District (required);
  Birth Time, Profile Photo (optional)
- Client-side validation (required fields, email format, DOB range)
- Rounded card layout, pill submit button
- Reserve 800x800 (1:1) placeholder for any registration/trust section image

### Batch 5 — Backend & Data Storage
- Set up private storage/DB (no public read access)
- Wire form submit to storage (server function or API route)
- Handle photo upload (optional field) to private storage
- On success, redirect to Thank You page; on failure, show inline error

### Batch 6 — Thank You / Confirmation Page
- Confirmation message + next-steps messaging
- Route guard: only reachable after successful submit (not linked in nav,
  not indexed)

### Batch 7 — Privacy & Trust Page
- Standalone content page: no public browsing, approval-before-contact,
  data handling practices

### Batch 8 — Contact / FAQ Page
- FAQ content: who runs this, is it free, how long until contact
- Direct contact method (form or mailto link)

### Batch 9 — Imagery & Decorative Pass
- Drop in all placeholder blocks per brief (hero, registration/trust,
  member/testimonial thumbnails 200x200 circular)
- Add CSS/SVG decorative graphics (soft bokeh, floral accents) behind
  hero imagery — subtle, background only
- Flag full placeholder list + exact dimensions back to client for real
  images

### Image Placeholder Inventory (flagged in Batch 9)
Per the design brief's image-handling rules — no images sourced or generated,
all reserved as labeled placeholder blocks:

| Location | Dimensions | Shape | Count |
|---|---|---|---|
| Home — hero image | 1600x900 (16:9) | rect | 1 |
| Register — registration/trust section image | 800x800 (1:1) | rect | 1 |
| Home — member/testimonial thumbnails | 200x200 (1:1) | circle | 5 |

Client to supply real photography at these exact dimensions; placeholders
are visually marked in the UI (labeled dashed box with dimensions) so
they're easy to find and swap.

### Batch 10 — QA & Deploy
- Cross-browser + mobile responsiveness check
- Accessibility pass (alt text, contrast, focus states)
- End-to-end form submission test (data lands in private storage)
- Verify no public/indexed access to user data or Thank You page
- Deploy to production domain
