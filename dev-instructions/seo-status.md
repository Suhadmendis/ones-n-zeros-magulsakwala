# SEO Status Audit

Audited: 2026-11-26  
Branch: dev  
Method: One agent reviewed all SEO infrastructure, page metadata, structured data, content signals, and crawlability.

---

## ❌ Critical — Will Prevent Indexing or Severely Damage Rankings

**[SPA Crawlability — Googlebot May See Empty Page]**  
This is a client-side rendered React app. All visible content is fetched from `/api/content.php` after JS executes. Googlebot crawls JS but may not wait for the async fetch to complete. If Googlebot indexes the page before the content loads, it sees an empty shell.  
> Fix (priority 1): implement prerendering. Options in order of effort:
> - **Vite SSG** (`vite-ssg` or `vite-plugin-prerender`) — prerender key routes at build time to static HTML
> - **Server-side rendering** — requires Node runtime; not available on current cPanel host
> - **Minimum viable**: inline the content.php JSON into the HTML at build time so the first paint has visible text

**[No hreflang Tags — Multilingual Site With No Language Signals]**  
The site supports English, Sinhala, and Tamil via a locale toggle. However, there are no `hreflang` attributes in `<head>`, no language-specific URL paths (`/si/`, `/ta/`), and no `lang` attribute variations. Google cannot serve the right language version to the right user.  
> Fix: at minimum add `lang` attribute to `<html>` matching current locale; ideally add language-specific routes (`/si`, `/ta`) with `hreflang` tags pointing between them.

---

## ⚠️ Partial — Implemented but Incomplete or Incorrect

**[og:image Missing on Disk]**  
`Seo.jsx` references `/og-image.png` as the default OG image for social sharing. This file does not exist on disk (`public/og-image.png` absent). All pages will show a broken or missing image when shared on Facebook/WhatsApp/Twitter.  
> Fix: create a 1200×630px branded OG image and place at `public/og-image.png`.

**[logo.png Missing on Disk]**  
Structured data (JSON-LD) references `/logo.png` as the organization logo. File does not exist at `public/logo.png`. Google's Knowledge Graph and rich results require a resolvable logo URL.  
> Fix: place the brand logo at `public/logo.png` (minimum 112×112px, square preferred).

**[Meta Description on Home Page 2 Characters Over Limit]**  
Home page meta description is ~157 characters. Google truncates at ~155 characters for desktop. The last words get cut in SERPs.  
> Fix: trim to ≤155 characters, keeping the strongest keywords at the start.

**[Missing LocalBusiness Structured Data]**  
The site has BreadcrumbList and WebPage schema on key pages but no `LocalBusiness` or `Organization` schema on the home page. This prevents Google from generating a Knowledge Panel or rich snippet for Magul Sakwala as a business.  
> Fix: add `Organization` schema to the home page with `name`, `url`, `logo`, `contactPoint`, and `sameAs` (social profiles).

**[Heading Hierarchy Not Fully Nested]**  
On some pages, `<h2>` elements are siblings of `<h1>` rather than nested inside a section with an `<h1>`. Heading hierarchy affects how Google parses page structure and topical relevance.  
> Fix: ensure each page has exactly one `<h1>` and all `<h2>` tags are semantically nested below it.

**[Google Fonts Missing display=swap]**  
Google Fonts `<link>` in `index.html` does not include `&display=swap`. Without this, text may remain invisible while the custom font loads (FOIT — Flash of Invisible Text), hurting both perceived performance and CLS scores.  
> Fix: append `&display=swap` to the Google Fonts URL.

**[Member / Profile Image Alt Text Missing]**  
Any member photos rendered on the home page or profile cards lack descriptive alt text. Google Images cannot index them, and they contribute nothing to page relevance signals.  
> Fix: add descriptive alt text to all member photos (e.g. "Sri Lankan matrimonial profile from Colombo district").

**[Core Web Vitals — No Skeleton Screens (CLS Risk)]**  
Content arrives ~1.6s after page load due to remote DB round-trip. Without skeleton screens, layout shifts occur as content fills in. Cumulative Layout Shift (CLS) is a Core Web Vitals metric and a ranking factor.  
> Fix: add skeleton placeholders that match the final layout dimensions of content blocks.

---

## ✅ OK — Properly Implemented

| Item | Status |
|---|---|
| Title tags | Each page has a unique, descriptive `<title>` via `Seo.jsx` |
| Canonical URLs | `<link rel="canonical">` on every page via `Seo.jsx` |
| noindex on private pages | `/dashboard`, `/thank-you` are set noindex |
| Sitemap | `vite-plugin-sitemap` generates `sitemap.xml` at build time |
| robots.txt | Present at `public/robots.txt`, allows all crawlers, references sitemap |
| Internal linking | Home links to Register, How It Works, Privacy & Trust, Contact/FAQ |
| OG title + description | `og:title` and `og:description` set on all public pages |
| Twitter card tags | `twitter:card`, `twitter:title`, `twitter:description` set |
| BreadcrumbList schema | JSON-LD breadcrumbs on Register, How It Works, Privacy & Trust, Contact/FAQ |
| 404 page | `NotFound.jsx` returns proper 404 UI (`.htaccess` handles SPA routing) |
| HTTPS-ready | No mixed-content issues in codebase; hosting handles SSL |

---

## Priority Fix Order

1. **SPA prerendering** — without this, all other SEO work may be invisible to Googlebot
2. **og:image + logo.png** — blocking social sharing and rich results
3. **LocalBusiness / Organization schema** — high-value structured data for a local Sri Lankan business
4. **hreflang** — required for multilingual targeting
5. **Google Fonts display=swap** — quick win for CLS / performance
6. **Meta description length** — 2-minute fix
7. **Heading hierarchy audit** — moderate effort
8. **Skeleton screens** — also fixes UX CLS issue (see ux-issues.md)

---

## Missing Assets Checklist

| File | Required For | Status |
|---|---|---|
| `public/og-image.png` (1200×630px) | OG social sharing on all pages | ❌ Missing |
| `public/logo.png` (min 112×112px) | Organization schema, Knowledge Panel | ❌ Missing |
