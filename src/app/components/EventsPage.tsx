import { useState } from "react";
import { Calendar, Video, Play, Layers } from "lucide-react";
import { cn } from "../utils";
import { events } from "../data";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

export default function EventsPage() {
  const [view, setView] = useState<"grid" | "calendar">("grid");
  const [registered, setRegistered] = useState<number[]>([]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Events & Webinars</h2>
            <p className="text-gray-500 text-sm">Live sessions, workshops, and bootcamps from industry experts</p>
          </div>
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <button onClick={() => setView("grid")} className={cn("p-2 rounded cursor-pointer", view === "grid" ? "bg-blue-100 text-blue-700" : "text-gray-500")}><Layers size={16} /></button>
            <button onClick={() => setView("calendar")} className={cn("p-2 rounded cursor-pointer", view === "calendar" ? "bg-blue-100 text-blue-700" : "text-gray-500")}><Calendar size={16} /></button>
          </div>
        </div>

        {/* Featured */}
        <div className="relative rounded-2xl overflow-hidden h-52 group">
          <img src={events[0].img} alt={events[0].title} className="w-full h-full object-cover bg-blue-200" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/50" />
          <div className="absolute inset-0 p-6 flex items-end">
            <div>
              <Badge color="teal">{events[0].type}</Badge>
              <h3 className="text-white font-bold text-xl mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>{events[0].title}</h3>
              <p className="text-blue-200 text-sm mt-1">{events[0].date} · {events[0].time} · Speaker: {events[0].speaker}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Btn size="sm" className="!bg-white !text-blue-700" icon={<Play size={14} />} onClick={() => setRegistered(r => r.includes(0) ? r : [...r, 0])}>
              {registered.includes(0) ? "Registered ✓" : "Register Free"}
            </Btn>
          </div>
        </div>

        {view === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(e => {
              const pct = Math.round((e.registered / e.seats) * 100);
              return (
                <Card key={e.id} hover className="overflow-hidden">
                  <div className="relative h-36">
                    <img src={e.img} alt={e.title} className="w-full h-full object-cover bg-blue-100" />
                    <div className="absolute top-3 left-3"><Badge color="indigo">{e.type}</Badge></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2" style={{ fontFamily: "Poppins, sans-serif" }}>{e.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{e.speaker} · {e.company}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                      <Calendar size={12} className="text-blue-500" />
                      <span>{e.date} · {e.time}</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{e.registered} registered</span><span>{pct}% full</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                    </div>
                    <Btn size="sm" fullWidth onClick={() => setRegistered(r => r.includes(e.id) ? r : [...r, e.id])}>
                      {registered.includes(e.id) ? "✓ Registered" : "Register"}
                    </Btn>
                  </div>
                </Card>
              );
            })}

            {/* Upcoming placeholder */}
            {[
              { title: "Startup Ecosystem – Founder Panel", date: "Jul 12, 2025", type: "Panel", speaker: "4 Alumni Founders" },
              { title: "GATE Preparation Strategy by Toppers", date: "Jul 18, 2025", type: "Webinar", speaker: "Alumni Toppers" },
              { title: "Design Thinking for Engineers", date: "Jul 22, 2025", type: "Workshop", speaker: "Divya Nair · Figma" },
            ].map(e => (
              <Card key={e.title} hover className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Video size={20} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <Badge color="blue">{e.type}</Badge>
                    <h3 className="font-semibold text-gray-900 text-sm mt-1.5 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{e.title}</h3>
                    <p className="text-xs text-gray-500">{e.speaker}</p>
                    <p className="text-xs text-blue-600 mt-0.5 font-medium">{e.date}</p>
                  </div>
                </div>
                <Btn size="sm" fullWidth variant="outline" className="mt-4">Notify Me</Btn>
              </Card>
            ))}
          </div>
        )}

        {view === "calendar" && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>June 2025</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
                const hasEvent = [22, 28].includes(d);
                return (
                  <div key={d} className={cn("aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-sm cursor-pointer transition-colors",
                    hasEvent ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50",
                    d === 17 && "bg-blue-600 text-white")}>
                    <span className={cn("font-medium", d === 17 ? "text-white" : hasEvent ? "text-blue-700" : "text-gray-700")}>{d}</span>
                    {hasEvent && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Events this month:</p>
              {events.map(e => (
                <div key={e.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{e.date.split(" ")[1]}</div>
                  <div><p className="text-xs font-medium text-gray-900">{e.title}</p><p className="text-[11px] text-gray-500">{e.time}</p></div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

