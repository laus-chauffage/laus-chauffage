import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendSmsRappel24h } from "@/lib/sms";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

export async function GET(req: NextRequest) {
  // Sécurité : vérifier le token secret
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const demain = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const sb = getSupabase();

  const { data: reservations, error } = await sb
    .from("reservations")
    .select("*")
    .eq("date", demain)
    .eq("statut", "confirmé");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!reservations || reservations.length === 0) {
    return NextResponse.json({ success: true, sent: 0, message: "Aucun RDV demain" });
  }

  let sent = 0;
  let failed = 0;

  for (const rdv of reservations) {
    if (!rdv.telephone) { failed++; continue; }
    try {
      const dateFormatted = format(new Date(rdv.date), "EEEE d MMMM", { locale: fr });
      await sendSmsRappel24h({
        telephone: rdv.telephone,
        prenom: rdv.prenom,
        date: dateFormatted,
        creneau: rdv.creneau,
      });
      sent++;
    } catch (e) {
      console.error(`SMS failed for ${rdv.id}:`, e);
      failed++;
    }
  }

  return NextResponse.json({ success: true, sent, failed });
}
