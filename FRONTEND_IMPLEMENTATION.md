# GradAlumni frontend integration

## Guided delivery pages

The workspace now opens guided workflows for these pages:

- `/#workspace/certificates`: students select certificates to download or verify; authorized issuers select completed applications to issue or revoke certificates.
- `/#workspace/training`: students browse and enroll; institution administrators create programs, select enrollment records in reports, record completion and manage availability.
- `/#workspace/practical`: browse assessments, submit evidence, view submissions, and create, review or archive assessments when authorized.
- `/#workspace/collaborations`: select a team and milestone, submit evidence, review milestones and inspect progress.

Select a record in the results, then choose the next workflow step. Selected identifiers carry into the next form. Changing a parent record clears dependent identifiers. Other operations remain available under **All actions**. Backend ownership, verification, domain and institution checks remain authoritative; role visibility alone does not grant access.

Validation: 17 frontend tests passed, including full HTTP catalogue coverage, role-filtered workflow rendering, authenticated transport, uploads, downloads and enrollment selection. Four backend contract tests passed against frontend-generated request payloads. This is not a live end-to-end browser test of every endpoint. The catalogue covers 350 HTTP operations across 29 modules, including explicit dispositions for aliases, identity, diagnostics and compatibility endpoints.

Delivery continuation: the workspace now has 29 modules and a 350-operation catalog. **Certificates**, **Training programs** and **Practical assessments** are new; **Collaboration teams** includes evidence milestones and review. See the [workflow and setup guide](../Backend-Grad/docs/DELIVERY_TRAINING_IMPLEMENTATION.md). Apply the backend migration before using these actions. The 328-operation count below records the earlier learning-roadmap milestone.

Latest addition: **Workspace → Learning → View my learning roadmap** lets students choose an eligible target opportunity, track recommended resources and launch reassessment. Returning from reassessment refreshes gaps from validated evidence. The API catalog now contains 328 HTTP operations. See the [proposal completion audit](../Backend-Grad/docs/PROPOSAL_COMPLETION_AUDIT.md) for unfinished requirements; API coverage does not mean the entire proposed product is complete.

The frontend now includes a role-aware workspace alongside the existing dashboards and industry portal. Sign in and select **Workspace** in the top navigation or **All workspace pages** in the sidebar. On smaller screens, open the navigation menu and choose Workspace.

Each workspace module has its own address, for example `/#workspace/assessments`, `/#workspace/opportunities`, `/#workspace/institutions`, and `/#workspace/administration`. The active account determines which actions are visible. Backend authorization remains authoritative for role, ownership, membership and institution scope.

## Pages

| Module | Connected workflows |
| --- | --- |
| Overview | Existing dashboard summaries and role-specific activity |
| Skills & readiness | Domain profile, skill claims, competencies, recalculation, readiness and history |
| Education & portfolio | Create, view, edit and remove education and portfolio evidence |
| Assessments | Domain-filtered catalogue, timed questions, saved in-tab attempts, submission, results and reassessment; assessment creation for administrators |
| Learning | Resources, recommendations, start/complete actions, learning history and reassessment guidance |
| Opportunities | Browse/filter, create, edit, archive, skill requirements, approved publication and student applications |
| Applications | Application details, permitted status changes, progress and employer/mentor feedback |
| Matches & career paths | Recommendations, scores, explanations, skill gaps, recalculation and career paths |
| Recruitment | Owned opportunities and student/faculty candidate matching |
| Projects & research | Projects, research, consultancy, faculty development, applications and project membership/mentors |
| Collaboration teams | Team creation, invitations, joining, membership, removal, progress, skill coverage and feedback |
| Mentorship | Mentor discovery, recommendations, requests, decisions, scheduling, cancellation, completion and feedback |
| People & organizations | Alumni, faculty and industry profiles, expertise and faculty research |
| Messages | Conversation creation/list/detail, message history, sending, read state and live updates |
| Communities | Browse/create/join/leave communities, posts, likes and replies |
| Events | Browse/create events, details and RSVP/cancellation |
| Documents | Resume upload/list/download/delete, student-proof upload/list and authorized verification-document download |
| Career tools | Resume/opportunity skill extraction, mapping unverified claims, profile summaries and career assistance |
| Notifications | Read updates, mark read, mark all read and administrative notification creation |
| Preferences & privacy | Account details, notifications, privacy, language and supported security preferences |
| Account & domain | Account/profile changes, explicit session renewal and account deactivation |
| Institutions & reports | Institution directory/profile, assigned students/departments, analytics, readiness, skill demand/gaps, placements and collaboration reports |
| Domains & skill catalogue | Domains, disciplines, skills, competencies, maps, assessment frameworks and administrative weights |
| Administration | Review queue, users, roles, institution assignment, suspension/restoration, verification, opportunity approval, taxonomy import, analytics, audits and legacy earnings/payout records |
| Plans & subscriptions | Plan listing/administration, trial activation and current subscription status |
| Job board | Existing job postings, applications, saved jobs and posting workflows |

## Working with records

1. Open a module and select a View action. Lists load automatically when all required references are available.
2. Use domain/search/limit/offset filters where the backend supports them, then choose Load records.
3. Select **Use this record**. Choose the next action in the same module to prefill its references. Selected references also remain available when moving between workspace modules in the same session.
4. Complete the labelled fields and submit. Nested questions, lists and score maps have structured editors; JSON input is not required.
5. Destructive actions show an explicit confirmation before sending the request. Errors and successful changes are displayed inline.

Some backend relationships do not expose a complete searchable directory. Reference fields provide suggestions where possible and allow a known reference to be entered. Loaded results are displayed in groups of 20; server-side pagination remains controlled by the endpoint's limit/offset fields where available.

## Important flows

**Assessment:** Skills catalogue or Assessments → choose a domain → View assessments → Use this record → Start/Reassess. Answers persist in this browser tab per user and assessment. The server owns scoring and expiry validation. Submitted results lead to the learning and skill-gap modules.

**Recruiting:** Opportunities → create a draft → add required skills. Administrator: Administration → Review pending submissions → select the opportunity → approve. Publisher: publish the approved opportunity. Students can apply where the backend's domain/discipline eligibility permits. Applications provides progress, status and feedback actions.

**Resume:** Documents → Upload resume PDF or View my uploaded resumes → Use this record. Career tools → Extract resume skills / Map skills. Extraction creates unverified claims, not validated competency scores. Resume files are fetched with authentication.

**Verification:** Administrator: Administration → Review pending submissions. The queue provides references for opportunities, portfolio evidence, professional profiles and student proofs. Documents → Download verification document allows the document owner or a platform administrator to retrieve the file. Verification actions remain in Administration.

**Messaging:** Messages → create or view a conversation → Use this record. The live panel loads history, marks the conversation read, and opens an authenticated WebSocket. Sending uses an acknowledged REST request; live updates arrive through the socket. If it closes, the view polls every five seconds until it is reopened.

## Accounts and domains

- Student, alumni, industry, faculty/academician, institution administrator, admin and super-admin roles are recognized. Faculty, institution administrators and super-admins land in Workspace.
- New signup uses the versioned API and includes domain and optional discipline. Ayurveda is a discipline under AYUSH in the seed catalogue.
- All active login tabs use versioned signin. The backend role, not the selected tab, determines permissions. Account restoration merges legacy profile fields for existing screens.
- Email verification is required by versioned signin. Existing unverified accounts can use Verify an existing account and Resend code. SMTP configuration and the outbox delivery worker are required for actual email delivery; seeded demo accounts are preverified.
- Old access tokens may require signing in again after this update. Session renewal is available under Account & domain. Logout requests server revocation and clears local access/refresh tokens.
- Domain-aware lists start with the account's primary domain where that filter is supported. This is personalization, not strict data isolation. Self-editable domains, cross-domain visibility and assessment eligibility limitations remain documented in `../Backend-Grad/docs/DOMAIN_ACCESS_AUDIT.md`.

## Modules and contract maintenance

- `src/lib/generated/apiCatalog.json`: generated request definitions and reviewed module/role assignments.
- `scripts/generate-api-catalog.py`: resolves backend request schemas, assigns module actions and generates `API_INTEGRATION_COVERAGE.md`.
- `src/lib/platformApi.ts`: authenticated transport, request validation/coercion, encoding, uploads, binary downloads and stale-session protection.
- `src/lib/platformModules.ts`: navigation modules and role filtering.
- `src/app/components/platform/`: shared forms, record views, module workspace, registration, timed assessments and live conversations.
- Existing dashboards, industry portal and compatible legacy screens remain accessible.

The coverage report accounts for **327 HTTP operations plus one WebSocket route**. This includes 45 foundation aliases, four older authentication compatibility interfaces, and three diagnostic endpoints. These are not 327 separate pages. The active identity screens use versioned authentication; diagnostics do not need standalone user pages.

Three additive backend endpoints support the frontend workflows: resume listing, the administrative review queue and protected verification-document downloads. Administrators can now list other publishers' drafts, and the legacy role-change action revokes affected sessions and prevents self-demotion.

After changing backend routes, export the contract from Backend-Grad with `python scripts/export_contract.py`, then regenerate the frontend with `npm.cmd run api:generate` from Frontend-Grad.

## Run and validate

Start the backend as described in its implementation guide. Set `VITE_API_URL=http://127.0.0.1:8000` in the frontend `.env`, then run:

```powershell
cd D:\SIH\Frontend-Grad
npm.cmd install
npm.cmd run dev
```

Use the URL printed by Vite. Its origin must be allowed in the backend CORS settings.

```powershell
npm.cmd test
npm.cmd run build
cd ..\Backend-Grad
.\.venv\Scripts\python.exe -m pytest -q
```

The frontend tests check route accounting, role visibility, rendering of all module actions, request serialization, uploads/downloads and session races. They generate 75 representative form payloads which the backend tests validate against the actual FastAPI models. Backend tests also cover the review queue, document ownership/path boundaries, draft visibility and role-change revocation.

Interactive browser validation was unavailable in this session. Automated contract and rendering checks do not establish that every user interaction or every endpoint has been exercised in a browser.

Validation completed: **16 frontend tests passed, 20 backend tests passed, 75 generated payloads matched the backend models, and the production build passed.** The backend emits one existing Starlette/AnyIO deprecation warning.

## Backend-dependent limits

- Paid subscription activation remains disabled until verified payment-provider integration is configured. The page shows this instead of offering an ineffective activation form.
- Two-factor enrollment and Google sign-in are not implemented by the backend. They are not presented as working controls.
- Mail delivery requires the configured outbox worker. No external emails were sent during this work.
- Resume extraction needs text-based PDFs; scanned PDFs require OCR support that the backend does not provide.
- Career tools use the backend's local matching/rule/template implementation, not an external generative model.
- Institution reports require an assigned institution. Profile privacy, discoverability, ownership and membership can legitimately restrict results/actions despite a visible module.
