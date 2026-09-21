# Frontend production deployment

## Implemented

- Vercel config uses Vite, npm ci, a type-checked build and dist output.
- Production builds require an HTTPS VITE_API_URL origin. The current default is
  https://backend-grad-gxdl.onrender.com; trailing slashes are removed by the client.
- Security headers restrict executable scripts to this origin, disallow framing,
  restrict browser permissions and permit API/secure WebSocket traffic to Render.
  Inline styles remain allowed for the existing React styling. Google Fonts and
  HTTPS images remain supported. Update connect-src when changing the API host.
- Hashed assets are cached for one year; the root HTML is revalidated. Navigation
  uses hashes, so workspace URLs do not require a catch-all server rewrite.
- A top-level error boundary provides recovery for rendering/lazy-loading errors.
- Mentorship navigation now opens the real backend workflow. Sample landing-page
  testimonials, totals and booking notifications were removed. Footer navigation
  uses actual application actions instead of inert placeholder links.
- Updated vulnerable packages; the install audit reports zero known advisories.
- Type checking is part of npm run build. CI runs install, tests, build and audit.

## Vercel settings

Use the Frontend-Grad repository root (or Frontend-Grad as Root Directory in a
combined repository). Framework: Vite. Build: npm run build. Output: dist.
Node: 22.x. Set the following public build variable for Production:

```dotenv
VITE_API_URL=https://backend-grad-gxdl.onrender.com
```

Do not put database passwords, JWT secrets or Redis URLs in VITE_ variables.
Vite variables are embedded into the public browser bundle.

Publish the source changes and redeploy Vercel. Existing Vercel environment values
override .env.production, so remove any stale localhost value. Backend CORS must
include https://frontend-grad.vercel.app. Preview domains need explicit backend
CORS entries and an appropriate test backend before authenticated preview testing.

## Validation and remaining release checks

19 regression/integration checks passed, including the downloaded deployment
contract comparison. All frontend TypeScript files pass type checking. The build
and tests ran locally using Node 24; the CI configuration targets Node 22 and has
not been executed remotely in this session. No Vercel deployment was performed.

These checks do not replace real browser validation. Before accepting the release,
verify sign-in/sign-out for each role, verification email, session expiry, domain
isolation, uploads, PDF downloads, mentorship booking and WebSocket messaging on
the deployed site. Check mobile keyboard navigation, focus, browser console and
network errors, and the delivered security headers. Performance and accessibility
scores have not been measured in a browser.

Access and refresh tokens currently use localStorage. Backend authorization is
still required for every protected action. A future cookie-session change requires
coordinated backend CSRF/cross-origin support; the deployment changes do not add it.
Institution-approved privacy/terms content and support contact details still need
to be supplied before a public launch. No legal content has been invented.

Frontend hosting does not certify backend concurrency. The earlier backend load
audit's unresolved 1,000-user latency target remains a separate deployment gate.

References: https://vercel.com/docs/frameworks/frontend/vite and
https://vercel.com/docs/project-configuration/vercel-json
