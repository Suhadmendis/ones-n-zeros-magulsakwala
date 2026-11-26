# Bugs & Missing Pieces — User Perspective Audit

Audited: 2026-11-26  
Branch: dev  
Method: Two agents walked through every page, form, and API flow as a first-time human user.

---

## 🔴 Critical — Blocks Users Completely

**[Login Flow — Google-only users get "invalid credentials" forever]**  
Users who signed up via Google have no password_hash in the DB. When they try to log in with email/password, backend returns generic `invalid_credentials`. User thinks their account doesn't exist. They're locked out with no path forward. Need to detect this case and return a message like "You signed up with Google — use the Google button."

**[No "Forgot Password" / Password Reset Flow]**  
No `/api/password-reset.php` and no forgot-password page exist. Users who forget their password are permanently stuck. No recovery path at all.

**[Social Footer Icons Are Dead]**  
Facebook, Instagram, YouTube, TikTok icons in the footer are `<span>` elements with no `href` or click handler. Users see icons but nothing happens when clicked.

---

## 🟠 High — Confusing or Broken Experience

**[Register vs SignUp Journey Is Unclear]**  
Two separate flows exist: `/register` (matrimonial profile) and `/sign-up` (create login account). The home page pushes users to `/register` with every CTA, but users need an account too. The site never tells users they must do both, in what order, or why. Users who submit a registration form without an account have no way to log in later and view or manage it. Backend also does not link registrations to user accounts.

**[No Account Dashboard / Profile Page]**  
After signing in, the header shows the user's name and a sign-out button — but there is no profile page, no dashboard, no way to view or edit a submitted proposal. Signed-in users hit a dead end.

**[No Redirect or Confirmation After SignUp]**  
After successful signup, the user is silently navigated to the homepage. No welcome message, no toast, no prompt to complete their profile or go to `/register`. User lands on the home page not knowing what just happened.

**[ThankYou Page Loses Registration Data]**  
After registration, the backend returns a registration ID but the frontend throws it away. The ThankYou page only receives `{ submitted: true }` — no confirmation number, no summary of what was submitted. If the user refreshes the thank-you page they're redirected back to `/register` with no record of their submission visible.

**[Google OAuth Silent Failure — Missing Client ID]**  
If `VITE_GOOGLE_CLIENT_ID` env var is not set, an empty string is passed to GoogleOAuthProvider. The Google Sign-In button silently fails to initialize. Users see either nothing or "An error occurred" with no explanation.

**[No Content Load Error State]**  
If `/api/content.php` fails, the entire site renders blank (all text is empty strings). No error message, no retry button, no fallback copy. Users see a skeleton of a site with no words.

---

## 🟡 Medium — Friction, Missing Polish, Silent Failures

**[No Loading Indicator During Form Submission]**  
When any form is submitting, the submit button disables but shows no spinner or text change. On slow connections (1–2s), users see a frozen form with no feedback. Many will tap/click again thinking it didn't register.

**[Password Strength Mismatch Between Frontend and Backend]**  
Frontend enforces letters + digits (enforced via `requireStrong: true`). Backend signup.php only checks minimum 8 characters. A user who bypasses the frontend can set a weak password the site claims shouldn't be possible.

**[Frontend/Backend Validation Inconsistency — Name & Email]**  
Frontend validates name min 2 chars, max 80. Backend only checks non-empty. Frontend uses strict email regex with TLD check; backend uses PHP's `filter_var`. These can produce different accept/reject results for the same input.

**[No Route-Level Loading Indicator]**  
`RouteFallback` (shown while lazy page chunks load) is a blank 60vh div with only `aria-busy="true"`. No spinner, no skeleton, no text. Users see a blank white area and don't know the page is loading.

**[No 404 Page]**  
All unknown routes redirect silently to `/`. Users who land on a broken or old link get redirected to home with zero explanation. They don't know the page doesn't exist.

**[Google Account Auto-Merge With No Warning]**  
If a user has an email/password account and later signs in with Google using the same email, `google_auth.php` silently merges the accounts. No confirmation, no notification. User may be confused why their Google login "just worked" on an account they made manually.

**[Login With Google Account Gives Wrong Error]**  
See critical section — this also surfaces as confusing UX when users try wrong login method.

**[Logout May Fail Silently]**  
`logout.php` result is not checked. If the backend session destroy fails (network error, etc.), the frontend still clears local state. User thinks they're logged out but their backend session persists.

**[Birth Time Field Has No Explanation]**  
Registration form requires birth time. No tooltip, no hint text explaining why (astrological matching). Users who don't know their birth time have no guidance on what to enter or whether it can be skipped.

**[Email Field in Registration Marked Optional — But Silently]**  
The email field in the registration form is optional (no asterisk, no "(optional)" label). Users assume it's required. If they skip it, they'll never receive confirmation emails. No copy explains the consequence of leaving it blank.

**[Phone Number Format Not Explained]**  
On validation failure, the phone field shows the error key `phone_invalid` with no format example. Users don't know if they should enter `+94701234567`, `0701234567`, or `07 012 3456`.

**[Password Strength Hint Is Static — No Real-Time Feedback]**  
SignUp form shows "At least 8 characters, mix letters and numbers" as static hint text. No indicator shows whether the current password input meets the criteria. User only finds out on submit.

**[Date Picker "Today" Button Silent Failure]**  
If today falls outside the date picker's min/max range, clicking "Today" does nothing. No visual feedback, no disabled state, no tooltip. Looks like a broken button.

**[District Dropdown Empty on Slow Load]**  
The district select in registration pulls from content API. If `/api/content.php` is slow (currently ~1.6s to remote DB), the dropdown is empty until content loads. Users see a blank select on first visit.

**[Birth Time Accepts Invalid Times]**  
Backend regex validates format HH:MM but not whether the time is real (e.g., 25:70 passes). Frontend TimePicker prevents this UI-side but no backend guard exists.

**[SignIn Uses Wrong CSS Class Prefix]**  
`SignIn.jsx` uses `className="signup-section"` and `className="signup-card"` — sign-in styles inherit from sign-up CSS. Styling bugs and unintended overrides will appear as these components diverge.

**[No "Back to Edit" From ThankYou Page]**  
ThankYou page has no link back to fix a mistake. If a user spots an error after submitting, they have no path to edit their registration.

**[Register Form Has No Step Progress Indicator]**  
The registration form is long (personal details, family, preferences, photo, etc.) with no visual progress, no section headings that group steps, no "step 2 of 4" indicator. Users can't tell how much is left.

---

## 🔵 Low — Minor UX Gaps

**[No "Remove Photo" Confirmation]**  
FileInput "Remove" button (red) deletes the selected photo with no confirmation prompt. Easy to accidentally remove an uploaded photo.

**[Google OAuth Error Message Too Technical]**  
On Google auth failure, users see the raw error key `google_verify_failed` — not a human-readable message.

**[SignUp Has No Link to SignIn]**  
If a user who already has an account lands on `/sign-up`, there's no "Already have an account? Sign in" link. They must navigate manually.

**[SignIn Has Unused Import (Minor Lint)]**  
`Link` is imported in `SignIn.jsx` but never used — indicates a "forgot password" or "back" link was planned but not built.

---

## Summary Counts

| Severity | Count |
|---|---|
| 🔴 Critical | 3 |
| 🟠 High | 7 |
| 🟡 Medium | 14 |
| 🔵 Low | 4 |
| **Total** | **28** |
