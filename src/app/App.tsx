import { useState } from "react";
import type { Page } from "./types";
import AppStyles from "./components/AppStyles";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
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

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dashboardPages: Page[] = ["student-dashboard", "alumni-dashboard", "admin-dashboard", "directory", "profile", "mentorship", "events", "jobs", "community", "ai-assistant"];
  const isDashboard = dashboardPages.includes(page);

  const role = page === "alumni-dashboard" ? "alumni" : page === "admin-dashboard" ? "admin" : "student";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <AppStyles />
      <Navbar current={page} navigate={navigate} />

      {isDashboard ? (
        <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
          <Sidebar role={role} navigate={navigate} current={page} />
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
          {page === "register" && <RegisterPage navigate={navigate} />}
        </>
      )}
    </div>
  );
}
