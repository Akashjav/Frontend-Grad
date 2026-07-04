import { api } from "./api";

export type EventId = string | number;

export type EventItem = {
  id: EventId;
  title: string;
  speaker: string;
  company: string;
  date: string;
  time: string;
  type: string;
  seats: number;
  registered: number;
  img: string;
  isRsvped: boolean;
  raw: any;
};

export async function getEvents() {
  const data = await api.get("/api/events/");
  return asArray(data).map(normalizeEvent).filter((event) => event.id !== "");
}

export async function rsvpEvent(eventId: EventId) {
  if (eventId === undefined || eventId === null || eventId === "") {
    throw new Error("This event is missing an id, so RSVP cannot be submitted.");
  }

  return api.post(`/api/events/${encodeURIComponent(String(eventId))}/rsvp`);
}

export async function cancelRsvp(eventId: EventId) {
  return api.delete(`/api/events/${encodeURIComponent(String(eventId))}/rsvp`);
}

function asArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.events)) return value.events;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function normalizeEvent(event: any): EventItem {
  const startValue = firstDefined(
    event?.start_time,
    event?.startTime,
    event?.start_at,
    event?.starts_at,
    event?.event_date,
    event?.date_time,
    event?.datetime,
    event?.date
  );
  const seats = toNumber(
    firstDefined(
      event?.seats,
      event?.capacity,
      event?.max_attendees,
      event?.max_participants,
      event?.registration_limit,
      event?.total_seats
    )
  );
  const registered = toNumber(
    firstDefined(
      event?.registered,
      event?.registered_count,
      event?.attendee_count,
      event?.attendees_count,
      event?.rsvp_count,
      event?.participant_count,
      event?.participants_count,
      Array.isArray(event?.attendees) ? event.attendees.length : undefined,
      Array.isArray(event?.participants) ? event.participants.length : undefined
    )
  );

  return {
    id: firstDefined(event?.id, event?.event_id, event?._id, ""),
    title: String(firstDefined(event?.title, event?.name, "Untitled event")),
    speaker: String(firstDefined(event?.speaker, event?.speaker_name, event?.host, "Speaker TBA")),
    company: String(firstDefined(event?.company, event?.organization, event?.host_company, "")),
    date: formatDate(startValue),
    time: formatTime(firstDefined(event?.time, event?.start_time, event?.starts_at, event?.event_date)),
    type: String(firstDefined(event?.type, event?.category, event?.event_type, "Event")),
    seats,
    registered,
    img: String(
      firstDefined(
        event?.img,
        event?.image,
        event?.image_url,
        event?.cover_image,
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&auto=format"
      )
    ),
    isRsvped: toBoolean(
      firstDefined(
        event?.isRsvped,
        event?.is_rsvped,
        event?.is_registered,
        event?.registered_by_me,
        event?.has_rsvped,
        false
      )
    ),
    raw: event,
  };
}

function firstDefined(...values: any[]) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function toNumber(value: any) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toBoolean(value: any) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return ["true", "1", "yes"].includes(value.toLowerCase());
  return Boolean(value);
}

function formatDate(value: any) {
  if (!value) return "Date TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: any) {
  if (!value) return "Time TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
