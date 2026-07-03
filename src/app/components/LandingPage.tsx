import { GraduationCap, Users, Briefcase, Calendar, MessageSquare, BookOpen, Star, ArrowRight, CheckCircle, Building, TrendingUp, Bot, UserPlus } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumni, events } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

export default function LandingPage({ navigate }: { navigate: (p: Page) => void }) {
  const stats = [
    { value: "12,500+", label: "Alumni Network" },
    { value: "850+", label: "Active Mentors" },
    { value: "4,200+", label: "Students Placed" },
    { value: "320+", label: "Partner Companies" },
  ];
  const features = [
    { icon: <Users size={22} />, title: "Smart Networking", desc: "Connect with alumni from top companies filtered by department, batch, skills, and industry.", color: "blue" },
    { icon: <BookOpen size={22} />, title: "1-on-1 Mentorship", desc: "Book personalized sessions with experienced alumni for career guidance and skill development.", color: "indigo" },
    { icon: <Briefcase size={22} />, title: "Exclusive Jobs & Internships", desc: "Access referral-backed opportunities posted directly by alumni in top companies.", color: "teal" },
    { icon: <Calendar size={22} />, title: "Webinars & Events", desc: "Attend live sessions, workshops, and bootcamps hosted by industry professionals.", color: "indigo" },
    { icon: <Bot size={22} />, title: "AI Career Assistant", desc: "Get AI-powered resume reviews, mock interviews, and personalized career roadmaps.", color: "blue" },
    { icon: <MessageSquare size={22} />, title: "Community Forum", desc: "Engage in peer discussions, share knowledge, and get answers to your career questions.", color: "teal" },
  ];
  const testimonials = [
    { name: "Megha Singh", role: "Placed at Wipro via Referral", quote: "Through GRAD ALUMNI CHAT, I connected with an alumna at Wipro who guided my prep and referred me internally. I got the job within 3 months!", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format" },
    { name: "Tanmay Joshi", role: "Interning at Microsoft", quote: "The mentorship sessions with Arjun bhaiya from Microsoft were transformative. He helped me crack the PM interview I had failed twice before.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format" },
    { name: "Riya Kapoor", role: "Data Scientist, Amazon", quote: "As a first-gen student, I had no network. GRAD ALUMNI CHAT gave me access to seniors at top companies who were genuinely willing to help.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    teal: "bg-teal-50 text-teal-600",
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-700 text-xs font-semibold">Smart India Hackathon 2025</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
                Connecting Students &<br />
                <span className="text-blue-600">Alumni</span> for{" "}
                <span className="relative">
                  <span className="text-indigo-600">Career Growth</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="#14B8A6" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Build professional connections, gain mentorship, explore internships, and accelerate your career journey — all in one platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Btn size="lg" onClick={() => navigate("register")} icon={<ArrowRight size={18} />}>
                  Get Started Free
                </Btn>
                <Btn size="lg" variant="outline" onClick={() => navigate("register")} icon={<UserPlus size={18} />}>
                  Join as Alumni
                </Btn>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  {alumni.slice(0, 4).map(a => (
                    <img key={a.id} src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-900">850+</span> alumni available for mentorship</p>
              </div>
            </div>
            {/* Hero illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop&auto=format"
                  alt="Students networking with alumni" className="rounded-2xl shadow-2xl w-full object-cover bg-blue-100" style={{ maxHeight: 460 }} />
                {/* Floating cards */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 border border-gray-100 w-52">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0"><CheckCircle size={18} /></div>
                  <div><p className="text-xs font-semibold text-gray-900">Session Booked!</p><p className="text-[11px] text-gray-500">Priya Sharma · Google</p></div>
                </div>
                <div className="absolute -right-6 bottom-1/4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 border border-gray-100 w-52">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0"><Briefcase size={18} /></div>
                  <div><p className="text-xs font-semibold text-gray-900">New Referral</p><p className="text-[11px] text-gray-500">SDE Intern · Microsoft</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</p>
                <p className="text-sm text-gray-600 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge color="blue">Platform Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Everything you need to grow professionally
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">One platform connecting students to alumni mentorship, referrals, events, and career resources.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <Card key={f.title} hover className="p-6 group cursor-default">
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", colorMap[f.color])}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge color="indigo">How It Works</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mt-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              From registration to placement in 3 steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />
            {[
              { step: "01", title: "Create Your Profile", desc: "Register as a student or alumni. Add your education, skills, and career goals.", icon: <UserPlus size={24} /> },
              { step: "02", title: "Connect & Explore", desc: "Browse the alumni directory, filter by skill or company, and send connection requests.", icon: <Users size={24} /> },
              { step: "03", title: "Grow Your Career", desc: "Book mentorship sessions, apply for referrals, attend events, and land your dream job.", icon: <TrendingUp size={24} /> },
            ].map(s => (
              <div key={s.step} className="text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-blue-400 mb-2 tracking-widest">{s.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{s.title}</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Alumni */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge color="teal">Alumni Network</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mt-3" style={{ fontFamily: "Poppins, sans-serif" }}>Featured Mentors</h2>
            </div>
            <Btn variant="outline" onClick={() => navigate("directory")} icon={<ArrowRight size={16} />}>View All</Btn>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alumni.slice(0, 3).map(a => (
              <Card key={a.id} hover className="p-5">
                <div className="flex items-start gap-4">
                  <img src={a.avatar} alt={a.name} className="w-14 h-14 rounded-xl object-cover bg-blue-100 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{a.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.role}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-600 font-medium">{a.company}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {a.skills.map(s => <Badge key={s} color="blue">{s}</Badge>)}
                </div>
                <div className="mt-4 flex gap-2">
                  <Btn size="sm" fullWidth onClick={() => navigate("mentorship")}>Connect</Btn>
                  <Btn size="sm" variant="outline" onClick={() => navigate("profile")}>Profile</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <Badge color="blue">Success Stories</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mt-3" style={{ fontFamily: "Poppins, sans-serif" }}>Hear from our community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.name} className="p-6 relative">
                <div className="text-5xl text-blue-100 font-serif leading-none mb-3">"</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-blue-100" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Ready to supercharge your career?
          </h2>
          <p className="text-blue-100 text-lg mb-8">Join 12,500+ students and alumni already growing together.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Btn size="lg" variant="outline" className="!bg-white !text-blue-700 !border-white hover:!bg-blue-50" onClick={() => navigate("register")}>
              Register as Student
            </Btn>
            <Btn size="lg" className="!bg-teal-500 !text-white hover:!bg-teal-400 !border-0" onClick={() => navigate("register")}>
              Join as Alumni
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <GraduationCap size={15} className="text-white" />
                </div>
                <span className="text-white font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>GradAlumni</span>
              </div>
              <p className="text-sm leading-relaxed">Bridging the gap between students and alumni for meaningful career connections.</p>
            </div>
            {[
              { head: "Platform", links: ["Alumni Directory", "Mentorship", "Events", "Jobs & Internships", "Community"] },
              { head: "Resources", links: ["Career Blog", "Resume Templates", "Interview Guide", "Placement Stats", "Alumni Stories"] },
              { head: "Institution", links: ["About", "Privacy Policy", "Terms of Use", "Contact", "Feedback"] },
            ].map(col => (
              <div key={col.head}>
                <p className="text-white font-semibold text-sm mb-3">{col.head}</p>
                {col.links.map(l => <p key={l} className="text-sm py-1 hover:text-white cursor-pointer transition-colors">{l}</p>)}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs">© 2025 GRAD ALUMNI CHAT. All rights reserved.</p>
            <p className="text-xs">Developed for Smart India Hackathon 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
