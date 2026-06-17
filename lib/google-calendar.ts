import { google } from "googleapis";
import { parse, addHours } from "date-fns";

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

export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const dayStart = new Date(`${dateStr}T00:00:00`);
  const dayEnd = new Date(`${dateStr}T23:59:59`);

  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = res.data.items || [];

  return ALL_SLOTS.filter((slot) => {
    const slotStart = parse(`${dateStr} ${slot}`, "yyyy-MM-dd HH:mm", new Date());
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

  const start = parse(`${data.date} ${data.creneau}`, "yyyy-MM-dd HH:mm", new Date());
  const end = addHours(start, SLOT_DURATIONS[data.creneau] ?? 2);

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    requestBody: {
      summary: `${data.service} — ${data.prenom} ${data.nom}`,
      description: `Client : ${data.prenom} ${data.nom}\nTél : ${data.telephone}\nEmail : ${data.email}\nAdresse : ${data.adresse}, ${data.commune}\n\nNotes : ${data.notes || "—"}`,
      location: `${data.adresse}, ${data.commune}`,
      start: { dateTime: start.toISOString(), timeZone: "Europe/Brussels" },
      end: { dateTime: end.toISOString(), timeZone: "Europe/Brussels" },
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
