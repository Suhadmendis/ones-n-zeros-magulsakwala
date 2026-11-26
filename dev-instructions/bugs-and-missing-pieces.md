# Bugs & Missing Pieces — User Perspective Audit

Audited: 2026-11-26  
Branch: dev  
Method: Two agents walked through every page, form, and API flow as a first-time human user.

---

## 🟡 Medium — Friction, Missing Polish, Silent Failures

**[Password Strength Mismatch Between Frontend and Backend]**  
Frontend enforces letters + digits (enforced via `requireStrong: true`). Backend signup.php only checks minimum 8 characters. A user who bypasses the frontend can set a weak password the site claims shouldn't be possible.  
> *Note: backend now enforces complexity — but frontend `validation.js` `requireStrong` logic should be verified to match exactly.*

**[Frontend/Backend Validation Inconsistency — Name & Email]**  
Frontend validates name min 2 chars, max 80. Backend only checks non-empty. Frontend uses strict email regex with TLD check; backend uses PHP's `filter_var`. These can produce different accept/reject results for the same input.  
> *Note: backend now enforces name min 2 chars — email regex parity still unverified.*

**[Google Account Auto-Merge With No Warning]**  
If a user has an email/password account and later signs in with Google using the same email, `google_auth.php` silently merges the accounts. No confirmation, no notification. User may be confused why their Google login "just worked" on an account they made manually.  
> *Note: backend now returns `merged: true` and SignIn shows a banner — but SignUp Google path does not yet handle merge notification.*

**[Register Form Has No Step Progress Indicator]**  
The registration form is long with no visual progress, no section headings, no "step 2 of 4" indicator. Users can't tell how much is left.

---

## 🔵 Low — Minor UX Gaps

**[Google OAuth Error Message Too Technical]**  
On Google auth failure in SignUp, users still see the raw error key `google_verify_failed` — not a human-readable message. (SignIn is fixed; SignUp `onError` still uses old key.)

---

## Summary Counts

| Severity | Count |
|---|---|
| 🟡 Medium | 4 |
| 🔵 Low | 1 |
| **Total** | **5** |

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
| No "Forgot Password" / Password Reset Flow | `api/password-reset.php` (new) + `ForgotPassword.jsx` (new) |
| No Account Dashboard / Profile Page | `Dashboard.jsx` + `Dashboard.css` (new), header user name links to `/dashboard` |
| No 404 Page | `NotFound.jsx` (new), `path="*"` now renders it |
| Register vs SignUp Journey Is Unclear | `Register.jsx` account banner + `ThankYou.jsx` sign-up CTA |
| Google OAuth Silent Failure — Missing Client ID | `main.jsx` — console.warn guard added |
| No Loading Indicator During Form Submission | All forms — submit button text fallbacks added |
| Google OAuth Error Message Too Technical (SignIn) | `SignIn.jsx` — `GOOGLE_ERROR_FALLBACKS` map + humanized message |
| Forgot Password Link Missing on SignIn | `SignIn.jsx` — link added above submit |
| Password Strength Hint Is Static | `SignUp.jsx` — real-time weak/medium/strong bar |
| Date Picker "Today" Button Silent Failure | `DatePicker.jsx` — disabled + dimmed when out of range |
| No "Back to Edit" / Account CTA From ThankYou | `ThankYou.jsx` — sign-up CTA block added |
| Birth Time Accepts Invalid Times | `api/register.php` — hours ≤23, mins ≤59 guard |
| Logout May Fail Silently | `api/logout.php` + `AuthProvider.jsx` — failure logged |
| Password Strength Backend Not Enforced | `api/signup.php` — letter+digit complexity required |
| Name Min-Length Not Enforced on Backend | `api/signup.php` — min 2 chars enforced |
| No "Remove Photo" Confirmation | `FileInput.jsx` — `window.confirm` before clear |
| Google Account Merge — No Notification | `api/google_auth.php` returns `merged: true`, `SignIn.jsx` shows banner |
