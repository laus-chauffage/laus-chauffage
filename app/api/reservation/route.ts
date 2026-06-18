import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationRequestEmail } from "@/lib/mailer";
import { getSupabase } from "@/lib/supabase";
import { format, parse, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { randomBytes } from "crypto";

const SERVICE_LABELS: Record<string, string> = {
  "entretien-mazout": "Entretien chaudière mazout",
  "entretien-gaz": "Entretien chaudière gaz",
  "depannage": "Dépannage non urgent",
  "installation": "Installation / devis",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { service, date, creneau, nom, prenom, email, telephone, rue, numero, code_postal, commune, notes, piece_jointe_url, piece_jointe_nom } = body;

  const serviceLabel = SERVICE_LABELS[service] || service;
  const dateFormatted = format(parse(date, "yyyy-MM-dd", new Date()), "EEEE d MMMM yyyy", { locale: fr });

  const token = randomBytes(32).toString("hex");
  const tokenExpiresAt = addHours(new Date(), 24).toISOString();

  const { error } = await getSupabase().from("reservations").insert({
    nom, prenom, email, telephone, rue, numero: numero || null, code_postal: code_postal || null, commune,
    service, date, creneau, notes,
    piece_jointe_url: piece_jointe_url || null,
    piece_jointe_nom: piece_jointe_nom || null,
    statut: "en_attente",
    token,
    token_expires_at: tokenExpiresAt,
  });

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Erreur lors de la réservation" }, { status: 500 });
  }

  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/reservation/confirmer?token=${token}`;
  const adresse = [numero, rue].filter(Boolean).join(" ");

  try {
    await sendConfirmationRequestEmail({
      prenom, nom, email,
      service: serviceLabel,
      date: dateFormatted,
      creneau, adresse, commune,
      confirmUrl,
      piece_jointe_url: piece_jointe_url || undefined,
      piece_jointe_nom: piece_jointe_nom || undefined,
    });
  } catch (err) {
    console.error("Email error:", err);
  }

  return NextResponse.json({ success: true });
}
