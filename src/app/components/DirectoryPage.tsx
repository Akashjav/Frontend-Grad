import { useState } from "react";
import { Users, Search, MapPin, Building, Award, Eye } from "lucide-react";
import type { Page } from "../types";
import { alumni } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

export default function DirectoryPage({ navigate }: { navigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [industry, setIndustry] = useState("All");
  const filtered = alumni.filter(a =>
    (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()) || a.skills.join(" ").toLowerCase().includes(search.toLowerCase())) &&
    (dept === "All" || a.dept === dept) &&
    (industry === "All" || a.industry === industry)
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Alumni Directory</h2>
            <p className="text-gray-500 text-sm">{alumni.length} alumni from your institution</p>
          </div>
        </div>

        {/* Search + Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-56">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, company, or skill..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
            {[
              { label: "Department", value: dept, set: setDept, opts: ["All", "CSE", "IT", "ECE", "ME", "Design"] },
              { label: "Industry", value: industry, set: setIndustry, opts: ["All", "Tech", "E-Commerce", "Startup", "Design", "AI"] },
            ].map(f => (
              <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
        </Card>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(a => (
            <Card key={a.id} hover className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <img src={a.avatar} alt={a.name} className="w-14 h-14 rounded-xl object-cover bg-blue-100 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{a.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{a.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Building size={11} className="text-gray-400" />
                    <span className="text-xs text-blue-600 font-medium">{a.company}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" /><span className="text-xs text-gray-600">{a.location}</span></div>
                <div className="flex items-center gap-1"><Award size={11} className="text-gray-400" /><span className="text-xs text-gray-600">{a.experience}</span></div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {a.skills.map(s => <Badge key={s} color="blue">{s}</Badge>)}
                <Badge color="gray">Batch {a.batch}</Badge>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" fullWidth onClick={() => navigate("mentorship")}>Connect</Btn>
                <Btn size="sm" variant="outline" onClick={() => navigate("profile")} icon={<Eye size={13} />}>Profile</Btn>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No alumni match your search. Try different filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

