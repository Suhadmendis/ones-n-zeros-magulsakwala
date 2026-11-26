# Magul Sakwala — SEO Development Batches

Target: Sri Lankan matchmaking (magul kapuwa / marriage proposals) site.
Audience: Sri Lanka domestic (Sinhala + Tamil + English) + diaspora (UK, AU, CA, ME).
Stack: React 19 SPA + Vite 8, PHP + MySQL on cPanel (no Node runtime).
Goal: rank #1 for Sri Lankan matchmaking queries in all three languages, technically + on-page + off-page.

Related plans: `Magul_Sakwala_Build_Batches.md`, `Magul_Sakwala_Architecture_Responsiveness_Plan.md`.

---

### Batch 1 — Technical SEO Foundations
- Rewrite `index.html` `<head>` with production-ready base tags (replace default Vite title + missing description):
  - `<title>Magul Sakwala — Sri Lankan Marriage Proposals</title>` (≤60 chars, brand suffix pattern `Page | Magul Sakwala`)
  - `<meta name="description" content="Trusted Sri Lankan matchmaking service connecting families for marriage proposals in Sinhala, Tamil and English.">` (≤155 chars)
  - `<meta name="robots" content="index,follow,max-image-preview:large">`
  - `<link rel="canonical" href="https://magulsakwala.lk/">` (self-referential, absolute, no trailing slash except root)
- Install `react-helmet-async` and wrap `<App />` with `<HelmetProvider>` in `src/main.jsx`; add per-page `<Helmet>` blocks in `Home.jsx`, `Register.jsx`, `SignIn.jsx`, `SignUp.jsx` with unique title/description/canonical.
- Open Graph + Twitter cards (add to `index.html` as defaults, override per page via Helmet):
  - `og:type=website`, `og:site_name=Magul Sakwala`, `og:locale=si_LK`, `og:locale:alternate=ta_LK` + `en_US`, `og:url`, `og:title`, `og:description`, `og:image` (1200×630 PNG at `/og-image.png`)
  - `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- Reciprocal `hreflang` tags in `<head>` on every localized route (must be bidirectional):
  - `<link rel="alternate" hreflang="si-LK" href="https://magulsakwala.lk/si/">`
  - `<link rel="alternate" hreflang="ta-LK" href="https://magulsakwala.lk/ta/">`
  - `<link rel="alternate" hreflang="en" href="https://magulsakwala.lk/en/">`
  - `<link rel="alternate" hreflang="x-default" href="https://magulsakwala.lk/">`
- Favicon set in `public/` + reference in `index.html`: `favicon.ico` (32×32), `favicon-32x32.png`, `apple-touch-icon.png` (180×180), `android-chrome-512x512.png`, `site.webmanifest` (name, short_name, theme_color, background_color, icons array).
- Create `public/robots.txt` — `User-agent: *` + `Allow: /`, `Disallow: /api/`, `Disallow: /register`, and `Sitemap: https://magulsakwala.lk/sitemap.xml`.
- Sitemap: generate at build via `vite-plugin-sitemap` in `vite.config.js` (hostname + dynamic routes list including `/si/`, `/ta/`, `/en/` variants with `<xhtml:link rel="alternate" hreflang="…">`); for member profiles later, switch to `api/sitemap.php` that queries MySQL and outputs XML.
- Extend `public/.htaccess` (copied into `dist/` at build):
  - Force HTTPS: `RewriteCond %{HTTPS} off` → `RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]`
  - Strip trailing slash (except root): `RewriteCond %{REQUEST_FILENAME} !-d` + `RewriteRule ^(.+)/$ /$1 [R=301,L]`
  - `mod_deflate` gzip for text/html, css, js, svg, json, xml
  - `mod_expires` cache headers: 1yr for hashed `/assets/*`, 1hr for HTML, 1wk for images/fonts
  - Custom 404 → `ErrorDocument 404 /index.html` so SPA router renders NotFound with correct 404 status via `<Helmet><meta name="prerender-status-code" content="404"></Helmet>`.
- Add JSON-LD `Organization` + `WebSite` (with `SearchAction`) schema blocks in `index.html` for rich results eligibility.

---

### Batch 2 — Structured Data (Schema.org / JSON-LD)

- **Injection strategy**: React SPA + prerender means crawlers may not execute JS reliably. Put site-wide static schema (Organization, WebSite) directly in `index.html` as `<script type="application/ld+json">`; use `react-helmet-async` for per-page schema (FAQPage, BreadcrumbList, WebPage, Service).
  - Install `npm i react-helmet-async`, wrap `<App />` in `<HelmetProvider>` in `src/main.jsx`, then emit `<script type="application/ld+json">` inside `<Helmet>` per route.
  - Keep a `src/seo/schema.js` helper exporting factory functions (`orgSchema()`, `faqSchema(items)`, `breadcrumbSchema(trail)`) to avoid duplication.

- **Organization** (site-wide, `index.html`): identifies Magul Sakwala as the publishing entity — feeds Google Knowledge Panel.
  - Fields: `name`, `url`, `logo` (absolute URL, min 112×112), `sameAs` (FB/Insta/TikTok), `contactPoint` (nested `ContactPoint` with `telephone` in E.164 `+94...`, `contactType: "customer service"`, `areaServed: "LK"`, `availableLanguage: ["si","ta","en"]`).

```json
{"@context":"https://schema.org","@type":"Organization","name":"Magul Sakwala",
 "url":"https://magulsakwala.lk","logo":"https://magulsakwala.lk/logo.png",
 "sameAs":["https://facebook.com/magulsakwala"],
 "contactPoint":{"@type":"ContactPoint","telephone":"+94-11-1234567",
   "contactType":"customer service","areaServed":"LK",
   "availableLanguage":["si","ta","en"]}}
```

- **WebSite + SiteNavigationElement** (site-wide, `index.html`): enables sitelinks searchbox if you add on-site search.
  - Fields: `name`, `url`, `inLanguage`, optional `potentialAction` → `SearchAction` with `target` template `https://magulsakwala.lk/search?q={search_term_string}` and `query-input: "required name=search_term_string"`. Omit `SearchAction` until search page exists — Google will flag it as an error otherwise.

- **LocalBusiness** (only if there's a physical office): use subtype `ProfessionalService` or `MatrimonialService` isn't standard — stick with `LocalBusiness` + `additionalType: "https://en.wikipedia.org/wiki/Matchmaking"`. Populate `address` (`PostalAddress` with `addressCountry: "LK"`), `geo`, `openingHoursSpecification`, `telephone`. Skip entirely if fully remote.

- **Service** (Home page, via Helmet): describes the matchmaking offering.
  - Fields: `serviceType: "Matchmaking"`, `provider` (reference Organization by `@id`), `areaServed: "Sri Lanka"`, `audience` (`PeopleAudience` with `suggestedMinAge:18`), `offers` if pricing is public.

- **FAQPage** (Contact/FAQ page only, via Helmet): eligible for FAQ rich result — one entry per Q&A visible on page. Answers must match on-page text verbatim, else Google suppresses.

```json
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
 {"@type":"Question","name":"How does registration work?",
  "acceptedAnswer":{"@type":"Answer","text":"Fill the form, upload a photo, we verify within 48h."}},
 {"@type":"Question","name":"Is my data private?",
  "acceptedAnswer":{"@type":"Answer","text":"Yes, profiles are only shared with matched families."}}]}
```

- **BreadcrumbList** (every non-home page, via Helmet): improves SERP display path. Generate from React Router location.

```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Home","item":"https://magulsakwala.lk/"},
 {"@type":"ListItem","position":2,"name":"Register","item":"https://magulsakwala.lk/register"}]}
```

- **WebPage** (per route, via Helmet): wrap each page with `@type: "WebPage"`, `name`, `description`, `inLanguage`, `isPartOf: {"@id":"https://magulsakwala.lk/#website"}`, `primaryImageOfPage`. Use `@id` cross-refs so Google links Organization ↔ WebSite ↔ WebPage as one graph.

- **Review / AggregateRating**: DO NOT add until real testimonials with named authors exist and are displayed on page. Google penalizes self-serving reviews of your own business. When ready, attach `AggregateRating` to the Organization node (`ratingValue`, `reviewCount`, `bestRating:5`).

- **Validation & monitoring**:
  - Pre-deploy: paste each rendered page's HTML into Google's Rich Results Test (`search.google.com/test/rich-results`) and Schema.org Validator (`validator.schema.org`) — fix all errors, review warnings.
  - Post-deploy: Search Console → Enhancements panel surfaces FAQ, Breadcrumb, Sitelinks searchbox reports. Check weekly first month, then monthly. Fetch `/api/health.php`-style ping isn't needed; use URL Inspection tool to force recrawl after schema changes.
  - Guardrail: never mark up content not visible to users — violates Google's structured data guidelines and triggers manual actions.

---

### Batch 3 — Keyword & Content Strategy (Sri Lanka focus)
- **English primary clusters** (highest commercial intent first)
  - Matrimony core: `sri lankan matrimony`, `sri lanka marriage proposals`, `sri lankan marriage bureau`, `matrimonial site sri lanka`, `sri lankan matchmaking site`
  - Magul kapuwa branded: `magul kapuwa online`, `online magul kapuwa`, `digital magul kapuwa`, `magul kapuwa service`, `modern magul kapuwa`
  - Action/intent: `find sri lankan bride`, `find sri lankan groom`, `sri lankan grooms seeking brides`, `sri lankan brides seeking grooms`, `register marriage proposal sri lanka`
  - Newspaper-replacement: `sunday observer marriage proposals alternative`, `sunday times marriage proposals online`, `mangala.lk alternative`
- **Sinhala primary keywords** (Unicode + transliteration — index Unicode, use transliteration in body copy)
  - මගුල් කපුවා (magul kapuwa), විවාහ යෝජනා (vivaha yojana), සරණ මංගල (sarana mangala), මංගල යෝජනා (mangala yojana), කසාද යෝජනා (kasada yojana), මනාලයෝ (manalayo — grooms), මනාලියෝ (manaliyo — brides), පෝරොන්දම් (porondam), කේන්දර ගැලපීම (kendara galapeema)
- **Tamil primary keywords**
  - திருமண தகவல்கள் (thirumana thagavalgal), திருமண சேவை (thirumana sevai), இலங்கை திருமணம் (ilangai thirumanam), மணமகன் தேவை (manamagan thevai — groom wanted), மணமகள் தேவை (manamagal thevai — bride wanted), ஜாதகம் பொருத்தம் (jathakam poruttham)
- **Long-tail segmentation matrix** (build one landing page per meaningful cell)

  | Axis | Sample long-tails |
  |---|---|
  | Religion | `buddhist marriage proposals sri lanka`, `sinhala buddhist grooms`, `hindu tamil matrimony sri lanka`, `sri lankan muslim marriage proposals` / `nikah proposals sri lanka`, `catholic marriage proposals sri lanka`, `christian sri lankan matrimony` |
  | Ethnicity | `sinhala marriage proposals`, `sri lankan tamil matrimony`, `sri lankan moor marriage`, `burgher marriage proposals`, `kandyan marriage proposals` |
  | Caste (SENSITIVE — offer as optional filter, never in URLs or H1s) | `govigama proposals`, `karava proposals`, `salagama proposals`, `vellalar matrimony sri lanka`. Flag: use in-app filters + noindex faceted URLs; do not build public landing pages |
  | District | `marriage proposals colombo`, `kandy marriage proposals`, `jaffna tamil matrimony`, `galle marriage proposals`, `negombo catholic proposals`, `kurunegala magul kapuwa`, `matara`, `batticaloa`, `anuradhapura` |
  | Profession | `doctor marriage proposals sri lanka`, `engineer grooms sri lanka`, `government servant proposals`, `teacher marriage proposals`, `professional sri lankan matrimony` |
  | Diaspora | `sri lankan marriage proposals uk`, `sri lankan matrimony australia`, `sri lankan proposals canada`, `sinhala proposals london`, `tamil matrimony toronto sri lanka`, `sri lankan proposals melbourne / sydney`, `italy sri lankan matrimony` |

- **Competitors to audit** (scrape titles, H1s, filter facets, schema)
  - Direct: poruwa.com, mangala.lk, mysrilankanmatch.com, lankalovelink.com, mangalyam.lk, srilankanmatrimony.com, helakapuwa.com, kandyanmarriage.com, sudarshanam.lk
  - Adjacent/global with SL segments: bharatmatrimony.com/srilankanmatrimony, shaadi.com (SL filter), jeevansathi
  - Newspaper classifieds (intent source): sundayobserver.lk, sundaytimes.lk, thinakaran.lk marriage sections
- **Content page recommendations** (cluster → hub + spokes)
  - Hub: `/how-magul-kapuwa-works` → spokes: `what-to-include-in-a-marriage-proposal`, `writing-a-proposal-ad`, `photo-guide-for-proposals`, `proposal-response-etiquette`
  - Hub: `/porondam-horoscope-matching` → spokes: `20-porondam-explained`, `nekath-auspicious-times`, `kendara-reading-online`
  - Hub: `/poruwa-ceremony-explained` → spokes: `poruwa-ceremony-checklist`, `jayamangala-gatha`, `ashtaka`, `kandyan-vs-low-country-wedding`
  - Religion hubs: `/buddhist-weddings`, `/hindu-weddings-sri-lanka`, `/nikah-guide-sri-lanka`, `/catholic-weddings-sri-lanka`
  - District landing pages: `/proposals/colombo`, `/proposals/kandy`, `/proposals/jaffna` (unique intro + local vendor mentions, not just filtered lists)
  - Diaspora hubs: `/sri-lankan-proposals-uk`, `/sri-lankan-proposals-australia`, `/sri-lankan-proposals-canada`
  - Comparison/branded-defense: `magul-kapuwa-vs-newspaper-proposals`, `magulsakwala-vs-mangala-lk`
- **URL slug conventions**
  - Use **English lowercase kebab-case slugs everywhere** — best crawl/indexation, cleaner backlinks, safe in emails/WhatsApp shares. Sinhala/Tamil Unicode slugs get percent-encoded (`%E0%B6%B8...`), hurting CTR and shareability.
  - Keep transliteration in slug when it's the query (`/magul-kapuwa-online`, `/porondam-matching`), not the translation.
  - Put language in path prefix, not slug: `/si/vivaha-yojana`, `/ta/thirumana-thagavalgal`, `/en/marriage-proposals`. Use `hreflang` (`si-LK`, `ta-LK`, `en-LK`, plus `en-GB`/`en-AU`/`en-CA` for diaspora).
  - District/religion as clean segments: `/proposals/kandy/buddhist`, not query strings. Faceted caste filters → `noindex, follow` + canonical to parent.

---

### Batch 4 — Multilingual & Geo-Targeting SEO
- **URL structure — use subdirectories (`/si/`, `/ta/`, `/en/`)** and set `/en/` (or `/`) as default
  - Subdirectories inherit domain authority (subdomains split it, query params get ignored by Google as language signals)
  - Cheaper on cPanel — no extra DNS/SSL per subdomain; SPA routing handled by existing `public/.htaccess`
  - React Router: nest all routes under `:lang` param, fall back to `/en` on unknown; persist choice in `localStorage` but always canonicalise to the URL prefix
- **`hreflang` — reciprocal on every page, including `x-default`**
  - Emit 4 tags per route: `si-LK`, `ta-LK`, `en-LK`, `x-default` → English URL
  - Inject via `react-helmet-async` (or manual `document.head` in `ContentProvider.jsx`) — must render server-side-equivalent so Googlebot sees them; for SPA add same tags to prerendered fallback or use Vite SSG for key landing pages
  - Also mirror hreflang in `sitemap.xml` (`<xhtml:link>`) — belt-and-braces for GSC
- **`<html lang>` per route** — update dynamically on route change (`si`, `ta`, or `en`); screen readers + Chrome translate rely on it, and it's a ranking signal for language relevance
- **Fonts**
  - Add Noto Sans Tamil alongside Noto Sans Sinhala; use `&display=swap` and `&subset=` params to trim payload
  - `preconnect` to `fonts.gstatic.com` in `index.html`; consider self-hosting both Noto families in `public/fonts/` to avoid Google Fonts latency from SL ISPs
  - CSS: `font-family: 'Noto Sans Sinhala', 'Noto Sans Tamil', system-ui, sans-serif` so glyph fallback works on mixed-script pages (names)
- **Search Console + Bing**
  - Register **4 GSC properties**: root domain (Domain property via DNS TXT) + one URL-prefix property each for `/si/`, `/ta/`, `/en/` — lets you see per-language CTR/impressions
  - International Targeting → set country = **Sri Lanka** for each language property (only works on URL-prefix, not Domain properties)
  - Submit language-specific sitemaps (`sitemap-si.xml`, etc.) to each property
  - Mirror same setup in Bing Webmaster Tools — non-trivial diaspora traffic in UK/Canada uses Bing/DuckDuckGo (Bing-powered)
- **Geo signals**
  - Prefer **`.lk` domain** (magulsakwala.lk) — strongest ccTLD signal, overrides GSC targeting; use `.com` only if brand-critical
  - Confirm cPanel server region is SL/Singapore/India (not US) — check via `ping` from SL; if US-hosted, migrate or front with Cloudflare (SL PoP in Colombo)
  - Add `LocalBusiness` + `PostalAddress` schema with SL address + `+94` phone; repeat in footer as plain text
- **Translation workflow**
  - Native translators only for matrimony vocabulary: **kapuwa, poruwa, porondam, nakath, lagna, kendara** — machine translation mangles cultural context and kills trust
  - Store translations in `api/content.php`-backed DB table keyed by `(slug, lang)`; version them so translators can review diffs
  - Never auto-translate user-generated proposal text — flag language per profile instead
- **Diaspora landing pages** (English only, under `/en/`)
  - `/en/sri-lankan-proposals-uk`, `/en/sri-lankan-marriage-proposals-australia`, `/en/canada`, `/en/middle-east`
  - Local intent keywords: "Sri Lankan brides in London", "Sinhala proposals Sydney", "Tamil marriage Toronto"
  - Each page: local testimonials, currency-aware pricing hint, timezone note, country-specific FAQ; hreflang stays `en-GB`/`en-AU`/`en-CA` variants pointing to the same URLs

---

### Batch 5 — Performance, Core Web Vitals & Crawlability
- SPA-to-crawlable problem (Googlebot renders JS, but Bing/Yandex/Baidu/Facebook/WhatsApp/LinkedIn preview bots do not reliably)
  - Recommended path: **build-time pre-rendering with `vite-plugin-ssr` (now Vike) in SSG mode** or **`vite-react-ssg`** — emits static HTML per route into `dist/`, uploads to cPanel unchanged, zero Node runtime required
  - Runner-up: `react-snap` (Puppeteer post-build crawl) — simpler but flakier with React 19 hydration; acceptable for < 20 routes
  - Rejected: Next.js/Remix SSR (needs Node), Cloudflare Workers SSR (adds infra + cost, overkill for matchmaking site with mostly static marketing + auth pages)
  - Per-route HTML must include correct `<title>`, meta description, OG tags, JSON-LD — otherwise pre-rendering gains nothing for social/search
- Core Web Vitals targets (mobile 4G Sri Lanka baseline)
  - LCP < 2.5s, INP < 200ms, CLS < 0.1 — measure p75, not median
  - Current risk: unoptimized hero `anangayalk-home-banner.png` in `src/assets/home/` will dominate LCP
- Image optimization
  - Convert PNGs in `src/assets/home/` + `members/` to AVIF with WebP fallback via `vite-imagetools` or `@vite-pwa/assets-generator`
  - Use `<picture>` with `srcset` + `sizes` for member photos; serve 400w/800w/1200w variants
  - **Always** set explicit `width`/`height` on `<img>` — CLS killer, especially on member cards
  - Hero: `fetchpriority="high"` + preload in `<head>`; below-fold members: `loading="lazy" decoding="async"`
  - Long-term: move member uploads (currently multipart to `api/register.php`) to Cloudflare Images or R2 with on-the-fly resize
- Font optimization
  - Currently Google Fonts (third-party RTT ~200-400ms from Sri Lanka) — **self-host Noto Sans Sinhala + Latin subset** in `public/fonts/`, `<link rel="preload" as="font" crossorigin>` the woff2 files
  - `font-display: swap` to avoid invisible text; subset to Sinhala + Latin Basic only (drop ~70% of glyphs)
- Code splitting & bundle budget
  - `React.lazy()` per route in `src/App.jsx` (Home, Register, SignIn, SignUp) — auth pages don't need to ship on landing
  - `vite.config.js` `build.rollupOptions.output.manualChunks`: split `react`/`react-dom` into `vendor-react`, split date/time picker deps into `vendor-forms`
  - Budget: **< 200KB gzipped initial JS**, < 50KB critical CSS — enforce via `rollup-plugin-visualizer` in CI
- Third-party audit
  - Combine Google Fonts requests into one `<link>` if not self-hosting; drop unused weights
  - Defer any analytics (`gtag`, Meta Pixel) with `async` + load after `load` event
- Caching (`public/.htaccess` copied into `dist/`)
  - Hashed assets in `/assets/`: `Cache-Control: public, max-age=31536000, immutable`
  - `index.html`: `Cache-Control: no-cache` (must revalidate so new deploys pick up)
  - `/api/*.php`: `Cache-Control: no-store` for auth, short TTL for `content.php`
- CDN — Cloudflare free tier in front of cPanel
  - Nearest POP: Colombo (CMB) — cuts TTFB dramatically vs origin
  - Enable Auto Minify, Brotli, Polish (image optimization), Early Hints
  - Cache Rules: cache `/assets/*` at edge for 1yr; bypass `/api/*`
- Mobile-first testing
  - Lighthouse mobile (Moto G4 + Slow 4G throttle) target ≥ 90 Performance
  - WebPageTest from Colombo/Mumbai node on 3G Fast profile
- Measurement / RUM
  - Add `web-vitals` npm package in `src/main.jsx` → POST to `api/vitals.php` (new endpoint) → aggregate p75 LCP/INP/CLS per route
  - Wire Google Search Console → Core Web Vitals report; check weekly
  - PageSpeed Insights CrUX data once site has traffic

---

### Batch 6 — Off-page SEO, Analytics & Monitoring

- **Google Business Profile (only if physical office exists)**
  - Primary category: "Marriage Consultant"; secondary: "Wedding Service" / "Matchmaking Service"
  - NAP consistency: exact same Name/Address/Phone (Sri Lankan +94 format) across GBP, footer, directories, social bios
  - Review generation: post-successful-match email asking couples to leave a Google review with photo; seed with 10-15 genuine early reviews
  - Populate Q&A section proactively (owner-answered) with common queries: "How do you verify profiles?", "Is it free?", "Do you cover Tamil/Muslim proposals?"
  - Weekly GBP Posts (offers, success stories) — treated as ranking signal in local pack
- **Sri Lankan directory submissions (free, DoFollow where possible)**
  - yellowpages.lk, hotfrog.lk, ceylonpages.lk, lankabiz.net, srilankanentrepreneur.com, lankalisting.com, businesslist.lk, tuugo.lk
  - Facebook Page (verified, "Matchmaking Service" category) + Instagram Business account linked to FB
  - Maintain identical NAP + website URL + logo across all listings
- **Backlink acquisition targets**
  - Wedding vendor reciprocal partnerships: poruwa builders, photographers (studiofx, dinesh photography), wedding halls (Mount Lavinia Hotel, Waters Edge), bridal dressers, cake makers — offer "featured vendor" slot in exchange for footer link
  - Wedding blogs & portals: weddings.lk, srilankanweddings.com, bridalscene.lk — pitch guest posts on "Modern magul kapuwa role", "Astrology in Sinhala matchmaking"
  - Community forums: elakiri.com, srilankanweddingforum, Reddit r/srilanka (careful, non-spammy)
  - Sinhala/Tamil news lifestyle sections: gossiplankanews, hirunews.lk lifestyle, virakesari lifestyle
  - Diaspora angle: university alumni FB groups (UK/AUS/CA Sri Lankan associations), temple/kovil newsletters
- **Social signals & content marketing**
  - Facebook: 3-5 posts/week (huge reach in SL), boosted success-story posts, Facebook Groups engagement (Sri Lankan Weddings, Diaspora groups)
  - Instagram Reels: "magul kapuwa reacts", poruwa ceremony explainers, real couple stories (consented)
  - YouTube: long-form success stories, "how horoscope matching works" explainers — embeds also boost dwell time on site
  - TikTok in Sinhala + Tamil for Gen Z awareness
  - PR: sponsor Colombo Wedding Expo / Avurudu bridal fairs — earn organizer backlink + press mentions
- **Analytics & search tooling**
  - Google Search Console: verify all three language properties (`/si/`, `/ta/`, `/en/`) as separate properties + domain-level property; submit each sitemap
  - Bing Webmaster Tools + IndexNow key in `public/` root — auto-ping on new profile/blog publish
  - GA4 with events: `form_start`, `form_submit`, `register_success`, `profile_view`, `contact_reveal`; mark `register_success` as key event
  - Google Consent Mode v2 wired into cookie banner (default denied → update on accept) — GDPR-safe for diaspora hits from UK/EU
- **Cookie consent & legal trust**
  - Banner (Cookiebot free tier or custom lightweight) with granular analytics/marketing toggles
  - Privacy Policy, Terms of Service, Refund Policy, Cookie Policy pages — linked in footer, indexable
  - Footer: real Sri Lankan office address + +94 phone + WhatsApp link + business registration number
  - HTTPS via cPanel Let's Encrypt (auto-renew verified); HSTS header via `.htaccess`
- **Ongoing monitoring**
  - UptimeRobot (free, 5-min checks) on homepage + `/api/health.php` — alerts to email/Telegram
  - Rank tracking: SERPWatcher (cheap) or manual GSC query monitoring for target Sinhala/Tamil/English keywords weekly
  - Monthly SEO audit checklist: Screaming Frog free crawl (500 URLs), fix 404s/redirect chains, resubmit sitemap, CWV regression check in PSI + GSC Core Web Vitals report, backlink profile review in GSC Links report

---

## Execution order (recommended)

1. **Batch 1** (technical foundations) — unblocks everything else; ship with next deploy.
2. **Batch 5** (performance + prerender) — decide SSG stack early; retrofitting later is painful.
3. **Batch 2** (structured data) — depends on Helmet from Batch 1.
4. **Batch 4** (multilingual + geo) — depends on router + Helmet.
5. **Batch 3** (content pages) — ongoing content pipeline; needs multilingual URL scheme from Batch 4.
6. **Batch 6** (off-page + analytics) — parallel to content; launch analytics before Batch 3 traffic arrives so baseline exists.
