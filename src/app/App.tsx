import { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getToken } from "../lib/api";
import Btn from "./components/Btn";
import type { Page } from "./types";
import AppStyles from "./components/AppStyles";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";
import AlumniDashboard from "./components/AlumniDashboard";
import AdminDashboard from "./components/AdminDashboard";
import DirectoryPage from "./components/DirectoryPage";
import ProfilePage from "./components/ProfilePage";
import MentorshipPage from "./components/MentorshipPage";
import EventsPage from "./components/EventsPage";
import JobsPage from "./components/JobsPage";
import CommunityPage from "./components/CommunityPage";
import AIAssistantPage from "./components/AIAssistantPage";
import IndustryPortal from "./components/industry/IndustryPortal";
import PlatformRegistration from "./components/platform/PlatformRegistration";
import { allowedPage, dashboardPageForRole } from "../lib/roleRedirect";
const PlatformWorkspace = lazy(() => import("./components/platform/PlatformWorkspace"));

export default function App() {
  const { user, loading, error, refreshUser, signOut } = useAuth();
  const [requestedPage, setPage] = useState<Page>("landing");
  const dashboard = dashboardPageForRole(user?.role ?? "student");

  useEffect(() => {
    if (user) setPage(window.location.hash.startsWith("#workspace") ? "workspace" : dashboard);
    else setPage("landing");
  }, [user?.id, user?.email, user?.role]);

  const navigate = (p: Page) => {
    if (p === "mentorship" && getToken()) {
      window.location.hash = "workspace/mentorship";
      setPage("workspace");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (p === "mentorship" && getToken()) {
      window.location.hash = "workspace/mentorship";
      setPage("workspace");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (p === "workspace") window.location.hash = "workspace/overview";
    else if (window.location.hash.startsWith("#workspace")) window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setPage(!["landing", "login", "register", "industry-register"].includes(p) && !getToken() ? "login" : p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dashboardPages: Page[] = ["workspace", "student-dashboard", "alumni-dashboard", "admin-dashboard", "directory", "profile", "mentorship", "events", "jobs", "community", "ai-assistant", "industry-dashboard", "industry-profile", "industry-opportunities", "industry-applications", "industry-matches"];
  const page = dashboardPages.includes(requestedPage) && !user ? "login"
    : user ? allowedPage(requestedPage, user.role) : requestedPage;
  const isDashboard = dashboardPages.includes(page) && Boolean(user);

  const role = user?.role ?? "student";

  if (loading) return <div role="status" className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">Loading your account...</div>;
  if (error && !user) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-6">
    <p role="alert" className="text-red-600">{error}</p>
    <Btn onClick={() => { void refreshUser().catch(() => {}); }}>Retry</Btn>
    <Btn variant="outline" onClick={signOut}>Back to sign in</Btn>
  </div>;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <AppStyles />
      <Navbar current={page} navigate={navigate} />

      {isDashboard ? (
        <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
          <Sidebar role={role} navigate={navigate} current={page} />
          {page === "workspace" && <Suspense fallback={<p role="status" className="p-6">Loading workspace…</p>}><PlatformWorkspace key={user?.id} /></Suspense>}
          {page.startsWith("industry-") && <IndustryPortal key={user?.id} page={page} navigate={navigate} />}
          {page === "student-dashboard" && <StudentDashboard navigate={navigate} />}
          {page === "alumni-dashboard" && <AlumniDashboard navigate={navigate} />}
          {page === "admin-dashboard" && <AdminDashboard navigate={navigate} />}
          {page === "directory" && <DirectoryPage navigate={navigate} />}
          {page === "profile" && <ProfilePage />}
          {page === "mentorship" && <MentorshipPage navigate={navigate} />}
          {page === "events" && <EventsPage />}
          {page === "jobs" && <JobsPage />}
          {page === "community" && <CommunityPage />}
          {page === "ai-assistant" && <AIAssistantPage />}
        </div>
      ) : (
        <>
          {page === "landing" && <LandingPage navigate={navigate} />}
          {page === "login" && <LoginPage navigate={navigate} />}
          {page === "register" && <PlatformRegistration navigate={navigate} />}
          {page === "industry-register" && <PlatformRegistration initialRole="industry" navigate={navigate} />}
        </>
      )}
    </div>
  );
}
