import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../lib/adminApi";
import {
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  BookOpen,
  Search,
  CheckCircle,
  Eye,
  Edit3,
  Trash2,
  Download,
  Shield,
  UserPlus,
  RefreshCw,
  Activity,
  XCircle,
} from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumni } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";
import StatCard from "./StatCard";
import Flag from "./Flag";

export default function AdminDashboard({
  navigate,
}: {
  navigate: (p: Page) => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "verify" | "events" | "moderation"
  >("overview");
  const [dashboard, setDashboard] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "verify", label: "Alumni Verification" },
    { id: "events", label: "Events" },
    { id: "moderation", label: "Moderation" },
  ] as const;
  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getAdminDashboard();

      setDashboard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return <div className="p-6">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="font-bold text-gray-900 text-xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Admin Dashboard
            </h2>
            <p className="text-gray-500 text-sm">
              Platform Management · GradAlumni
            </p>
          </div>
          <div className="flex gap-2">
            <Btn variant="outline" size="sm" icon={<Download size={14} />}>
              Export Report
            </Btn>
            <Btn
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={loadDashboard}
            >
              Refresh
            </Btn>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users size={18} />}
            label="Total Users"
            value={String(dashboard.total_users)}
            delta={String(dashboard.new_users_today)}
          />
          <StatCard
            icon={<GraduationCap size={18} />}
            label="Alumni"
            value={String(dashboard.total_alumni)}
            delta={String(dashboard.new_alumni)}
          />
          <StatCard
            icon={<BookOpen size={18} />}
            label="Mentorship Sessions"
            value={String(dashboard.total_sessions)}
            delta={String(dashboard.sessions_today)}
          />
          <StatCard
            icon={<Briefcase size={18} />}
            label="Job Postings"
            value={String(dashboard.total_jobs)}
            delta={String(dashboard.new_jobs)}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex gap-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors cursor-pointer border-b-2",
                activeTab === t.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-5">
            {/* User growth */}
            <Card className="p-5">
              <h3
                className="font-semibold text-gray-900 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Registration Trend (2025)
              </h3>
              <div className="space-y-2">
                {[
                  { month: "Jan", students: 340, alumni: 48 },
                  { month: "Feb", students: 420, alumni: 62 },
                  { month: "Mar", students: 380, alumni: 55 },
                  { month: "Apr", students: 510, alumni: 71 },
                  { month: "May", students: 620, alumni: 89 },
                  { month: "Jun", students: 234, alumni: 38 },
                ].map((d) => (
                  <div
                    key={d.month}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className="w-8 text-gray-500">{d.month}</span>
                    <div className="flex-1 flex gap-1">
                      <div
                        className="h-5 bg-blue-400 rounded flex items-center px-1.5 text-white font-medium"
                        style={{ width: `${(d.students / 620) * 60}%` }}
                      >
                        {d.students}
                      </div>
                      <div
                        className="h-5 bg-teal-400 rounded flex items-center px-1.5 text-white font-medium"
                        style={{ width: `${(d.alumni / 89) * 20}%` }}
                      >
                        {d.alumni}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-blue-400" />
                    <span className="text-xs text-gray-500">Students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-teal-400" />
                    <span className="text-xs text-gray-500">Alumni</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent activity */}
            <Card className="p-5">
              <h3
                className="font-semibold text-gray-900 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Recent Platform Activity
              </h3>
              <div className="space-y-3">
                {[
                  {
                    icon: <UserPlus size={14} />,
                    text: "15 new student registrations today",
                    color: "text-blue-600 bg-blue-50",
                    time: "10 min ago",
                  },
                  {
                    icon: <CheckCircle size={14} />,
                    text: "8 alumni profiles verified",
                    color: "text-emerald-600 bg-emerald-50",
                    time: "1 hr ago",
                  },
                  {
                    icon: <Flag size={14} />,
                    text: "2 community posts flagged for review",
                    color: "text-amber-600 bg-amber-50",
                    time: "2 hrs ago",
                  },
                  {
                    icon: <Calendar size={14} />,
                    text: "New webinar created: VLSI Career Paths",
                    color: "text-indigo-600 bg-indigo-50",
                    time: "3 hrs ago",
                  },
                  {
                    icon: <Briefcase size={14} />,
                    text: "TCS posted 3 new job listings",
                    color: "text-teal-600 bg-teal-50",
                    time: "5 hrs ago",
                  },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                        a.color,
                      )}
                    >
                      {a.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800">{a.text}</p>
                      <p className="text-[11px] text-gray-400">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "users" && (
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600">
                  <option>All Roles</option>
                  <option>Student</option>
                  <option>Alumni</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    {[
                      "Name",
                      "Role",
                      "Department",
                      "Joined",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      name: "Aryan Kapoor",
                      role: "Student",
                      dept: "CSE",
                      joined: "Jun 1, 2025",
                      status: "active",
                    },
                    {
                      name: "Priya Sharma",
                      role: "Alumni",
                      dept: "CSE",
                      joined: "May 20, 2025",
                      status: "verified",
                    },
                    {
                      name: "Meera Patel",
                      role: "Student",
                      dept: "IT",
                      joined: "Jun 3, 2025",
                      status: "active",
                    },
                    {
                      name: "Karthik Rajan",
                      role: "Alumni",
                      dept: "CSE",
                      joined: "Apr 15, 2025",
                      status: "verified",
                    },
                    {
                      name: "Divya Nair",
                      role: "Alumni",
                      dept: "Design",
                      joined: "Mar 10, 2025",
                      status: "pending",
                    },
                  ].map((u) => (
                    <tr
                      key={u.name}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={u.name} size="sm" />
                          <span className="font-medium text-gray-900">
                            {u.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={u.role === "Alumni" ? "indigo" : "blue"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.dept}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {u.joined}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          color={
                            u.status === "verified"
                              ? "green"
                              : u.status === "pending"
                                ? "amber"
                                : "blue"
                          }
                        >
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Btn size="sm" variant="ghost">
                            <Eye size={14} />
                          </Btn>
                          <Btn size="sm" variant="ghost">
                            <Edit3 size={14} />
                          </Btn>
                          <Btn size="sm" variant="ghost">
                            <Trash2 size={14} />
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === "verify" && (
          <Card className="p-5">
            <h3
              className="font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Alumni Verification Queue
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "Divya Nair",
                  company: "Figma",
                  batch: "2020",
                  docs: "Offer Letter, LinkedIn",
                  submitted: "Jun 10, 2025",
                },
                {
                  name: "Rahul Sharma",
                  company: "Paytm",
                  batch: "2019",
                  docs: "Experience Letter",
                  submitted: "Jun 12, 2025",
                },
                {
                  name: "Ananya Roy",
                  company: "Zomato",
                  batch: "2021",
                  docs: "Offer Letter",
                  submitted: "Jun 14, 2025",
                },
              ].map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={v.name} size="md" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {v.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {v.company} · Batch {v.batch}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Documents: {v.docs}
                      </p>
                      <p className="text-xs text-gray-400">
                        Submitted: {v.submitted}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn size="sm" icon={<Eye size={14} />} variant="outline">
                      Review
                    </Btn>
                    <Btn
                      size="sm"
                      icon={<CheckCircle size={14} />}
                      className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                    >
                      Verify
                    </Btn>
                    <Btn
                      size="sm"
                      icon={<XCircle size={14} />}
                      variant="danger"
                    >
                      Reject
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {(activeTab === "events" || activeTab === "moderation") && (
          <Card className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              {activeTab === "events" ? (
                <Calendar size={24} className="text-blue-600" />
              ) : (
                <Shield size={24} className="text-blue-600" />
              )}
            </div>
            <h3
              className="font-semibold text-gray-900 mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {activeTab === "events"
                ? "Event Management"
                : "Content Moderation"}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {activeTab === "events"
                ? "Create, edit, and manage platform events and webinars."
                : "Review flagged posts, comments, and reported content."}
            </p>
            <Btn
              className="mt-5"
              onClick={() =>
                navigate(activeTab === "events" ? "events" : "community")
              }
            >
              Open {activeTab === "events" ? "Events" : "Community"}
            </Btn>
          </Card>
        )}
      </div>
    </div>
  );
}
