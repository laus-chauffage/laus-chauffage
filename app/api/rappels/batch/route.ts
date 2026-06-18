import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendRappelEmail } from "@/lib/mailer";
import { addMonths, startOfMonth, endOfMonth, format } from "date-fns";

function getMoisCible() {
  const moisProchain = addMonths(new Date(), 1);
  return {
    debut: format(startOfMonth(moisProchain), "yyyy-MM-dd"),
    fin: format(endOfMonth(moisProchain), "yyyy-MM-dd"),
    label: format(moisProchain, "MMMM yyyy"),
  };
}

// GET — liste des clients à relancer le mois prochain + historique rappels ce mois
export async function GET() {
  const { debut, fin, label } = getMoisCible();
  const sb = getSupabase();

  const { data: clients, error } = await sb
    .from("clients")
    .select("*")
    .gte("prochain_entretien", debut)
    .lte("prochain_entretien", fin)
    .order("nom");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Récupère les rappels envoyés ce mois-ci pour ces clients
  const clientIds = (clients || []).map((c: any) => c.id);
  const debutMoisCourant = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const { data: rappels } = clientIds.length
    ? await sb.from("rappels").select("client_id, type, date_envoi").in("client_id", clientIds).gte("date_envoi", debutMoisCourant)
    : { data: [] };

  // Associe les rappels à chaque client
  const rappelsMap: Record<string, { email?: string; courrier?: string }> = {};
  for (const r of rappels || []) {
    if (!rappelsMap[r.client_id]) rappelsMap[r.client_id] = {};
    if (!rappelsMap[r.client_id][r.type as "email" | "courrier"]) {
      rappelsMap[r.client_id][r.type as "email" | "courrier"] = r.date_envoi;
    }
  }

  const enriched = (clients || []).map((c: any) => ({ ...c, rappels_envoyes: rappelsMap[c.id] || {} }));

  return NextResponse.json({ clients: enriched, mois: label, debut, fin });
}

// POST — envoie les emails à tous les clients email du mois prochain
export async function POST(req: NextRequest) {
  const { debut, fin } = getMoisCible();
  const sb = getSupabase();

  const { data: clients, error } = await sb
    .from("clients")
    .select("*")
    .gte("prochain_entretien", debut)
    .lte("prochain_entretien", fin)
    .eq("mode_contact", "email");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = { sent: 0, failed: 0, skipped: 0 };

  for (const client of clients || []) {
    if (!client.email) { results.skipped++; continue; }

    try {
      await sendRappelEmail({
        civilite: client.civilite,
        prenom: client.prenom,
        nom: client.nom,
        email: client.email,
        typeChaudiere: client.type_chaudiere === "mazout" ? "chaudière mazout" : "chaudière gaz",
        bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation`,
      });
      await sb.from("rappels").insert({ client_id: client.id, type: "email", date_envoi: new Date().toISOString() });
      results.sent++;
    } catch {
      results.failed++;
    }
  }

  return NextResponse.json(results);
}
