import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendConfirmationEmail } from "@/lib/mailer";
import { sendSmsConfirmation } from "@/lib/sms";
import { format, parse, isBefore } from "date-fns";
import { fr } from "date-fns/locale";

const SERVICE_LABELS: Record<string, string> = {
  "entretien-mazout": "Entretien chaudière mazout",
  "entretien-gaz": "Entretien chaudière gaz",
  "depannage": "Dépannage non urgent",
  "installation": "Installation / devis",
};

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/reservation?erreur=token", req.url));

  const sb = getSupabase();
  const { data: resa, error } = await sb
    .from("reservations")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !resa) return NextResponse.redirect(new URL("/reservation?erreur=invalide", req.url));
  if (resa.statut === "confirme") return NextResponse.redirect(new URL("/reservation/confirmer?deja=1", req.url));
  if (resa.statut === "annule") return NextResponse.redirect(new URL("/reservation?erreur=annule", req.url));
  if (isBefore(new Date(resa.token_expires_at), new Date())) {
    await sb.from("reservations").update({ statut: "annule" }).eq("id", resa.id);
    return NextResponse.redirect(new URL("/reservation?erreur=expire", req.url));
  }

  const serviceLabel = SERVICE_LABELS[resa.service] || resa.service;
  const dateFormatted = format(parse(resa.date, "yyyy-MM-dd", new Date()), "EEEE d MMMM yyyy", { locale: fr });

  let googleEventId: string | null = null;
  try {
    googleEventId = await createCalendarEvent({
      nom: resa.nom, prenom: resa.prenom, email: resa.email,
      telephone: resa.telephone, rue: resa.rue, numero: resa.numero, commune: resa.commune,
      service: serviceLabel, date: resa.date, creneau: resa.creneau, notes: resa.notes,
    });
  } catch (err) {
    console.error("Google Calendar error:", err);
  }

  await sb.from("reservations").update({
    statut: "confirme",
    google_event_id: googleEventId,
    token: null,
    token_expires_at: null,
  }).eq("id", resa.id);

  try {
    await sendConfirmationEmail({
      prenom: resa.prenom, nom: resa.nom, email: resa.email,
      service: serviceLabel, date: dateFormatted,
      creneau: resa.creneau, adresse: resa.adresse, commune: resa.commune,
    });
  } catch (err) {
    console.error("Email error:", err);
  }

  try {
    await sendSmsConfirmation({
      telephone: resa.telephone, prenom: resa.prenom,
      service: serviceLabel, date: dateFormatted, creneau: resa.creneau,
    });
  } catch (err) {
    console.error("SMS error:", err);
  }

  return NextResponse.redirect(new URL(`/reservation/confirmer?ok=1`, req.url));
}
