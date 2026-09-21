import { catalog } from "./platformApi";
export const modules = [
  { id: "certificates", title: "Certificates", description: "Issue, download and verify completion certificates." },
  { id: "training", title: "Training programs", description: "Join institution training and measure validated skill outcomes." },
  { id: "practical", title: "Practical assessments", description: "Submit project evidence and receive rubric-based evaluation." },
  { id: "overview", title: "Overview", description: "Your account and activity at a glance." },
  { id: "competency", title: "Skills & readiness", description: "Manage your domain profile, skills and competency evidence." },
  { id: "portfolio", title: "Education & portfolio", description: "Keep your education and project evidence up to date." },
  { id: "assessments", title: "Assessments", description: "Validate skills, review results and reassess after learning." },
  { id: "learning", title: "Learning", description: "Find learning resources and track your progress." },
  { id: "opportunities", title: "Opportunities", description: "Explore, apply for or publish domain-specific opportunities." },
  { id: "applications", title: "Applications", description: "Track applications, progress and engagement feedback." },
  { id: "matching", title: "Matches & career paths", description: "Understand recommendations, match scores and skill gaps." },
  { id: "recruitment", title: "Recruitment", description: "Manage owned opportunities and discover suitable candidates." },
  { id: "projects", title: "Projects & research", description: "Find research, consultancy and faculty development opportunities." },
  { id: "collaborations", title: "Collaboration teams", description: "Manage invitations, team membership and shared progress." },
  { id: "mentorship", title: "Mentorship", description: "Find mentors, manage requests and schedule sessions." },
  { id: "directory", title: "People & organizations", description: "Explore alumni, faculty and industry profiles." },
  { id: "messages", title: "Messages", description: "Start a conversation and exchange messages with participants." },
  { id: "community", title: "Communities", description: "Join groups, share posts and take part in discussions." },
  { id: "events", title: "Events", description: "Discover events, reserve a place and organize gatherings." },
  { id: "documents", title: "Documents", description: "Upload resumes and verification documents securely." },
  { id: "assistant", title: "Career tools", description: "Extract skills, summarize your profile and explore career guidance." },
  { id: "notifications", title: "Notifications", description: "Read updates and manage notification delivery." },
  { id: "settings", title: "Preferences & privacy", description: "Manage your account details and privacy preferences." },
  { id: "account", title: "Account & domain", description: "Update your primary domain, renew your session or deactivate your account." },
  { id: "institutions", title: "Institutions & reports", description: "Review institution students, readiness, placements and skill demand." },
  { id: "domains", title: "Domains & skill catalogue", description: "Explore and maintain domains, disciplines and competency frameworks." },
  { id: "administration", title: "Administration", description: "Review users, approvals, verification, audit history and platform analytics." },
  { id: "subscriptions", title: "Plans & subscriptions", description: "Review available plans and trial status." },
  { id: "classic-jobs", title: "Job board", description: "Browse jobs and manage applications on the existing job board." },
];
export function tasksFor(module: string, role: string) {
  return catalog.filter(o => o.module === module && o.roles.includes(role) && ["module", "assessment"].includes(o.handler) && !(o.handler === "assessment" && o.path.endsWith("/submit")));
}
export function visibleModules(role: string) { return modules.filter(m => tasksFor(m.id, role).length > 0); }
