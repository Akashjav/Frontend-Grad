import { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  GraduationCap,
  Users,
} from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { getStudentDashboard } from "../../lib/dashboardApi";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";
import StatCard from "./StatCard";

function asArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function formatDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
}

export default function StudentDashboard({ navigate }: { navigate: (p: Page) => void }) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await getStudentDashboard();
        if (mounted) setDashboard(data);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto text-red-600">{error}</div>
      </div>
    );
  }

  const jobs = dashboard?.jobs ?? {};
  const requests = asArray(dashboard?.recent_mentorship_requests ?? dashboard?.mentorship_requests);
  const notifications = asArray(dashboard?.notifications);
  const sessions = asArray(dashboard?.upcoming_sessions);
  const events = asArray(dashboard?.upcoming_events ?? dashboard?.events);
  const alumni = asArray(dashboard?.recommended_alumni ?? dashboard?.alumni);
  const opportunities = asArray(dashboard?.recommended_jobs ?? dashboard?.jobs?.recommended ?? dashboard?.jobs?.items);
  const profileScore = dashboard?.profile_score ?? dashboard?.profile?.score ?? 0;
  const studentName = dashboard?.student?.name ?? dashboard?.user?.name ?? "Student";
  const subscriptionStatus = dashboard?.subscription?.status ?? "Unknown";

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Welcome back</p>
            <h2 className="text-xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
              {studentName}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              You have {requests.length} mentorship requests and {notifications.length} recent notifications.
            </p>
            <Btn
              className="mt-4 !bg-white !text-blue-700 !border-0 hover:!bg-blue-50"
              size="sm"
              onClick={() => navigate("ai-assistant")}
              icon={<Bot size={15} />}
            >
              Ask AI Assistant
            </Btn>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap size={40} className="text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} />} label="Mentorship Requests" value={String(requests.length)} />
          <StatCard icon={<BookOpen size={18} />} label="Sessions Booked" value={String(sessions.length)} />
          <StatCard icon={<Briefcase size={18} />} label="Applications" value={String(jobs.applied_count ?? 0)} />
          <StatCard icon={<Award size={18} />} label="Saved Jobs" value={String(jobs.saved_count ?? 0)} />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Recommended Alumni
                </h3>
                <Btn variant="ghost" size="sm" onClick={() => navigate("directory")}>
                  See all
                </Btn>
              </div>
              <div className="space-y-4">
                {alumni.length > 0 ? (
                  alumni.slice(0, 3).map((person: any) => (
                    <div key={person.id ?? person.email ?? person.name} className="flex items-center gap-3">
                      {person.avatar ? (
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover bg-blue-100 flex-shrink-0"
                        />
                      ) : (
                        <Avatar name={person.name ?? "Alumni"} size="sm" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{person.name ?? "Alumni"}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {person.role ?? person.title ?? "Mentor"} {person.company ? `- ${person.company}` : ""}
                        </p>
                      </div>
                      <Btn size="sm" variant="outline" onClick={() => navigate("mentorship")}>
                        Connect
                      </Btn>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No alumni recommendations yet.</p>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Job Opportunities
                </h3>
                <Btn variant="ghost" size="sm" onClick={() => navigate("jobs")}>
                  View all
                </Btn>
              </div>
              <div className="space-y-3">
                {opportunities.length > 0 ? (
                  opportunities.slice(0, 2).map((job: any) => (
                    <div key={job.id ?? job.title} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{job.title ?? job.job_title ?? "Untitled role"}</p>
                        <p className="text-xs text-gray-500">
                          {job.company ?? job.company_name ?? "Company"} {job.location ? `- ${job.location}` : ""}
                        </p>
                        <div className="flex gap-1.5 mt-1.5">
                          {asArray(job.tags).slice(0, 2).map((tag) => (
                            <Badge key={tag} color="blue">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-xs font-semibold text-emerald-600">{job.stipend ?? job.salary ?? ""}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Deadline: {job.deadline ?? "Rolling"}</p>
                        <Btn size="sm" className="mt-2" onClick={() => navigate("jobs")}>
                          Apply
                        </Btn>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No job recommendations yet.</p>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Career Progress Tracker
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subscription</span>
                  <Badge color="blue">{subscriptionStatus}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Profile Score</span>
                  <Badge color="green">{profileScore}%</Badge>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Upcoming Events
                </h3>
                <Btn variant="ghost" size="sm" onClick={() => navigate("events")}>
                  All
                </Btn>
              </div>
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map((event: any) => (
                    <div key={event.id ?? event.title} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Calendar size={16} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{event.title ?? "Event"}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {formatDate(event.date ?? event.start_time)} {event.type ? `- ${event.type}` : ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No upcoming events.</p>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Mentorship Requests
              </h3>
              <div className="space-y-3">
                {requests.length > 0 ? (
                  requests.map((request: any) => (
                    <div key={request.id ?? request.topic} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{request.topic ?? "Mentorship request"}</p>
                          <p className="text-[11px] text-gray-500">
                            {request.mentor_name ?? request.alumni_name ?? `Alumni ID: ${request.alumni_id ?? "N/A"}`}
                          </p>
                        </div>
                        <Badge color={request.status === "accepted" ? "green" : "amber"}>
                          {request.status ?? "pending"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDate(request.created_at)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No mentorship requests yet.</p>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Notifications
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((note: any) => (
                    <div
                      key={note.id ?? note.title}
                      className={cn("flex gap-2.5 p-2 rounded-lg", note.unread ? "bg-blue-50" : "hover:bg-gray-50")}
                    >
                      <div className="mt-0.5">
                        <Bell size={14} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-xs font-semibold text-gray-900">{note.title ?? "Notification"}</p>
                          <p className="text-[10px] text-gray-400">{formatDate(note.created_at)}</p>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{note.body ?? note.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No notifications yet.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
