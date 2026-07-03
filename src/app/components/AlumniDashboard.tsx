import { Bell, Star, Heart, Video, Plus, Edit3 } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumni } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";

export default function AlumniDashboard({ navigate }: { navigate: (p: Page) => void }) {
  const pendingRequests = [
    { student: "Aryan Kapoor", dept: "CSE, 3rd Year", topic: "FAANG Interview Prep", time: "2 hours ago" },
    { student: "Meera Patel", dept: "IT, 4th Year", topic: "Resume Review + LinkedIn", time: "5 hours ago" },
    { student: "Rohit Singh", dept: "CSE, Final Year", topic: "System Design Basics", time: "1 day ago" },
  ];
  const upcomingSessions = [
    { student: "Tanmay Joshi", date: "Jun 22", time: "4 PM", topic: "PM Interview Prep", duration: "60 min" },
    { student: "Sanya Khanna", date: "Jun 25", time: "7 PM", topic: "Data Science Career Path", duration: "45 min" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Profile Overview */}
        <Card className="p-6">
          <div className="flex items-start gap-5">
            <img src={alumni[0].avatar} alt="Priya Sharma" className="w-16 h-16 rounded-xl object-cover bg-blue-100" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Priya Sharma</h2>
                  <p className="text-gray-600 text-sm">Senior Software Engineer · Google</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge color="blue">Batch 2018</Badge>
                    <Badge color="teal">CSE</Badge>
                    <Badge color="green">Available for Mentorship</Badge>
                  </div>
                </div>
                <Btn size="sm" variant="outline" onClick={() => navigate("profile")} icon={<Edit3 size={14} />}>Edit Profile</Btn>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            {[{ v: "23", l: "Students Connected" }, { v: "14", l: "Sessions Completed" }, { v: "4.9★", l: "Mentor Rating" }, { v: "3", l: "Jobs Posted" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-bold text-blue-600 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>{s.v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Mentorship Requests */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>Pending Mentorship Requests</h3>
                <Badge color="amber">{pendingRequests.length} new</Badge>
              </div>
              <div className="space-y-3">
                {pendingRequests.map(r => (
                  <div key={r.student} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Avatar name={r.student} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{r.student}</p>
                      <p className="text-xs text-gray-500">{r.dept}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Topic: <span className="font-medium">{r.topic}</span></p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Btn size="sm">Accept</Btn>
                      <Btn size="sm" variant="outline">Decline</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Post a Job */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>Post a Job / Internship</h3>
                <Btn size="sm" icon={<Plus size={14} />} onClick={() => navigate("jobs")}>New Post</Btn>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Frontend Engineer (React)", type: "Full-time", applications: 12, status: "active" },
                  { title: "Summer Internship 2025", type: "Internship", applications: 34, status: "active" },
                  { title: "ML Research Associate", type: "Full-time", applications: 8, status: "closed" },
                ].map(j => (
                  <div key={j.title} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{j.title}</p>
                      <p className="text-xs text-gray-500">{j.type} · {j.applications} applications</p>
                    </div>
                    <Badge color={j.status === "active" ? "green" : "gray"}>{j.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            {/* Upcoming Sessions */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Upcoming Sessions</h3>
              <div className="space-y-3">
                {upcomingSessions.map(s => (
                  <div key={s.student} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Video size={13} className="text-blue-600" />
                      <p className="text-xs font-semibold text-blue-800">{s.student}</p>
                    </div>
                    <p className="text-[11px] text-gray-700">{s.topic}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{s.date} · {s.time} · {s.duration}</p>
                    <div className="flex gap-2 mt-2">
                      <Btn size="sm" fullWidth icon={<Video size={13} />}>Join</Btn>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Notifications</h3>
              <div className="space-y-3">
                {[
                  { icon: <Heart size={14} />, msg: "Aryan liked your webinar resource", time: "1h", color: "text-red-500" },
                  { icon: <Star size={14} />, msg: "New 5-star review from Tanmay Joshi", time: "3h", color: "text-amber-500" },
                  { icon: <Bell size={14} />, msg: "Platform update: Video sessions now live", time: "1d", color: "text-blue-500" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn("mt-0.5", n.color)}>{n.icon}</div>
                    <div>
                      <p className="text-xs text-gray-800">{n.msg}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.time} ago</p>
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

