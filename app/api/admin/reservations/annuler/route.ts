import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { deleteCalendarEvent } from "@/lib/google-calendar";
import { sendCancellationEmail } from "@/lib/mailer";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

const SERVICE_LABELS: Record<string, string> = {
  "entretien-mazout": "Entretien chaudière mazout",
  "entretien-gaz": "Entretien chaudière gaz",
  "depannage": "Dépannage non urgent",
  "installation": "Installation / devis",
};

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const sb = getSupabase();

  const { data: resa, error } = await sb.from("reservations")
    .select("google_event_id, prenom, nom, email, service, date, creneau")
    .eq("id", id).single();
  if (error || !resa) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });

  if (resa.google_event_id) {
    try {
      await deleteCalendarEvent(resa.google_event_id);
    } catch (err) {
      console.error("Google Calendar delete error:", err);
    }
  }

  await sb.from("reservations").update({ statut: "annule" }).eq("id", id);

  if (resa.email) {
    try {
      const dateFormatted = format(parse(resa.date, "yyyy-MM-dd", new Date()), "EEEE d MMMM yyyy", { locale: fr });
      await sendCancellationEmail({
        prenom: resa.prenom,
        nom: resa.nom,
        email: resa.email,
        service: SERVICE_LABELS[resa.service] || resa.service,
        date: dateFormatted,
        creneau: resa.creneau,
      });
    } catch (err) {
      console.error("Cancellation email error:", err);
    }
  }

  return NextResponse.json({ success: true });
}
