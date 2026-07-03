import { GraduationCap, Users, Briefcase, BookOpen, Award, Bot } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumni, jobs, events } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";
import StatCard from "./StatCard";

export default function StudentDashboard({ navigate }: { navigate: (p: Page) => void }) {
  const upcomingEvents = [
    { title: "AI & Automation Webinar", date: "Jun 22", time: "3 PM", type: "Webinar" },
    { title: "Resume Workshop", date: "Jun 28", time: "11 AM", type: "Workshop" },
  ];
  const mentorRequests = [
    { mentor: "Arjun Mehta", role: "PM at Microsoft", status: "pending", date: "Sent 2 days ago" },
    { mentor: "Divya Nair", role: "UX Designer at Figma", status: "accepted", date: "Confirmed for Jun 25" },
  ];
  const messages = [
    { from: "Karthik Rajan", preview: "Hey! Looked at your resume — there are a few things...", time: "10 min ago", unread: true },
    { from: "Placement Cell", preview: "TCS Drive 2025 – Register by June 25th", time: "2 hrs ago", unread: true },
    { from: "Priya Sharma", preview: "Good luck with the interview tomorrow! You've got this.", time: "Yesterday", unread: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Good morning 👋</p>
            <h2 className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>Welcome back, Aryan!</h2>
            <p className="text-blue-100 text-sm mt-1">You have 2 pending mentorship requests and 3 upcoming events.</p>
            <Btn className="mt-4 !bg-white !text-blue-700 !border-0 hover:!bg-blue-50" size="sm" onClick={() => navigate("ai-assistant")} icon={<Bot size={15} />}>
              Ask AI Assistant
            </Btn>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap size={40} className="text-white" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} />} label="Connections" value="24" delta="5 new" />
          <StatCard icon={<BookOpen size={18} />} label="Sessions Booked" value="3" />
          <StatCard icon={<Briefcase size={18} />} label="Applications" value="8" delta="2 new" />
          <StatCard icon={<Award size={18} />} label="Profile Score" value="78%" />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Recommended Alumni */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>Recommended Alumni</h3>
                <Btn variant="ghost" size="sm" onClick={() => navigate("directory")}>See all</Btn>
              </div>
              <div className="space-y-4">
                {alumni.slice(0, 3).map(a => (
                  <div key={a.id} className="flex items-center gap-3">
                    <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover bg-blue-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{a.name}</p>
                      <p className="text-xs text-gray-500 truncate">{a.role} · {a.company}</p>
                    </div>
                    <Btn size="sm" variant="outline" onClick={() => navigate("mentorship")}>Connect</Btn>
                  </div>
                ))}
              </div>
            </Card>

            {/* Internship Opportunities */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>Internship Opportunities</h3>
                <Btn variant="ghost" size="sm" onClick={() => navigate("jobs")}>View all</Btn>
              </div>
              <div className="space-y-3">
                {jobs.filter(j => j.type === "Internship").slice(0, 2).map(j => (
                  <div key={j.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{j.title}</p>
                      <p className="text-xs text-gray-500">{j.company} · {j.location}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {j.tags.slice(0, 2).map(t => <Badge key={t} color="blue">{t}</Badge>)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-xs font-semibold text-emerald-600">{j.stipend}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Deadline: {j.deadline}</p>
                      <Btn size="sm" className="mt-2">Apply</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Career Progress */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Career Progress Tracker</h3>
              <div className="space-y-3">
                {[
                  { label: "Resume Strength", value: 78, color: "bg-blue-500" },
                  { label: "LinkedIn Completeness", value: 65, color: "bg-indigo-500" },
                  { label: "Skill Readiness", value: 82, color: "bg-teal-500" },
                  { label: "Interview Prep", value: 45, color: "bg-amber-500" },
                ].map(p => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                      <span>{p.label}</span><span className="font-medium">{p.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", p.color)} style={{ width: `${p.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Upcoming events */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Upcoming Events</h3>
                <Btn variant="ghost" size="sm" onClick={() => navigate("events")}>All</Btn>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map(e => (
                  <div key={e.title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-blue-600 font-bold">{e.date.split(" ")[0].toUpperCase()}</span>
                      <span className="text-sm font-bold text-blue-700">{e.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{e.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{e.time} · {e.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Mentorship Requests */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Mentorship Requests</h3>
              <div className="space-y-3">
                {mentorRequests.map(r => (
                  <div key={r.mentor} className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{r.mentor}</p>
                        <p className="text-[11px] text-gray-500">{r.role}</p>
                      </div>
                      <Badge color={r.status === "accepted" ? "green" : "amber"}>{r.status}</Badge>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{r.date}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Messages */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Messages</h3>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
              </div>
              <div className="space-y-3">
                {messages.map(m => (
                  <div key={m.from} className={cn("flex gap-2.5 p-2 rounded-lg cursor-pointer", m.unread ? "bg-blue-50" : "hover:bg-gray-50")}>
                    <Avatar name={m.from} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-xs font-semibold text-gray-900">{m.from}</p>
                        <p className="text-[10px] text-gray-400">{m.time}</p>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{m.preview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

