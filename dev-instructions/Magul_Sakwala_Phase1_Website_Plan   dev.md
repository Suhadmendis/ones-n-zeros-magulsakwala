# Magul Sakwala — Phase 1 Website Plan

## Site Map

**Home**
Pitch, trust principles (private, curated, no public profiles), CTA to register.

**How It Works**
Internal process explained: register → private review → we contact both sides → mutual consent → introduction.

**Register**
Registration form. Required: Name, Email, Gender, Date of Birth, District. Optional: Birth Time, Profile Photo.

**Thank You / Confirmation**
Post-submit page confirming registration and setting expectations for next steps.

**Privacy & Trust**
Standalone page reinforcing no public browsing, approval-before-contact, and data handling practices.

**Contact / FAQ**
Basic questions (who runs this, is it free, how long until contact) plus a direct contact method.

---

## Build Batches (Agent Execution Plan)

### Batch 1 — Project Setup
- Scaffold project (framework/hosting choice)
- Configure domain and base hosting
- Build shared layout: header, footer, navigation across all pages
- Set up base styling/branding (colors, fonts, logo placeholder)

### Batch 2 — Home Page
- Build hero section with pitch and trust principles
- Add CTA linking to Register page
- Add brief "How It Works" teaser with link to full page

### Batch 3 — Registration Page + Backend
- Build form: Name, Email, Gender, DOB, District (required); Birth Time, Photo (optional)
- Add client-side validation
- Connect form to private database/storage (no public exposure)
- Redirect to Thank You page on successful submit

### Batch 4 — Thank You / Confirmation Page
- Build confirmation message and next-steps messaging
- Ensure page is only reachable after successful form submission (not indexed/linked directly)

### Batch 5 — How It Works & Privacy/Trust Pages
- Build How It Works page (step-by-step process content)
- Build Privacy & Trust page (no public browsing, approval-before-contact, data handling)

### Batch 6 — Contact / FAQ Page
- Build FAQ content (who runs this, cost, timeline)
- Add contact method (form or email link)

### Batch 7 — QA & Deploy
- Test form submission end-to-end (data lands in private storage correctly)
- Cross-browser and mobile responsiveness check
- Verify no public/indexed access to user data or Thank You page
- Deploy to production domain

---

## Design & Look-and-Feel Brief

Reference direction pulled from a comparable Sri Lankan matrimonial site's visual style (not to be copied verbatim — used as a mood reference only).

**Overall mood:** warm, romantic, trustworthy — soft and approachable rather than corporate, with a modern rounded feel throughout.

**Color palette:**
- Primary crimson/red — `#E63946` (CTAs, bold section backgrounds, emphasis text)
- Soft blush/pink — `#FCE8ED`, `#F7D9E0` (card backgrounds, hero panels)
- Coral/salmon — `#F4867C` (buttons, accent icons, radio/selection states)
- Magenta-to-purple gradient — `#C147E9` → `#E91E8C` (secondary buttons, small icon badges)
- Lavender-grey neutral — `#EEF0F7` (alternating section backgrounds)
- White — `#FFFFFF` (cards, text on dark backgrounds)
- Dark charcoal — `#333333` (body copy)

**Typography:** clean, rounded modern sans-serif. Bold, larger headings; smaller regular-weight body text with generous line spacing.

**Layout patterns:**
- Rounded corners and soft drop shadows on all cards (registration form, testimonial cards, feature cards)
- Pill-shaped buttons, often with a gradient fill (red-to-pink or purple-to-magenta)
- Circular badges for step numbers, icons, and small stats (e.g., a "Free Service" badge)
- Circular, ring-bordered thumbnails for member/profile photos
- Sections alternate background bands (white → soft lavender → bold red/blush → white) to break up the scroll
- Scalloped/wave-shaped dividers between some sections instead of hard edges
- Generous white space; content never feels cramped

**Imagery treatment:**
- Warm, real photography of couples/people (not generic stock or overly staged) — respectful and culturally appropriate
- Decorative touches like soft heart or floral bokeh graphics layered behind hero imagery, kept subtle and not overpowering the photo
- Occasional duotone/color-tinted overlay on photos to keep them consistent with the palette

---

## Ready-to-Use Prompt for Build Agent

```
Build the site using this look and feel:

Mood: warm, romantic, and trustworthy — soft and approachable, not corporate.
Rounded, modern aesthetic throughout.

Color palette:
- Primary crimson/red: #E63946 (CTA buttons, bold section bands, emphasis text)
- Soft blush/pink: #FCE8ED and #F7D9E0 (card backgrounds, hero panel)
- Coral/salmon: #F4867C (secondary buttons, selection states, small accents)
- Magenta-to-purple gradient: #C147E9 to #E91E8C (icon badges, secondary buttons)
- Lavender-grey neutral: #EEF0F7 (alternating section backgrounds)
- White: #FFFFFF (card surfaces, text on dark backgrounds)
- Charcoal: #333333 (body text)

Typography: clean rounded sans-serif, bold larger headings, regular-weight body
text with generous line spacing.

Layout rules:
- Rounded corners + soft drop shadows on all cards
- Pill-shaped buttons with gradient fills
- Circular badges for step indicators and small icons/stats
- Circular ring-bordered image thumbnails
- Alternate section background bands (white / lavender-grey / bold red / white)
  to create visual rhythm down the page
- Generous padding and white space; avoid dense/cramped layouts

Imagery: use warm, respectful, real-feeling photography (not generic or
overly staged stock). Subtle decorative graphics (soft bokeh, floral
accents) are welcome behind hero images but should stay in the background
and never compete with the photo or text.

IMAGE HANDLING — do not source or generate images yourself:
- Hero/banner image: reserve a placeholder block, 1600x900px (16:9), with
  alt text "hero image — client to provide"
- Registration/trust section image (if used): reserve 800x800px (1:1)
  placeholder
- Member/testimonial thumbnails: reserve 200x200px (1:1) circular
  placeholders per item
- Any decorative background graphics (bokeh, floral shapes): use simple
  CSS/SVG shapes in the palette above instead of photos — no need for a
  placeholder
- Every placeholder should be clearly marked in the code (e.g., a labeled
  gray box or comment) and flagged back to me with the exact dimensions
  needed, so I can source and supply the real images myself.
```
