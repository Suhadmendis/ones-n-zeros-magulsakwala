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
