# Frontend API integration coverage

Generated from the checked-in backend OpenAPI contract. This inventory records routing and form coverage, not a claim that every operation has been exercised against a live server.

Shared module pages provide validated forms and record views. Assessments, identity and live messaging have dedicated workflows. Legacy foundation aliases use their versioned equivalent in the new workspace. The four older authentication endpoints are retained as compatibility interfaces; the active registration and login screens use versioned authentication. Diagnostics are service endpoints, not standalone user pages.

| Operation | Page/module | Integration |
| --- | --- | --- |
| `GET /` | system | diagnostic |
| `GET /api/admin/alumni-earnings` | administration | module |
| `GET /api/admin/alumni-earnings/{alumni_id}` | administration | module |
| `POST /api/admin/alumni-payouts` | administration | module |
| `PATCH /api/admin/alumni-payouts/{payout_id}/mark-paid` | administration | module |
| `POST /api/admin/alumni/{alumni_id}/verify` | administration | module |
| `POST /api/admin/events/{event_id}/publish` | administration | module |
| `PATCH /api/admin/student-documents/{document_id}/verify` | administration | module |
| `GET /api/admin/users` | administration | module |
| `PATCH /api/admin/users/{user_id}/role` | administration | module |
| `POST /api/ai-chat/` | assistant | module |
| `GET /api/ai-chat/history` | assistant | module |
| `DELETE /api/ai-chat/history` | assistant | module |
| `GET /api/alumni/` | directory | module |
| `POST /api/alumni/` | directory | module |
| `GET /api/alumni/{alumni_id}` | directory | module |
| `POST /api/auth/signin` | account | compatibility |
| `POST /api/auth/signup` | account | compatibility |
| `POST /api/auth/signup/alumni` | account | compatibility |
| `POST /api/auth/signup/student` | account | compatibility |
| `GET /api/communities/` | community | alias → `GET /api/v1/communities` |
| `POST /api/communities/` | community | alias → `POST /api/v1/communities` |
| `GET /api/communities/{community_id}` | community | alias → `GET /api/v1/communities/{community_id}` |
| `POST /api/communities/{community_id}/join` | community | alias → `POST /api/v1/communities/{community_id}/join` |
| `DELETE /api/communities/{community_id}/membership` | community | alias → `DELETE /api/v1/communities/{community_id}/membership` |
| `POST /api/communities/{community_id}/posts` | community | alias → `POST /api/v1/communities/{community_id}/posts` |
| `GET /api/communities/{community_id}/posts` | community | alias → `GET /api/v1/communities/{community_id}/posts` |
| `POST /api/community-posts/{post_id}/like` | community | alias → `POST /api/v1/community-posts/{post_id}/like` |
| `DELETE /api/community-posts/{post_id}/like` | community | alias → `DELETE /api/v1/community-posts/{post_id}/like` |
| `POST /api/community-posts/{post_id}/replies` | community | alias → `POST /api/v1/community-posts/{post_id}/replies` |
| `GET /api/community-posts/{post_id}/replies` | community | alias → `GET /api/v1/community-posts/{post_id}/replies` |
| `GET /api/conversations/` | messages | alias → `GET /api/v1/conversations` |
| `POST /api/conversations/` | messages | alias → `POST /api/v1/conversations` |
| `GET /api/conversations/{conversation_id}` | messages | alias → `GET /api/v1/conversations/{conversation_id}` |
| `GET /api/conversations/{conversation_id}/messages` | messages | alias → `GET /api/v1/conversations/{conversation_id}/messages` |
| `POST /api/conversations/{conversation_id}/messages` | messages | alias → `POST /api/v1/conversations/{conversation_id}/messages` |
| `POST /api/conversations/{conversation_id}/read` | messages | alias → `POST /api/v1/conversations/{conversation_id}/read` |
| `GET /api/dashboard/` | overview | alias → `GET /api/v1/dashboard` |
| `GET /api/dashboard/admin` | overview | alias → `GET /api/v1/dashboard/admin` |
| `GET /api/dashboard/alumni` | overview | alias → `GET /api/v1/dashboard/alumni` |
| `GET /api/dashboard/student` | overview | alias → `GET /api/v1/dashboard/student` |
| `GET /api/domains` | domains | module |
| `POST /api/domains` | domains | module |
| `GET /api/events/` | events | alias → `GET /api/v1/events` |
| `POST /api/events/` | events | alias → `POST /api/v1/events` |
| `GET /api/events/{event_id}` | events | alias → `GET /api/v1/events/{event_id}` |
| `POST /api/events/{event_id}/rsvp` | events | alias → `POST /api/v1/events/{event_id}/rsvp` |
| `DELETE /api/events/{event_id}/rsvp` | events | alias → `DELETE /api/v1/events/{event_id}/rsvp` |
| `GET /api/health` | system | diagnostic |
| `POST /api/jobs/` | classic-jobs | module |
| `GET /api/jobs/` | classic-jobs | module |
| `GET /api/jobs/applied` | classic-jobs | module |
| `GET /api/jobs/saved` | classic-jobs | module |
| `GET /api/jobs/{job_id}` | classic-jobs | module |
| `POST /api/jobs/{job_id}/apply` | classic-jobs | module |
| `POST /api/jobs/{job_id}/save` | classic-jobs | module |
| `DELETE /api/jobs/{job_id}/save` | classic-jobs | module |
| `GET /api/me` | competency | identity |
| `POST /api/mentorship/requests` | competency | alias → `POST /api/v1/mentorship/requests` |
| `GET /api/mentorship/requests/incoming` | competency | alias → `GET /api/v1/mentorship/requests/incoming` |
| `GET /api/mentorship/requests/my` | competency | alias → `GET /api/v1/mentorship/requests/my` |
| `PATCH /api/mentorship/requests/{request_id}/accept` | competency | alias → `PATCH /api/v1/mentorship/requests/{request_id}/accept` |
| `PATCH /api/mentorship/requests/{request_id}/reject` | competency | alias → `PATCH /api/v1/mentorship/requests/{request_id}/reject` |
| `POST /api/mentorship/sessions` | competency | alias → `POST /api/v1/mentorship/sessions` |
| `GET /api/mentorship/sessions/my` | competency | alias → `GET /api/v1/mentorship/sessions/my` |
| `PATCH /api/mentorship/sessions/{session_id}/cancel` | competency | alias → `PATCH /api/v1/mentorship/sessions/{session_id}/cancel` |
| `PATCH /api/mentorship/sessions/{session_id}/complete` | competency | alias → `PATCH /api/v1/mentorship/sessions/{session_id}/complete` |
| `GET /api/notifications/` | notifications | alias → `GET /api/v1/notifications` |
| `POST /api/notifications/` | notifications | alias → `POST /api/v1/notifications` |
| `POST /api/notifications/read-all` | notifications | alias → `POST /api/v1/notifications/read-all` |
| `POST /api/notifications/{notification_id}/read` | notifications | alias → `POST /api/v1/notifications/{notification_id}/read` |
| `GET /api/settings/` | settings | alias → `GET /api/v1/settings` |
| `PATCH /api/settings/account` | settings | alias → `PATCH /api/v1/settings/account` |
| `PATCH /api/settings/language` | settings | alias → `PATCH /api/v1/settings/language` |
| `PATCH /api/settings/notifications` | settings | alias → `PATCH /api/v1/settings/notifications` |
| `PATCH /api/settings/privacy` | settings | alias → `PATCH /api/v1/settings/privacy` |
| `PATCH /api/settings/security` | settings | alias → `PATCH /api/v1/settings/security` |
| `GET /api/student/documents/` | documents | module |
| `POST /api/student/documents/` | documents | module |
| `GET /api/subscription-plans` | subscriptions | module |
| `POST /api/subscription-plans` | subscriptions | module |
| `POST /api/subscriptions/activate` | subscriptions | Unavailable: backend payment activation disabled |
| `GET /api/subscriptions/me` | subscriptions | module |
| `POST /api/subscriptions/start-trial` | subscriptions | module |
| `GET /api/v1/academicians/{academician_id}/research` | directory | module |
| `POST /api/v1/admin/alumni/{user_id}/verify` | administration | module |
| `GET /api/v1/admin/analytics` | administration | module |
| `GET /api/v1/admin/audit-logs` | administration | module |
| `POST /api/v1/admin/faculty/{user_id}/verify` | administration | module |
| `POST /api/v1/admin/industry/{user_id}/verify` | administration | module |
| `POST /api/v1/admin/opportunities/{opportunity_id}/approve` | administration | module |
| `POST /api/v1/admin/portfolio/{item_id}/verify` | administration | module |
| `GET /api/v1/admin/review-queue` | administration | module |
| `POST /api/v1/admin/taxonomy/import` | administration | module |
| `GET /api/v1/admin/users` | administration | module |
| `PATCH /api/v1/admin/users/{user_id}/institution` | administration | module |
| `POST /api/v1/admin/users/{user_id}/restore` | administration | module |
| `PATCH /api/v1/admin/users/{user_id}/role` | administration | module |
| `POST /api/v1/admin/users/{user_id}/skills/verify` | administration | module |
| `POST /api/v1/admin/users/{user_id}/suspend` | administration | module |
| `POST /api/v1/ai/career-assistant` | assistant | module |
| `POST /api/v1/ai/opportunity/extract` | assistant | module |
| `POST /api/v1/ai/profile/summarize` | assistant | module |
| `POST /api/v1/ai/resume/extract` | assistant | module |
| `POST /api/v1/ai/resume/map-skills` | assistant | module |
| `GET /api/v1/alumni` | directory | module |
| `GET /api/v1/alumni/me/profile` | directory | module |
| `PATCH /api/v1/alumni/me/profile` | directory | module |
| `GET /api/v1/alumni/{user_id}` | directory | module |
| `GET /api/v1/alumni/{user_id}/expertise` | directory | module |
| `GET /api/v1/alumni/{user_id}/skills` | directory | module |
| `GET /api/v1/applications/{application_id}` | applications | module |
| `POST /api/v1/applications/{application_id}/certificate` | certificates | module |
| `POST /api/v1/applications/{application_id}/feedback` | applications | module |
| `PATCH /api/v1/applications/{application_id}/progress` | applications | module |
| `PATCH /api/v1/applications/{application_id}/status` | applications | module |
| `POST /api/v1/assessments` | assessments | module |
| `GET /api/v1/assessments` | assessments | module |
| `GET /api/v1/assessments/{assessment_id}` | assessments | module |
| `POST /api/v1/assessments/{assessment_id}/reassess` | assessments | assessment |
| `GET /api/v1/assessments/{assessment_id}/result` | assessments | module |
| `POST /api/v1/assessments/{assessment_id}/start` | assessments | assessment |
| `POST /api/v1/assessments/{assessment_id}/submit` | assessments | assessment |
| `POST /api/v1/auth/forgot-password` | account | identity |
| `GET /api/v1/auth/me` | account | module |
| `DELETE /api/v1/auth/me` | account | module |
| `PATCH /api/v1/auth/me` | account | module |
| `POST /api/v1/auth/refresh` | account | identity |
| `POST /api/v1/auth/resend-otp` | account | identity |
| `POST /api/v1/auth/reset-password` | account | identity |
| `POST /api/v1/auth/signin` | account | identity |
| `POST /api/v1/auth/signout` | account | identity |
| `POST /api/v1/auth/signup` | account | identity |
| `POST /api/v1/auth/verify-otp` | account | identity |
| `GET /api/v1/certificates/me` | certificates | module |
| `GET /api/v1/certificates/verify/{code}` | certificates | module |
| `GET /api/v1/certificates/{certificate_id}/download` | certificates | module |
| `POST /api/v1/certificates/{certificate_id}/revoke` | certificates | module |
| `GET /api/v1/collaborations` | collaborations | module |
| `POST /api/v1/collaborations` | collaborations | module |
| `GET /api/v1/collaborations/{collaboration_id}` | collaborations | module |
| `PATCH /api/v1/collaborations/{collaboration_id}` | collaborations | module |
| `POST /api/v1/collaborations/{collaboration_id}/feedback` | collaborations | module |
| `POST /api/v1/collaborations/{collaboration_id}/invite` | collaborations | module |
| `POST /api/v1/collaborations/{collaboration_id}/join` | collaborations | module |
| `POST /api/v1/collaborations/{collaboration_id}/members` | collaborations | module |
| `GET /api/v1/collaborations/{collaboration_id}/members` | collaborations | module |
| `DELETE /api/v1/collaborations/{collaboration_id}/members/{user_id}` | collaborations | module |
| `GET /api/v1/collaborations/{collaboration_id}/milestones` | collaborations | module |
| `POST /api/v1/collaborations/{collaboration_id}/milestones` | collaborations | module |
| `GET /api/v1/collaborations/{collaboration_id}/progress` | collaborations | module |
| `GET /api/v1/collaborations/{collaboration_id}/skills` | collaborations | module |
| `GET /api/v1/communities` | community | module |
| `POST /api/v1/communities` | community | module |
| `GET /api/v1/communities/{community_id}` | community | module |
| `POST /api/v1/communities/{community_id}/join` | community | module |
| `DELETE /api/v1/communities/{community_id}/membership` | community | module |
| `POST /api/v1/communities/{community_id}/posts` | community | module |
| `GET /api/v1/communities/{community_id}/posts` | community | module |
| `POST /api/v1/community-posts/{post_id}/like` | community | module |
| `DELETE /api/v1/community-posts/{post_id}/like` | community | module |
| `POST /api/v1/community-posts/{post_id}/replies` | community | module |
| `GET /api/v1/community-posts/{post_id}/replies` | community | module |
| `GET /api/v1/competencies` | domains | module |
| `POST /api/v1/competencies` | domains | module |
| `GET /api/v1/competencies/{competency_id}` | domains | module |
| `GET /api/v1/conversations` | messages | module |
| `POST /api/v1/conversations` | messages | module |
| `GET /api/v1/conversations/{conversation_id}` | messages | module |
| `GET /api/v1/conversations/{conversation_id}/messages` | messages | module |
| `POST /api/v1/conversations/{conversation_id}/messages` | messages | module |
| `POST /api/v1/conversations/{conversation_id}/read` | messages | module |
| `GET /api/v1/dashboard` | overview | module |
| `GET /api/v1/dashboard/admin` | overview | module |
| `GET /api/v1/dashboard/alumni` | overview | module |
| `GET /api/v1/dashboard/student` | overview | module |
| `GET /api/v1/disciplines` | domains | module |
| `POST /api/v1/disciplines` | domains | module |
| `GET /api/v1/disciplines/{discipline_id}` | domains | module |
| `GET /api/v1/documents/resume` | documents | module |
| `POST /api/v1/documents/resume` | documents | module |
| `GET /api/v1/documents/resume/{document_id}` | documents | module |
| `DELETE /api/v1/documents/resume/{document_id}` | documents | module |
| `GET /api/v1/documents/verification/{document_id}` | documents | module |
| `GET /api/v1/domains` | domains | module |
| `POST /api/v1/domains` | domains | module |
| `GET /api/v1/domains/{domain_id}` | domains | module |
| `PATCH /api/v1/domains/{domain_id}` | domains | module |
| `GET /api/v1/domains/{domain_id}/competency-map` | domains | module |
| `GET /api/v1/domains/{domain_id}/disciplines` | domains | module |
| `PUT /api/v1/domains/{domain_id}/weights` | domains | module |
| `GET /api/v1/events` | events | module |
| `POST /api/v1/events` | events | module |
| `GET /api/v1/events/{event_id}` | events | module |
| `POST /api/v1/events/{event_id}/rsvp` | events | module |
| `DELETE /api/v1/events/{event_id}/rsvp` | events | module |
| `GET /api/v1/faculty` | directory | module |
| `GET /api/v1/faculty/consultancy` | projects | module |
| `POST /api/v1/faculty/consultancy` | projects | module |
| `GET /api/v1/faculty/consultancy/{item_id}` | projects | module |
| `PATCH /api/v1/faculty/consultancy/{item_id}` | projects | module |
| `DELETE /api/v1/faculty/consultancy/{item_id}` | projects | module |
| `POST /api/v1/faculty/consultancy/{item_id}/apply` | projects | module |
| `GET /api/v1/faculty/fdp` | projects | module |
| `POST /api/v1/faculty/fdp` | projects | module |
| `GET /api/v1/faculty/fdp/{item_id}` | projects | module |
| `PATCH /api/v1/faculty/fdp/{item_id}` | projects | module |
| `DELETE /api/v1/faculty/fdp/{item_id}` | projects | module |
| `POST /api/v1/faculty/fdp/{item_id}/apply` | projects | module |
| `GET /api/v1/faculty/me/profile` | directory | module |
| `PATCH /api/v1/faculty/me/profile` | directory | module |
| `GET /api/v1/faculty/{user_id}` | directory | module |
| `GET /api/v1/faculty/{user_id}/expertise` | directory | module |
| `GET /api/v1/industry` | directory | module |
| `GET /api/v1/industry/me/candidate-matches` | recruitment | module |
| `GET /api/v1/industry/me/faculty-matches` | recruitment | module |
| `GET /api/v1/industry/me/opportunities` | recruitment | module |
| `GET /api/v1/industry/me/profile` | directory | module |
| `PATCH /api/v1/industry/me/profile` | directory | module |
| `POST /api/v1/industry/profile` | directory | module |
| `GET /api/v1/industry/{user_id}` | directory | module |
| `GET /api/v1/industry/{user_id}/expertise` | directory | module |
| `GET /api/v1/institutions` | institutions | module |
| `POST /api/v1/institutions` | institutions | module |
| `GET /api/v1/institutions/me/analytics` | institutions | module |
| `GET /api/v1/institutions/me/departments` | institutions | module |
| `GET /api/v1/institutions/me/industry-collaboration` | institutions | module |
| `GET /api/v1/institutions/me/placement` | institutions | module |
| `GET /api/v1/institutions/me/profile` | institutions | module |
| `PATCH /api/v1/institutions/me/profile` | institutions | module |
| `GET /api/v1/institutions/me/readiness` | institutions | module |
| `GET /api/v1/institutions/me/reports` | institutions | module |
| `GET /api/v1/institutions/me/skill-demand` | institutions | module |
| `GET /api/v1/institutions/me/skill-gaps` | institutions | module |
| `GET /api/v1/institutions/me/students` | institutions | module |
| `GET /api/v1/institutions/me/training-programs` | training | module |
| `POST /api/v1/institutions/me/training-programs` | training | module |
| `PATCH /api/v1/institutions/me/training-programs/{program_id}` | training | module |
| `POST /api/v1/institutions/me/training-programs/{program_id}/enrollments/{enrollment_id}/complete` | training | module |
| `GET /api/v1/institutions/me/training-programs/{program_id}/report` | training | module |
| `GET /api/v1/institutions/{institution_id}` | institutions | module |
| `GET /api/v1/learning/resources` | learning | module |
| `POST /api/v1/learning/resources` | learning | module |
| `GET /api/v1/learning/resources/{resource_id}` | learning | module |
| `POST /api/v1/learning/{resource_id}/complete` | learning | module |
| `POST /api/v1/learning/{resource_id}/start` | learning | module |
| `POST /api/v1/matching/candidates/{student_id}/score` | matching | module |
| `POST /api/v1/matching/opportunities/{opportunity_id}/score` | matching | module |
| `GET /api/v1/matching/{match_id}/explanation` | matching | module |
| `GET /api/v1/matching/{match_id}/skill-gaps` | matching | module |
| `GET /api/v1/mentors` | competency | module |
| `GET /api/v1/mentors/recommended` | competency | module |
| `GET /api/v1/mentorship/requests` | competency | module |
| `POST /api/v1/mentorship/requests` | competency | module |
| `GET /api/v1/mentorship/requests/incoming` | competency | module |
| `GET /api/v1/mentorship/requests/my` | competency | module |
| `PATCH /api/v1/mentorship/requests/{request_id}` | competency | module |
| `PATCH /api/v1/mentorship/requests/{request_id}/accept` | competency | module |
| `PATCH /api/v1/mentorship/requests/{request_id}/reject` | competency | module |
| `GET /api/v1/mentorship/sessions` | competency | module |
| `POST /api/v1/mentorship/sessions` | competency | module |
| `GET /api/v1/mentorship/sessions/my` | competency | module |
| `PATCH /api/v1/mentorship/sessions/{session_id}/cancel` | competency | module |
| `PATCH /api/v1/mentorship/sessions/{session_id}/complete` | competency | module |
| `POST /api/v1/mentorship/sessions/{session_id}/feedback` | competency | module |
| `POST /api/v1/milestones/{milestone_id}/review` | collaborations | module |
| `POST /api/v1/milestones/{milestone_id}/submit` | collaborations | module |
| `GET /api/v1/notifications` | notifications | module |
| `POST /api/v1/notifications` | notifications | module |
| `POST /api/v1/notifications/read-all` | notifications | module |
| `POST /api/v1/notifications/{notification_id}/read` | notifications | module |
| `GET /api/v1/opportunities` | opportunities | module |
| `POST /api/v1/opportunities` | opportunities | module |
| `GET /api/v1/opportunities/{opportunity_id}` | opportunities | module |
| `PATCH /api/v1/opportunities/{opportunity_id}` | opportunities | module |
| `DELETE /api/v1/opportunities/{opportunity_id}` | opportunities | module |
| `GET /api/v1/opportunities/{opportunity_id}/applications` | opportunities | module |
| `POST /api/v1/opportunities/{opportunity_id}/apply` | opportunities | module |
| `POST /api/v1/opportunities/{opportunity_id}/publish` | opportunities | module |
| `GET /api/v1/opportunities/{opportunity_id}/requirements` | opportunities | module |
| `POST /api/v1/opportunities/{opportunity_id}/requirements` | opportunities | module |
| `PATCH /api/v1/opportunities/{opportunity_id}/requirements/{requirement_id}` | opportunities | module |
| `GET /api/v1/practical-assessments` | practical | module |
| `POST /api/v1/practical-assessments` | practical | module |
| `DELETE /api/v1/practical-assessments/{practical_id}` | practical | module |
| `POST /api/v1/practical-assessments/{practical_id}/submit` | practical | module |
| `GET /api/v1/practical-submissions` | practical | module |
| `POST /api/v1/practical-submissions/{submission_id}/review` | practical | module |
| `GET /api/v1/projects` | projects | module |
| `POST /api/v1/projects` | projects | module |
| `GET /api/v1/projects/{item_id}` | projects | module |
| `PATCH /api/v1/projects/{item_id}` | projects | module |
| `DELETE /api/v1/projects/{item_id}` | projects | module |
| `POST /api/v1/projects/{item_id}/apply` | projects | module |
| `GET /api/v1/projects/{project_id}/members` | projects | module |
| `POST /api/v1/projects/{project_id}/members` | projects | module |
| `POST /api/v1/projects/{project_id}/mentor` | projects | module |
| `GET /api/v1/recommendations/internships` | matching | module |
| `GET /api/v1/recommendations/jobs` | matching | module |
| `GET /api/v1/recommendations/mentors` | mentorship | module |
| `GET /api/v1/recommendations/opportunities` | matching | module |
| `GET /api/v1/recommendations/projects` | matching | module |
| `GET /api/v1/recommendations/research` | matching | module |
| `GET /api/v1/research` | projects | module |
| `POST /api/v1/research` | projects | module |
| `GET /api/v1/research/{item_id}` | projects | module |
| `PATCH /api/v1/research/{item_id}` | projects | module |
| `DELETE /api/v1/research/{item_id}` | projects | module |
| `POST /api/v1/research/{item_id}/apply` | projects | module |
| `GET /api/v1/settings` | settings | module |
| `PATCH /api/v1/settings/account` | settings | module |
| `PATCH /api/v1/settings/language` | settings | module |
| `PATCH /api/v1/settings/notifications` | settings | module |
| `PATCH /api/v1/settings/privacy` | settings | module |
| `PATCH /api/v1/settings/security` | settings | module |
| `GET /api/v1/skills` | domains | module |
| `POST /api/v1/skills` | domains | module |
| `GET /api/v1/skills/search` | domains | module |
| `GET /api/v1/skills/{skill_id}` | domains | module |
| `PATCH /api/v1/skills/{skill_id}` | domains | module |
| `GET /api/v1/skills/{skill_id}/assessment-framework` | domains | module |
| `GET /api/v1/students/me/applications` | applications | module |
| `GET /api/v1/students/me/assessment-history` | assessments | module |
| `GET /api/v1/students/me/career-paths` | matching | module |
| `GET /api/v1/students/me/competencies` | competency | module |
| `POST /api/v1/students/me/competencies/recalculate` | competency | module |
| `GET /api/v1/students/me/education` | portfolio | module |
| `POST /api/v1/students/me/education` | portfolio | module |
| `PATCH /api/v1/students/me/education/{item_id}` | portfolio | module |
| `DELETE /api/v1/students/me/education/{item_id}` | portfolio | module |
| `GET /api/v1/students/me/learning-history` | learning | module |
| `GET /api/v1/students/me/learning-recommendations` | learning | module |
| `GET /api/v1/students/me/learning-roadmap` | learning | module |
| `GET /api/v1/students/me/portfolio` | portfolio | module |
| `POST /api/v1/students/me/portfolio` | portfolio | module |
| `PATCH /api/v1/students/me/portfolio/{item_id}` | portfolio | module |
| `DELETE /api/v1/students/me/portfolio/{item_id}` | portfolio | module |
| `GET /api/v1/students/me/profile` | competency | module |
| `PATCH /api/v1/students/me/profile` | competency | module |
| `GET /api/v1/students/me/readiness` | competency | module |
| `GET /api/v1/students/me/readiness/history` | competency | module |
| `GET /api/v1/students/me/skill-gaps` | matching | module |
| `POST /api/v1/students/me/skill-gaps/recalculate` | matching | module |
| `GET /api/v1/students/me/skill-gaps/{gap_id}` | matching | module |
| `POST /api/v1/students/me/skill-gaps/{gap_id}/reassess` | matching | module |
| `GET /api/v1/students/me/skills` | competency | module |
| `PUT /api/v1/students/me/skills` | competency | module |
| `GET /api/v1/students/me/training-programs` | training | module |
| `POST /api/v1/training-programs/{program_id}/enroll` | training | module |
| `GET /health` | system | diagnostic |
| `WS /api/v1/ws/conversations/{conversation_id}` | messages | Live conversation view; REST fallback |

Total: 350 HTTP operations plus one WebSocket route.

Rebuild with `..\Backend-Grad\.venv\Scripts\python.exe scripts/generate-api-catalog.py` after exporting an updated backend contract.
