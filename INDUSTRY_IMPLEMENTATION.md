# Industry login and workspace

Industry is a fourth login option. The authenticated backend role determines the destination; choosing a tab does not grant a role.

The later full-workspace integration extends this implementation. All active login tabs now use versioned signin, and active registration uses `platform/PlatformRegistration.tsx`. Choose Workspace for additional opportunity editing, feedback, documents, mentoring and collaboration actions. See [Frontend implementation](FRONTEND_IMPLEMENTATION.md) for the current behavior and validation results.

## Modules

| Module | Responsibility |
| --- | --- |
| `src/lib/authApi.ts`, `api.ts`, `src/app/AuthContext.tsx` | Versioned industry signin, profile normalization, persisted session restoration, and signout revocation request. Existing student/alumni login stays compatible. |
| `src/lib/roleRedirect.ts`, `src/app/App.tsx` | Industry dashboard routing and guards against opening industry pages as another role. Backend authorization remains authoritative. |
| `src/app/components/industry/IndustryRegistration.tsx` | Industry signup with primary domain, email-code verification, resend, and recovery of an unfinished verification flow. |
| `src/lib/industryApi.ts` | Typed client for company profile, owned opportunities, requirements, applications, and candidate/faculty matches. |
| `src/app/components/industry/IndustryPortal.tsx` | Dashboard, company profile, opportunity drafts and skill requirements, publication after admin approval, archive, application status changes, and matching. |
| `Navbar.tsx`, `Sidebar.tsx` | Industry navigation on desktop and mobile. |

## Use

1. Run the migrated backend and load its taxonomy. Configure `VITE_API_URL` for the frontend.
2. Choose Industry on the login page, then Sign up, or use Register as an industry partner on registration.
3. Register with email, password, contact name and primary domain. Configure and run the backend mail delivery worker to deliver the queued verification code. The interface does not bypass email verification.
4. Verify the code and sign in using Industry. Complete Company profile.
5. Create an opportunity, choosing its domain and optional discipline. The cross-domain checkbox deliberately permits candidates across all domains and disciplines.
6. Add required skills. An administrator approves the draft via the backend approval API. Refresh the workspace, then publish. Editing requirements resets approval.
7. Use Applications for owned opportunity applications and permitted status transitions. Use Matches to retrieve eligible, discoverable students or faculty.

## Limits

- This is role-specific industry UI with domain-aware opportunity controls. It does not create separate Engineering/AYUSH student areas or turn self-declared domain data into verified access membership. See `../Backend-Grad/docs/DOMAIN_ACCESS_AUDIT.md`.
- The dedicated industry portal still uses its compact application view. The new Workspace adds application feedback, requirement editing and full API-backed record views; certificates remain the records returned by the backend rather than a separate certificate designer.
- Lists follow the current backend limits (owned opportunities/applications default 100; skills up to 200; matches up to 50). A paginated large-scale recruiter interface remains future work.
- Email verification and recovery need working SMTP/outbox delivery. No email was sent during implementation.
- A network failure during logout can prevent server revocation; the local session is cleared immediately. Account & domain in Workspace now provides explicit session renewal. Access tokens are not automatically refreshed.
- Backend endpoint tests, frontend authentication/routing/render tests, and production build are used for validation. Interactive browser validation was unavailable because no in-app browser was exposed in this session.
