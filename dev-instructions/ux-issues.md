# UX Issues — User Perspective Audit

Audited: 2026-11-26  
Branch: dev  
Method: Four agents walked through public pages, registration form, auth flow, and UI components as first-time users.

---

## 🔴 Critical — Blocks or Severely Damages User Experience

**[All Content Depends on API — No Fallback Text]**  
Every visible text string is fetched from `/api/content.php`. If the API is slow (1.6s on remote DB) or fails, users see a blank page with no context. No hardcoded fallback strings exist. First-time visitors on slow connections hit a fully empty page.  
> Fix: add hardcoded English fallback strings as default state; API fetch only overrides them.

**[SPA Render Blocks Content on Slow Connections]**  
React renders nothing until JS loads and hydrates. Users on slow mobile connections (common in Sri Lanka) see a spinner or white screen for several seconds before any content appears. No skeleton screens or static HTML fallback.  
> Fix: add skeleton screens for key sections; consider prerendering the home page.

---

## 🟠 High — Significantly Hurts Experience

**[Register Form Has No Step Progress Indicator]**  
The registration form is a single long page (8+ fields) with no visual grouping, no section headings, no "step 2 of 4" indicator. Users cannot tell how much is left and may abandon mid-form.  
> Fix: split into logical steps (Personal → Contact → Details → Photo) with a progress bar.

**[No Email Verification After Sign-Up]**  
After creating an account, users receive no verification email and are immediately redirected to sign in. Email could be mistyped with no way to recover without the forgot-password flow.  
> Fix: send a verification email on signup; show a "check your email" screen.

**[Empty Dashboard for New Users]**  
After signing in, the dashboard shows user info but has no onboarding guidance, no next steps, and no call to action. New users who haven't registered a matrimonial profile see an empty card with no direction.  
> Fix: show an onboarding prompt ("You haven't submitted a proposal yet — Register now") when no registration exists.

**[Post Sign-Up Redirect Is Confusing]**  
After creating an account, users land on sign-in with a banner saying "Account created". They must sign in again immediately. This creates the impression something went wrong rather than success.  
> Fix: auto-sign-in after signup, or at minimum explain on the banner that they need to sign in to continue.

**[Birth Time Field Has 12h vs 24h Ambiguity]**  
The TimePicker renders a 24-hour clock, but no label or hint explains this. Sri Lankan users who think in AM/PM may enter "7:30" meaning PM (should be 19:30) and silently submit wrong astrological data.  
> Fix: add AM/PM toggle or add a clear "24-hour format (e.g. 19:30 for 7:30 PM)" hint.

**[Footer Phone Number Not Clickable]**  
The phone number in the footer is plain text. On mobile, users cannot tap to call. This is a friction point for users trying to contact Magul Sakwala directly.  
> Fix: wrap phone in `<a href="tel:+94XXXXXXXXX">`.

---

## 🟡 Medium — Friction, Missing Polish

**[District Dropdown May Have Wrong Values]**  
The district list comes from API content. If API data is wrong or incomplete, users may not find their district or submit incorrect data. No validation against a canonical list of 25 Sri Lanka districts.  
> Fix: validate submitted district server-side against a fixed list of valid Sri Lanka districts.

**[FileInput Has No Client-Side File Size Check]**  
The photo upload accepts up to 5 MB (shown in hint) but does not validate client-side. Users who upload a large file wait for the full upload before seeing an error from the server.  
> Fix: check `file.size > 5 * 1024 * 1024` on file select and show inline error immediately.

**[No Drag-and-Drop on FileInput]**  
Users expect to drag a photo onto the upload area. The current component is click-only. Drag-and-drop is a standard UX pattern for file uploads.  
> Fix: add `dragover` / `drop` event listeners to the upload zone.

**[Select Component Has No Keyboard Search / Type-Ahead]**  
The custom Select (district, gender) has no type-ahead search. For the district dropdown with 25 options, keyboard users must arrow-key through every option.  
> Fix: add type-ahead filtering when user types while dropdown is open.

**[DatePicker and TimePicker Have No Keyboard Navigation]**  
Both custom pickers rely on click-only interactions. Keyboard-only users (and screen reader users) cannot navigate month/year changes in DatePicker or hour/minute changes in TimePicker without mouse.  
> Fix: add arrow key handlers to both pickers.

**[No Focus Rings on Custom Inputs]**  
The custom Select, DatePicker, TimePicker, and FileInput components do not show visible focus rings when tabbed to. This breaks keyboard navigation visibility.  
> Fix: add `outline: 2px solid var(--color-coral); outline-offset: 2px` on `:focus-visible` for all custom inputs.

**[Required vs Optional Fields Inconsistent]**  
Email is marked "(optional)" but phone has no such label — yet phone is required. District, gender, DOB are required but have no asterisk or indicator. Users cannot tell at a glance what they must fill in.  
> Fix: add required indicator (asterisk + legend) to all required fields; explicitly mark all optional ones.

**[No Trust Signals on Auth Forms]**  
Sign-up and sign-in forms have no SSL/security badges, no "we never share your data" copy, no privacy link in context. For a matchmaking site handling personal data, this reduces trust.  
> Fix: add a small privacy note or link to the Privacy & Trust page under auth forms.

**[Forgot Password — No Timing Expectation Set]**  
After submitting the forgot-password form, users see a generic success message with no information about how long the reset email will take or where to look.  
> Fix: add "Check your inbox — the link expires in 1 hour."

**[Password Error Does Not Repeat Requirements]**  
When password validation fails, the error says "Password too weak" but does not repeat what the requirements are. Users already past the strength bar have to remember the rules.  
> Fix: include requirements in the error message ("Must be at least 8 characters with a letter and a number").

**[Session Expiry Is Silent]**  
If the PHP session expires while a user is on the dashboard, the next API call fails silently or returns a 401. Users are not redirected to sign in with an explanation.  
> Fix: detect 401 responses in AuthProvider and redirect to `/sign-in` with a "Session expired" banner.

**[Social Icons in Footer Below 44px Touch Target]**  
The social icon `<a>` elements are small SVG icons with no padding. On mobile, the touch target is too small (likely 24×24px). WCAG 2.5.5 recommends 44×44px minimum.  
> Fix: add `padding: 10px` to social icon links so the tap area reaches 44×44px.

**[Locale Toggle Below 44px Touch Target]**  
The language switcher buttons are small text buttons. Same touch target issue as social icons.  
> Fix: ensure locale toggle buttons have min 44×44px tap area.

**[Gold Text on Dark Footer Background Fails Contrast]**  
The primary gold/coral color (`--color-primary`) used for links in the dark footer may not meet WCAG AA contrast ratio (4.5:1 for normal text). Needs a contrast audit.  
> Fix: audit contrast of footer link color against footer background; adjust if below 4.5:1.

**[No prefers-reduced-motion Support]**  
The route-load spinner and any CSS transitions do not check `prefers-reduced-motion`. Users who have requested reduced motion (vestibular disorder, epilepsy risk) still see animations.  
> Fix: add `@media (prefers-reduced-motion: reduce) { * { animation: none; transition: none; } }` guard.

**[Hamburger Menu Focus Not Trapped When Open]**  
On mobile, opening the nav menu does not trap focus inside it. Keyboard users can tab through the page behind the menu. When closed, focus is not returned to the hamburger button.  
> Fix: implement focus trap on mobile nav open; return focus to trigger on close.

**[Member Photo Cards Lack Context]**  
Member photos on the home page (if shown) have no caption, no description, no alternative text structure. Screen reader users get nothing, and sighted users get no context.  
> Fix: add descriptive alt text; consider adding a brief caption or badge (district, age range).

---

## 🔵 Low — Minor Gaps

**[Google OAuth Error on SignUp Still Shows Raw Key]**  
In `SignUp.jsx`, the `onError` handler still exposes the raw error key (e.g. `google_verify_failed`) instead of a human-readable message. `SignIn.jsx` was fixed; `SignUp.jsx` was missed.  
> Fix: apply same `GOOGLE_ERROR_FALLBACKS` map pattern from `SignIn.jsx` to `SignUp.jsx`.

**[No "Back to Edit" From ThankYou Page]**  
After registration submission, there is no link back to the form to correct a mistake. Users who spot an error after submitting have no self-service correction path.  
> Fix: add "Need to correct something? Contact us" link on ThankYou page with a prefilled contact subject.

**[No Scroll-to-Error on Form Submit]**  
When the registration form has validation errors, the page does not scroll to the first error. If the user submitted from the bottom of the form, the errors at the top are not visible.  
> Fix: after validation, scroll the first `.field-error` into view.

---

## Summary Counts

| Severity | Count |
|---|---|
| 🔴 Critical | 2 |
| 🟠 High | 7 |
| 🟡 Medium | 15 |
| 🔵 Low | 3 |
| **Total** | **27** |

---

## ✅ Fixed

| Item | Fixed in |
|---|---|
| Birth Time Field Has No Explanation | `Register.jsx` — hint text added |
| Phone Number Format Not Explained | `Register.jsx` — format example hint added |
| Email Field Marked Optional Silently | `Register.jsx` — "(optional)" label + hint |
| No Loading Indicator During Form Submission | All forms — submit button text fallbacks |
| No "Back to Edit" / Account CTA From ThankYou | `ThankYou.jsx` — sign-up CTA block added |
| Date Picker "Today" Button Silent Failure | `DatePicker.jsx` — disabled + dimmed when out of range |
| No "Remove Photo" Confirmation | `FileInput.jsx` — confirm dialog before clear |
| Social Footer Icons Are Dead | `Footer.jsx` — converted to `<a>` links |
| No Route-Level Loading Indicator | `App.jsx` — spinner added to RouteFallback |
| No Redirect or Confirmation After SignUp | `SignUp.jsx` — redirects to `/sign-in` with banner |
| Forgot Password Link Missing on SignIn | `SignIn.jsx` — link added |
| Google OAuth Error Message Too Technical (SignIn) | `SignIn.jsx` — humanized error map |
| Password Strength Hint Is Static | `SignUp.jsx` — real-time strength bar |
| No Account Dashboard / Profile Page | `Dashboard.jsx` created |
| No 404 Page | `NotFound.jsx` created |
