# Registration QA report

Date: 2026-10-24 (Asia/Bangkok)
Checkout: C:\Users\Thin\Desktop\E-commerce-fix
Scope: local signup regression QA, not the complete storefront or deployed production app.

## Environment

Next.js development server on localhost:3017. Temporary process-only AUTH_SECRET and DATABASE_URL pointing to an unreachable localhost MongoDB port. No production credentials, database records, or deployment were changed. The local server was stopped to test request failures.

## Browser results

| Scenario | Result | Evidence |
| --- | --- | --- |
| Signup page loads | PASS | Form renders instead of application error |
| Empty required fields | PASS | Browser blocks submit and focuses Full Name |
| Invalid email | PASS | Browser rejects missing @ |
| Mismatched passwords | PASS | Inline Passwords don't match error |
| Password under six characters | PASS | Server action returns inline length validation error |
| Pending registration | PASS | Create Account disabled during request |
| Real Prisma connection failure | PASS | Inline retry-later message, preserved input, button re-enabled, no error-page navigation |
| Safe server diagnostics | PASS | Server logs P2010 and error type, without submitted credentials |
| Server stopped before submit | PASS | Unable to contact the server message; form remains usable |
| Password visibility toggle | PASS | Password input changes to text and back |
| Sign-in navigation | PASS | Sign in link opens /login |
| Manual-login fallback notice | PASS (render only) | /login?registered=true displays account-created notice |
| Mobile 390 x 844 | PASS | No horizontal overflow; form controls visible |
| Desktop 1440 x 900 | PASS | Two-column layout; no horizontal overflow |

## Automated results

Five regression tests PASS: account creation and automatic sign-in, invalid input, existing/concurrent duplicate email, lookup/create failures, and manual-login fallback. These tests mock database and authentication dependencies.

TypeScript --noEmit: PASS.
ESLint for changed source and regression tests: PASS.
Production build: PASS after the follow-up fixes below.

## Findings and limits

- FIXED: password visibility buttons now have descriptive Show/Hide labels and aria-controls on both signup and login. Verified in the production browser accessibility tree, including label changes when toggled.
- Successful account persistence, real duplicate-account checks, session persistence, and authenticated redirect require a working test MongoDB database. They were verified only with mocked action tests, not end-to-end.
- Google OAuth was not exercised because local Google credentials are absent.
- The original production exception cannot be identified from the screenshot digest. Vercel runtime logs and database configuration are still needed.
- This QA pass validates graceful failure handling, not production readiness of account creation or the whole e-commerce app.

## Screenshot evidence

Screenshots saved in the chat visualization output directory: signup-database-error.png, signup-network-error.png, signup-mobile.png.

## Follow-up fixes and verification

- Homepage uses request-time rendering so builds do not query the product database.
- Homepage catches featured-product query failures and shows an explicit unavailable message; other homepage sections remain visible.
- Production build: PASS with the intentionally unreachable QA database. Compilation, TypeScript, and all static-page generation completed.
- Production server: PASS for /register and /login named visibility controls, including updated Hide labels after clicking.
- Production server: PASS for homepage rendering with Prisma connection failure. Featured Pieces displays the unavailable message; navigation and other sections remain visible.
- Registration regression suite: all five tests PASS.
- ESLint on all changed source and tests: PASS. git diff --check: PASS.
- Screenshot: home-outage-fixed.png in the chat visualization directory.

Real registration persistence and Google OAuth still require working test credentials. No production credentials or deployment were changed.
