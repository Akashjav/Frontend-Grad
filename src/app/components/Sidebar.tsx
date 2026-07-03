import { Users, Briefcase, Calendar, MessageSquare, BookOpen, Home, Settings, LogOut, Bot } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import Avatar from "./Avatar";

export default function Sidebar({ role, navigate, current }: { role: "student" | "alumni" | "admin"; navigate: (p: Page) => void; current: Page }) {
  const studentLinks = [
    { icon: <Home size={18} />, label: "Dashboard", page: "student-dashboard" as Page },
    { icon: <Users size={18} />, label: "Alumni Directory", page: "directory" as Page },
    { icon: <BookOpen size={18} />, label: "Mentorship", page: "mentorship" as Page },
    { icon: <Calendar size={18} />, label: "Events", page: "events" as Page },
    { icon: <Briefcase size={18} />, label: "Jobs & Internships", page: "jobs" as Page },
    { icon: <MessageSquare size={18} />, label: "Community", page: "community" as Page },
    { icon: <Bot size={18} />, label: "AI Assistant", page: "ai-assistant" as Page },
  ];
  const alumniLinks = [
    { icon: <Home size={18} />, label: "Dashboard", page: "alumni-dashboard" as Page },
    { icon: <Users size={18} />, label: "My Students", page: "directory" as Page },
    { icon: <BookOpen size={18} />, label: "Mentorship", page: "mentorship" as Page },
    { icon: <Calendar size={18} />, label: "Events", page: "events" as Page },
    { icon: <Briefcase size={18} />, label: "Post Jobs", page: "jobs" as Page },
    { icon: <MessageSquare size={18} />, label: "Community", page: "community" as Page },
  ];
  const adminLinks = [
    { icon: <Home size={18} />, label: "Dashboard", page: "admin-dashboard" as Page },
    { icon: <Users size={18} />, label: "Users", page: "directory" as Page },
    { icon: <Calendar size={18} />, label: "Events", page: "events" as Page },
    { icon: <Briefcase size={18} />, label: "Jobs", page: "jobs" as Page },
    { icon: <MessageSquare size={18} />, label: "Community", page: "community" as Page },
  ];
  const links = role === "student" ? studentLinks : role === "alumni" ? alumniLinks : adminLinks;
  const name = role === "student" ? "Aryan Kapoor" : role === "alumni" ? "Priya Sharma" : "Dr. Ramesh Kumar";
  const subtitle = role === "student" ? "CSE, 3rd Year" : role === "alumni" ? "Google · Sr. Engineer" : "Admin";

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      {/* Profile */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar name={name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{name}</p>
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(l => (
          <button key={l.page} onClick={() => navigate(l.page)}
            className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              current === l.page ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}>
            {l.icon}
            {l.label}
          </button>
        ))}
      </nav>
      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <button onClick={() => navigate("profile")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
          <Settings size={18} /> Settings
        </button>
        <button onClick={() => navigate("landing")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

