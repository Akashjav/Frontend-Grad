import { useState } from "react";
import { BookOpen, Star, CheckCircle, Video } from "lucide-react";
import type { Page } from "../types";
import { cn } from "../utils";
import { alumni } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

export default function MentorshipPage({ navigate }: { navigate: (p: Page) => void }) {
  const [view, setView] = useState<"find" | "my">("find");
  const [selected, setSelected] = useState<null | typeof alumni[0]>(null);
  const [booked, setBooked] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Mentorship</h2>
            <p className="text-gray-500 text-sm">Connect with experienced alumni for 1-on-1 guidance</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("find")} className={cn("px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors", view === "find" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100")}>Find Mentors</button>
            <button onClick={() => setView("my")} className={cn("px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors", view === "my" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100")}>My Sessions</button>
          </div>
        </div>

        {view === "find" && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                {alumni.map(a => (
                  <Card key={a.id} hover className={cn("p-5 cursor-pointer", selected?.id === a.id && "ring-2 ring-blue-500")} onClick={() => { setSelected(a); setBooked(false); }}>
                    <div className="flex items-start gap-3 mb-3">
                      <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-xl object-cover bg-blue-100 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{a.name}</p>
                        <p className="text-xs text-gray-600">{a.role}</p>
                        <p className="text-xs text-blue-600 font-medium">{a.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {a.skills.map(s => <Badge key={s} color="blue">{s}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><span className="text-xs text-gray-600">4.8 · {a.experience}</span></div>
                      <Badge color="green">Available</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Booking panel */}
            <div>
              <Card className="p-5 sticky top-20">
                {selected ? (
                  booked ? (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-emerald-600" /></div>
                      <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Session Booked!</h3>
                      <p className="text-sm text-gray-600 mb-1">Mentorship with <span className="font-semibold">{selected.name}</span></p>
                      <p className="text-xs text-gray-500">You'll receive a calendar invite and meeting link shortly.</p>
                      <Btn fullWidth className="mt-4" variant="outline" onClick={() => setBooked(false)}>Book Another</Btn>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-5">
                        <img src={selected.avatar} alt={selected.name} className="w-12 h-12 rounded-xl object-cover bg-blue-100" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{selected.name}</p>
                          <p className="text-xs text-gray-500">{selected.company}</p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-4 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>Book a Session</h3>
                      <div className="space-y-3 mb-5">
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Session Type</label>
                          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                            <option>Career Guidance (60 min)</option>
                            <option>Resume Review (45 min)</option>
                            <option>Mock Interview (90 min)</option>
                            <option>General Mentorship (30 min)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Preferred Date</label>
                          <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Time Slot</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map(t => (
                              <button key={t} className="border border-gray-200 rounded-lg py-1.5 text-xs font-medium text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">{t}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-700 mb-1 block">Brief Message</label>
                          <textarea rows={2} placeholder="What would you like to discuss?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
                        </div>
                      </div>
                      <Btn fullWidth onClick={() => setBooked(true)}>Book Session</Btn>
                    </>
                  )
                ) : (
                  <div className="text-center py-10">
                    <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Select a mentor to book a session</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {view === "my" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { mentor: "Arjun Mehta", company: "Microsoft", topic: "PM Interview Prep", date: "Jun 25, 2025", time: "7 PM", status: "upcoming", rating: null },
              { mentor: "Priya Sharma", company: "Google", topic: "Resume Review", date: "Jun 10, 2025", time: "4 PM", status: "completed", rating: 5 },
              { mentor: "Karthik Rajan", company: "OpenAI", topic: "ML Career Path", date: "May 28, 2025", time: "6 PM", status: "completed", rating: 5 },
            ].map(s => (
              <Card key={s.mentor} hover className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{s.mentor}</p>
                    <p className="text-xs text-gray-500">{s.company}</p>
                  </div>
                  <Badge color={s.status === "upcoming" ? "blue" : "green"}>{s.status}</Badge>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">{s.topic}</p>
                <p className="text-xs text-gray-500 mb-3">{s.date} · {s.time}</p>
                {s.rating && (
                  <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div>
                )}
                {s.status === "upcoming" && <Btn size="sm" fullWidth icon={<Video size={14} />}>Join Meeting</Btn>}
                {s.status === "completed" && <Btn size="sm" variant="outline" fullWidth>Book Again</Btn>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

