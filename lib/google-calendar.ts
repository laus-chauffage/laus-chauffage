import { google } from "googleapis";
import { addHours } from "date-fns";

const ALL_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00"];
const SLOT_DURATIONS: Record<string, number> = {
  "08:00": 2, "10:00": 2, "12:00": 2, "14:00": 2, "16:00": 1,
};

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

// Convert a Brussels local datetime string "YYYY-MM-DDTHH:mm" to a UTC JS Date.
// Uses Intl to detect whether Brussels is CET (+1) or CEST (+2) for that moment.
function brusselsToUtc(dateStr: string, timeStr: string): Date {
  // First guess: assume +02:00 (CEST) and check
  const guess = new Date(`${dateStr}T${timeStr}:00+02:00`);
  const brusselsFmt = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    timeZoneName: "short",
  }).format(guess);
  const offset = brusselsFmt.includes("GMT+2") ? "+02:00" : "+01:00";
  return new Date(`${dateStr}T${timeStr}:00${offset}`);
}

// Format a Date as Brussels local "YYYY-MM-DDTHH:mm:ss" for Google Calendar
// (Google interprets it using the timeZone field on the event)
function toBrusselsLocalStr(date: Date): string {
  const parts = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const p = Object.fromEntries(parts.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`;
}

export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  // Cover the full Brussels day in UTC
  const dayStart = brusselsToUtc(dateStr, "00:00");
  const dayEnd = brusselsToUtc(dateStr, "23:59");

  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items || [];

  return ALL_SLOTS.filter((slot) => {
    // Parse slot as Brussels local time → UTC for comparison
    const slotStart = brusselsToUtc(dateStr, slot);
    const slotEnd = addHours(slotStart, SLOT_DURATIONS[slot] ?? 2);

    return !events.some((event) => {
      const evStart = new Date(event.start?.dateTime || event.start?.date || "");
      const evEnd = new Date(event.end?.dateTime || event.end?.date || "");
      return evStart < slotEnd && evEnd > slotStart;
    });
  });
}

export async function createCalendarEvent(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  commune: string;
  service: string;
  date: string;
  creneau: string;
  notes?: string;
}): Promise<string | null> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const startUtc = brusselsToUtc(data.date, data.creneau);
  const endUtc = addHours(startUtc, SLOT_DURATIONS[data.creneau] ?? 2);

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    requestBody: {
      summary: `${data.service} — ${data.prenom} ${data.nom}`,
      description: `Client : ${data.prenom} ${data.nom}\nTél : ${data.telephone}\nEmail : ${data.email}\nAdresse : ${data.adresse}, ${data.commune}\n\nNotes : ${data.notes || "—"}`,
      location: `${data.adresse}, ${data.commune}`,
      // Pass as Brussels local string + timeZone → Google places it at the right time
      start: { dateTime: toBrusselsLocalStr(startUtc), timeZone: "Europe/Brussels" },
      end: { dateTime: toBrusselsLocalStr(endUtc), timeZone: "Europe/Brussels" },
    },
  });

  return res.data.id || null;
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    eventId,
  });
}
