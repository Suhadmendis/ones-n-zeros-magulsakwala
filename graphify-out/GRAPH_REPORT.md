# Graph Report - src  (2026-07-11)

## Corpus Check
- 23 files · ~4,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 51 nodes · 92 edges · 8 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App Entry & Static Pages
- Theme Tokens
- How It Works & Step UI
- Site Chrome (Header/Footer/Layout)
- Registration Form & Validation
- Home Page & Image Placeholder
- Privacy & Trust Page

## God Nodes (most connected - your core abstractions)
1. `Button()` - 7 edges
2. `Card()` - 6 edges
3. `ImagePlaceholder()` - 3 edges
4. `WaveDivider()` - 3 edges
5. `Register()` - 3 edges
6. `validateRegistration()` - 3 edges
7. `App()` - 2 edges
8. `Badge()` - 2 edges
9. `Footer()` - 2 edges
10. `Header()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Register()` --calls--> `validateRegistration()`  [EXTRACTED]
  pages/Register.jsx → utils/validation.js

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "App Entry & Static Pages"
Cohesion: 0.33
Nodes (5): App(), Card(), ContactFaq(), faqs, ThankYou()

### Community 1 - "Theme Tokens"
Cohesion: 0.39
Nodes (4): BREAKPOINTS, COLOR_RGB, COLORS, SPACING

### Community 2 - "How It Works & Step UI"
Cohesion: 0.38
Nodes (4): Badge(), Button(), HowItWorks(), steps

### Community 3 - "Site Chrome (Header/Footer/Layout)"
Cohesion: 0.38
Nodes (4): Footer(), Header(), navLinks, Layout()

### Community 4 - "Registration Form & Validation"
Cohesion: 0.43
Nodes (4): DISTRICTS, initialForm, Register(), validateRegistration()

### Community 5 - "Home Page & Image Placeholder"
Cohesion: 0.50
Nodes (3): ImagePlaceholder(), Home(), trustPrinciples

### Community 6 - "Privacy & Trust Page"
Cohesion: 0.50
Nodes (3): WaveDivider(), principles, PrivacyTrust()

## Knowledge Gaps
- **6 isolated node(s):** `navLinks`, `faqs`, `trustPrinciples`, `steps`, `principles` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `How It Works & Step UI` to `App Entry & Static Pages`, `Site Chrome (Header/Footer/Layout)`, `Registration Form & Validation`, `Home Page & Image Placeholder`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Card()` connect `App Entry & Static Pages` to `Registration Form & Validation`, `Home Page & Image Placeholder`, `Privacy & Trust Page`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Register()` connect `Registration Form & Validation` to `App Entry & Static Pages`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `navLinks`, `faqs`, `trustPrinciples` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._