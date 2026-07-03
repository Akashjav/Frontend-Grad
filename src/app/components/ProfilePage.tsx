import { useState } from "react";
import { GraduationCap, MapPin, Award, Linkedin, Github, Globe, Mail, Zap, Layers, UserPlus } from "lucide-react";
import { cn } from "../utils";
import { alumni } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const tabs = ["about", "experience", "skills", "projects", "achievements"];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=200&fit=crop&auto=format"
          alt="Cover" className="w-full h-full object-cover opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Profile header */}
        <div className="relative -mt-12 mb-6">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <img src={alumni[0].avatar} alt="Profile"
                className="w-24 h-24 rounded-2xl border-4 border-white object-cover bg-blue-100 shadow-lg" />
              <div className="mb-2">
                <h2 className="font-bold text-gray-900 text-2xl" style={{ fontFamily: "Poppins, sans-serif" }}>Priya Sharma</h2>
                <p className="text-gray-600">Senior Software Engineer · Google · Bengaluru</p>
                <div className="flex gap-2 mt-1.5">
                  <Badge color="blue">CSE · Batch 2018</Badge>
                  <Badge color="green">Open to Mentorship</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <Btn size="sm" variant="outline" icon={<Linkedin size={14} />}>LinkedIn</Btn>
              <Btn size="sm" icon={<UserPlus size={14} />}>Connect</Btn>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[{ v: "23", l: "Connections" }, { v: "14", l: "Sessions" }, { v: "4.9", l: "Rating" }, { v: "6 yrs", l: "Experience" }].map(s => (
            <Card key={s.l} className="p-4 text-center">
              <p className="font-bold text-blue-600 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>{s.v}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex gap-4 mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={cn("pb-3 px-1 text-sm font-medium transition-colors cursor-pointer border-b-2 capitalize",
                activeTab === t ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700")}>
              {t}
            </button>
          ))}
        </div>

        <div className="pb-10">
          {activeTab === "about" && (
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <Card className="p-5 mb-5">
                  <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>About</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Senior Software Engineer at Google with 6 years of experience in full-stack development and distributed systems. Passionate about mentoring the next generation of engineers and helping students navigate their career journey. Alumni of the Class of 2018, CSE Department.
                  </p>
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Education</h3>
                  {[
                    { degree: "B.Tech – Computer Science", inst: "National Institute of Technology", year: "2014–2018", gpa: "8.9 CGPA" },
                    { degree: "Class XII – Science", inst: "Delhi Public School", year: "2014", gpa: "94.2%" },
                  ].map(e => (
                    <div key={e.degree} className="flex gap-3 mb-4 last:mb-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600"><GraduationCap size={18} /></div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{e.degree}</p>
                        <p className="text-xs text-gray-600">{e.inst}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{e.year} · {e.gpa}</p>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
              <div className="space-y-5">
                <Card className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Contact & Links</h3>
                  {[
                    { icon: <Mail size={14} />, text: "priya@gmail.com" },
                    { icon: <Globe size={14} />, text: "priyasharma.dev" },
                    { icon: <Linkedin size={14} />, text: "linkedin.com/in/priyasharma" },
                    { icon: <Github size={14} />, text: "github.com/priyasharma" },
                    { icon: <MapPin size={14} />, text: "Bengaluru, Karnataka" },
                  ].map(l => (
                    <div key={l.text} className="flex items-center gap-2 py-1.5 text-sm text-gray-600">
                      <span className="text-gray-400">{l.icon}</span>{l.text}
                    </div>
                  ))}
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Go", "Python", "Kubernetes", "System Design", "ML", "AWS"].map(s => (
                      <Badge key={s} color="blue">{s}</Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeTab === "experience" && (
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Work Experience</h3>
              <div className="space-y-5">
                {[
                  { role: "Senior Software Engineer", company: "Google", period: "Aug 2021 – Present", desc: "Lead development of core search infrastructure serving 1B+ daily users. Contributed to Project Titan and internal developer tooling.", current: true },
                  { role: "Software Engineer II", company: "Microsoft", period: "Jun 2019 – Jul 2021", desc: "Worked on Azure DevOps pipelines and CI/CD tooling. Improved build times by 40% through distributed caching.", current: false },
                  { role: "Software Engineer Intern", company: "Amazon", period: "May 2018 – Jul 2018", desc: "Built recommendation service using collaborative filtering for Amazon Fresh. Improved CTR by 12%.", current: false },
                ].map(e => (
                  <div key={e.role} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                    </div>
                    <div className="pb-4">
                      <div className="flex items-start gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{e.role}</p>
                        {e.current && <Badge color="green">Current</Badge>}
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{e.company} · {e.period}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {(activeTab === "skills" || activeTab === "projects" || activeTab === "achievements") && (
            <Card className="p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                {activeTab === "skills" ? <Zap size={24} className="text-blue-600" /> : activeTab === "projects" ? <Layers size={24} className="text-blue-600" /> : <Award size={24} className="text-blue-600" />}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                {activeTab === "skills" ? "8 Skills Listed" : activeTab === "projects" ? "5 Projects Showcased" : "12 Achievements"}
              </h3>
              <p className="text-gray-500 text-sm">This section is fully detailed in the complete profile view.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

