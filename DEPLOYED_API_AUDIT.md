# Deployed API integration audit

Compared on 2026-09-20 against the public schema downloaded from
https://backend-grad-gxdl.onrender.com/openapi.json.

All 350 deployed HTTP operations match the frontend catalogue. No missing or
undeployed operations were found. Paths, request definitions and component schemas
also match the backend contract used by the frontend tests.

| Integration | Operations |
| --- | ---: |
| Workspace forms and record views | 286 |
| Versioned equivalents of legacy aliases | 45 |
| Registration, authentication and account workflows | 9 |
| Dedicated assessment workflows | 3 |
| Older authentication compatibility endpoints | 4 |
| Service diagnostics | 3 |

The 29 workspace modules include certificates, practical assessments, training,
collaboration milestones, recruitment, learning, messaging and administration.
The per-operation mapping is in API_INTEGRATION_COVERAGE.md. Compatibility and
diagnostic endpoints do not need separate user pages. Alias operations use their
versioned equivalents.

Added record suggestions for certificate, program, practical assessment and
submission references. Role-specific lists are used where available. The existing
guided pages remain the entry points; no duplicate pages were needed.

The production frontend build now reads the public backend URL from
.env.production. On Vercel, set VITE_API_URL=https://backend-grad-gxdl.onrender.com
if an existing environment variable overrides it, then redeploy the frontend.
The backend must continue allowing https://frontend-grad.vercel.app in CORS_ORIGINS.

Validation: 19 tests passed, including the deployed-schema comparison, role
visibility, request serialization, uploads, downloads and form rendering.
This verifies contract and frontend wiring, not live authenticated end-to-end
execution of all operations. No production records were created or changed.

To repeat the deployed-contract check from Frontend-Grad in PowerShell:

```powershell
Invoke-WebRequest -Uri 'https://backend-grad-gxdl.onrender.com/openapi.json' -OutFile 'tests/generated/deployed-openapi.json'
node --test tests/frontend-regressions.mjs tests/platform-integration.mjs tests/deployed-contract.mjs
npm.cmd run build
```
