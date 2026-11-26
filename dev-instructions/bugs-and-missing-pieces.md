# Bugs & Missing Pieces — User Perspective Audit

Audited: 2026-11-26  
Branch: dev  
Method: Two agents walked through every page, form, and API flow as a first-time human user.

---

## 🔴 Critical — Blocks Users Completely

**[No "Forgot Password" / Password Reset Flow]**  
No `/api/password-reset.php` and no forgot-password page exist. Users who forget their password are permanently stuck. No recovery path at all.

---

## 🟠 High — Confusing or Broken Experience

**[Register vs SignUp Journey Is Unclear]**  
Two separate flows exist: `/register` (matrimonial profile) and `/sign-up` (create login account). The home page pushes users to `/register` with every CTA, but users need an account too. The site never tells users they must do both, in what order, or why. Users who submit a registration form without an account have no way to log in later and view or manage it. Backend also does not link registrations to user accounts.

**[No Account Dashboard / Profile Page]**  
After signing in, the header shows the user's name and a sign-out button — but there is no profile page, no dashboard, no way to view or edit a submitted proposal. Signed-in users hit a dead end.

**[Google OAuth Silent Failure — Missing Client ID]**  
If `VITE_GOOGLE_CLIENT_ID` env var is not set, an empty string is passed to GoogleOAuthProvider. The Google Sign-In button silently fails to initialize. Users see either nothing or "An error occurred" with no explanation.

---

## 🟡 Medium — Friction, Missing Polish, Silent Failures

**[No Loading Indicator During Form Submission]**  
When any form is submitting, the submit button disables but shows no spinner or text change. On slow connections (1–2s), users see a frozen form with no feedback. Many will tap/click again thinking it didn't register.

**[Password Strength Mismatch Between Frontend and Backend]**  
Frontend enforces letters + digits (enforced via `requireStrong: true`). Backend signup.php only checks minimum 8 characters. A user who bypasses the frontend can set a weak password the site claims shouldn't be possible.

**[Frontend/Backend Validation Inconsistency — Name & Email]**  
Frontend validates name min 2 chars, max 80. Backend only checks non-empty. Frontend uses strict email regex with TLD check; backend uses PHP's `filter_var`. These can produce different accept/reject results for the same input.

**[No 404 Page]**  
All unknown routes redirect silently to `/`. Users who land on a broken or old link get redirected to home with zero explanation. They don't know the page doesn't exist.

**[Google Account Auto-Merge With No Warning]**  
If a user has an email/password account and later signs in with Google using the same email, `google_auth.php` silently merges the accounts. No confirmation, no notification. User may be confused why their Google login "just worked" on an account they made manually.

**[Logout May Fail Silently]**  
`logout.php` result is not checked. If the backend session destroy fails (network error, etc.), the frontend still clears local state. User thinks they're logged out but their backend session persists.

**[Password Strength Hint Is Static — No Real-Time Feedback]**  
SignUp form shows "At least 8 characters, mix letters and numbers" as static hint text. No indicator shows whether the current password input meets the criteria. User only finds out on submit.

**[Date Picker "Today" Button Silent Failure]**  
If today falls outside the date picker's min/max range, clicking "Today" does nothing. No visual feedback, no disabled state, no tooltip. Looks like a broken button.

**[Birth Time Accepts Invalid Times]**  
Backend regex validates format HH:MM but not whether the time is real (e.g., 25:70 passes). Frontend TimePicker prevents this UI-side but no backend guard exists.

**[No "Back to Edit" From ThankYou Page]**  
ThankYou page has no link back to fix a mistake. If a user spots an error after submitting, they have no path to edit their registration.

**[Register Form Has No Step Progress Indicator]**  
The registration form is long with no visual progress, no section headings, no "step 2 of 4" indicator. Users can't tell how much is left.

---

## 🔵 Low — Minor UX Gaps

**[No "Remove Photo" Confirmation]**  
FileInput "Remove" button (red) deletes the selected photo with no confirmation prompt. Easy to accidentally remove an uploaded photo.

**[Google OAuth Error Message Too Technical]**  
On Google auth failure, users see the raw error key `google_verify_failed` — not a human-readable message.

---

## Summary Counts

| Severity | Count |
|---|---|
| 🔴 Critical | 1 |
| 🟠 High | 3 |
| 🟡 Medium | 11 |
| 🔵 Low | 2 |
| **Total** | **17** |

---

## ✅ Fixed

| Item | Fixed in |
|---|---|
| Login Flow — Google-only users get "invalid credentials" | `api/login.php` — returns `use_google_login` error |
| Social Footer Icons Are Dead | `Footer.jsx` — converted to `<a>` links |
| No Redirect or Confirmation After SignUp | `SignUp.jsx` → redirects to `/sign-in` with banner |
| ThankYou Page Loses Registration Data | `Register.jsx` + `ThankYou.jsx` — passes and shows `#id` |
| No Content Load Error State | `ContentProvider.jsx` — error screen + Retry button |
| No Route-Level Loading Indicator | `App.jsx` — spinner added to RouteFallback |
| Birth Time Field Has No Explanation | `Register.jsx` — hint text added |
| Email Field in Registration Marked Optional Silently | `Register.jsx` — "(optional)" label + hint |
| Phone Number Format Not Explained | `Register.jsx` — format example hint added |
