import { useState } from "react";
import { GraduationCap, Bell, ChevronDown, Menu, X, Bot } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import Btn from "./Btn";
import Avatar from "./Avatar";

export default function Navbar({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState(false);

  const links: { label: string; page: Page }[] = [
    { label: "Home", page: "landing" },
    { label: "Directory", page: "directory" },
    { label: "Mentorship", page: "mentorship" },
    { label: "Events", page: "events" },
    { label: "Jobs", page: "jobs" },
    { label: "Community", page: "community" },
  ];

  const isLoggedIn = !["landing", "login", "register"].includes(current);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate("landing")} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block" style={{ fontFamily: "Poppins, sans-serif" }}>
              Grad<span className="text-blue-600">Alumni</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <button
                key={l.page}
                onClick={() => navigate(l.page)}
                className={cn("px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer",
                  current === l.page ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <button onClick={() => setNotify(!notify)} className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button onClick={() => navigate("ai-assistant")} className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Bot size={18} />
                </button>
                <div className="flex items-center gap-2 pl-2 cursor-pointer" onClick={() => navigate("profile")}>
                  <Avatar name="Aryan Kapoor" size="sm" />
                  <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
                </div>
              </>
            ) : (
              <>
                <Btn variant="ghost" size="sm" onClick={() => navigate("login")}>Login</Btn>
                <Btn variant="primary" size="sm" onClick={() => navigate("register")}>Get Started</Btn>
              </>
            )}
            {/* Mobile menu */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="lg:hidden py-3 border-t border-gray-100 space-y-1">
            {links.map(l => (
              <button key={l.page} onClick={() => { navigate(l.page); setOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <Btn variant="outline" size="sm" onClick={() => { navigate("login"); setOpen(false); }}>Login</Btn>
              <Btn variant="primary" size="sm" onClick={() => { navigate("register"); setOpen(false); }}>Register</Btn>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

