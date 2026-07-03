import { useState } from "react";
import { Briefcase, Search, MapPin, Clock, Plus, Bookmark, RefreshCw, ExternalLink, DollarSign } from "lucide-react";
import { cn } from "../utils";
import { alumni, jobs } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

export default function JobsPage() {
  const [tab, setTab] = useState<"all" | "internships" | "fulltime" | "saved">("all");
  const [applied, setApplied] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);

  const filtered = jobs.filter(j =>
    tab === "all" ? true : tab === "internships" ? j.type === "Internship" : tab === "fulltime" ? j.type === "Full-time" : saved.includes(j.id)
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Jobs & Internships</h2>
            <p className="text-gray-500 text-sm">Referral-backed opportunities from alumni in top companies</p>
          </div>
          <Btn size="sm" icon={<Plus size={14} />}>Post a Job</Btn>
        </div>

        {/* Search */}
        <Card className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search jobs, companies, skills..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          {[
            { label: "Location", opts: ["All Locations", "Bengaluru", "Hyderabad", "Remote", "Mumbai", "Pune"] },
            { label: "Company", opts: ["All Companies", "Google", "Microsoft", "Amazon", "Infosys", "TCS"] },
          ].map(f => (
            <select key={f.label} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none">
              {f.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {(["all", "internships", "fulltime", "saved"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors cursor-pointer",
                tab === t ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700")}>
              {t === "fulltime" ? "Full-time" : t === "saved" ? `Saved (${saved.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          {filtered.map(j => (
            <Card key={j.id} hover className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-lg">
                  {j.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>{j.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{j.company}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge color={j.type === "Internship" ? "teal" : "blue"}>{j.type}</Badge>
                      <button onClick={() => setSaved(s => s.includes(j.id) ? s.filter(id => id !== j.id) : [...s, j.id])}
                        className={cn("cursor-pointer transition-colors", saved.includes(j.id) ? "text-amber-500" : "text-gray-300 hover:text-amber-400")}>
                        <Bookmark size={18} fill={saved.includes(j.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} />{j.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} />{j.stipend || j.salary}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />Deadline: {j.deadline}</span>
                    <span className="flex items-center gap-1"><RefreshCw size={12} />{j.posted}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {j.tags.map(t => <Badge key={t} color="gray">{t}</Badge>)}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Btn size="sm" onClick={() => setApplied(a => a.includes(j.id) ? a : [...a, j.id])} disabled={applied.includes(j.id)}>
                    {applied.includes(j.id) ? "✓ Applied" : "Apply Now"}
                  </Btn>
                  <Btn size="sm" variant="outline" icon={<ExternalLink size={12} />}>Details</Btn>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No {tab === "saved" ? "saved" : ""} jobs found.</p>
            </div>
          )}
        </div>

        {/* Application Tracker */}
        {applied.length > 0 && (
          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Application Tracker</h3>
            <div className="space-y-3">
              {jobs.filter(j => applied.includes(j.id)).map(j => (
                <div key={j.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{j.title}</p>
                    <p className="text-xs text-gray-500">{j.company}</p>
                  </div>
                  <Badge color="amber">Under Review</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

