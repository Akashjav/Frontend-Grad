import { useEffect, useState } from "react";
import { getEvents, rsvpEvent, type EventItem, type EventId } from "../../lib/eventsApi";
import { Calendar, Check, Layers, Users } from "lucide-react";
import { cn } from "../utils";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";

function eventKey(id: EventId) {
  return String(id);
}

function attendancePercent(event: EventItem) {
  if (event.seats <= 0) return 0;
  return Math.min(100, Math.round((event.registered / event.seats) * 100));
}

function eventDay(event: EventItem) {
  const value =
    event.raw?.start_time ??
    event.raw?.starts_at ??
    event.raw?.event_date ??
    event.raw?.date ??
    event.date;
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";
  return String(date.getDate()).padStart(2, "0");
}

export default function EventsPage() {
  const [view, setView] = useState<"grid" | "calendar">("grid");
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [rsvpingIds, setRsvpingIds] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents();
        if (!mounted) return;

        setEvents(data);
        setRegisteredIds((current) => mergeBackendRegistrations(current, data));
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load events");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  function mergeBackendRegistrations(current: Set<string>, data: EventItem[], extraId?: EventId) {
    const next = new Set(current);
    if (extraId !== undefined && extraId !== null) next.add(eventKey(extraId));

    data.forEach((event) => {
      if (event.isRsvped) next.add(eventKey(event.id));
    });

    return next;
  }

  function isRegistered(event: EventItem) {
    return event.isRsvped || registeredIds.has(eventKey(event.id));
  }

  async function handleRsvp(event: EventItem) {
    const key = eventKey(event.id);
    if (isRegistered(event) || rsvpingIds.has(key)) return;

    setRsvpingIds((current) => new Set(current).add(key));

    try {
      await rsvpEvent(event.id);

      setRegisteredIds((current) => mergeBackendRegistrations(current, [], event.id));
      setEvents((current) =>
        current.map((item) =>
          eventKey(item.id) === key
            ? { ...item, isRsvped: true, registered: item.registered + 1 }
            : item
        )
      );

      const refreshedEvents = await getEvents();
      setEvents(refreshedEvents);
      setRegisteredIds((current) => mergeBackendRegistrations(current, refreshedEvents, event.id));
    } catch (err: any) {
      alert(err.message || "Failed to RSVP");
    } finally {
      setRsvpingIds((current) => {
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto">Loading events...</div>
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

  if (events.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <Calendar size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">No events available</p>
            <p className="text-sm text-gray-500 mt-1">New backend events will appear here.</p>
          </Card>
        </div>
      </div>
    );
  }

  const featured = events[0];
  const featuredRegistered = isRegistered(featured);
  const featuredBusy = rsvpingIds.has(eventKey(featured.id));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
              Events & Webinars
            </h2>
            <p className="text-gray-500 text-sm">Live sessions, workshops, and bootcamps from the backend</p>
          </div>
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded cursor-pointer",
                view === "grid" ? "bg-blue-100 text-blue-700" : "text-gray-500"
              )}
              aria-label="Grid view"
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => setView("calendar")}
              className={cn(
                "p-2 rounded cursor-pointer",
                view === "calendar" ? "bg-blue-100 text-blue-700" : "text-gray-500"
              )}
              aria-label="Calendar view"
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-52 group">
          <img src={featured.img} alt={featured.title} className="w-full h-full object-cover bg-blue-200" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/50" />
          <div className="absolute inset-0 p-6 flex items-end">
            <div>
              <Badge color="teal">{featured.type}</Badge>
              <h3 className="text-white font-bold text-xl mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                {featured.title}
              </h3>
              <p className="text-blue-200 text-sm mt-1">
                {featured.date} - {featured.time} - Speaker: {featured.speaker}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Btn
              size="sm"
              className="!bg-white !text-blue-700"
              icon={featuredRegistered ? <Check size={14} /> : undefined}
              onClick={() => handleRsvp(featured)}
              disabled={featuredRegistered || featuredBusy}
            >
              {featuredBusy ? "Registering..." : featuredRegistered ? "Registered" : "RSVP"}
            </Btn>
          </div>
        </div>

        {view === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const key = eventKey(event.id);
              const pct = attendancePercent(event);
              const registered = isRegistered(event);
              const busy = rsvpingIds.has(key);
              const full = event.seats > 0 && event.registered >= event.seats;

              return (
                <Card key={key} hover className="overflow-hidden">
                  <div className="relative h-36">
                    <img src={event.img} alt={event.title} className="w-full h-full object-cover bg-blue-100" />
                    <div className="absolute top-3 left-3">
                      <Badge color="indigo">{event.type}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      {event.speaker}
                      {event.company ? ` - ${event.company}` : ""}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                      <Calendar size={12} className="text-blue-500" />
                      <span>
                        {event.date} - {event.time}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{event.registered} registered</span>
                        <span>{event.seats > 0 ? `${pct}% full` : "Capacity TBA"}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <Btn
                      onClick={() => handleRsvp(event)}
                      disabled={registered || busy || full}
                      icon={registered ? <Check size={14} /> : undefined}
                    >
                      {busy ? "Registering..." : registered ? "Registered" : full ? "Full" : "RSVP"}
                    </Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {view === "calendar" && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Event Calendar
            </h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={eventKey(event.id)} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {eventDay(event)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.date} - {event.time}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                    <Users size={13} />
                    {event.registered}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
