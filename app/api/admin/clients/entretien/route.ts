import { NextRequest, NextResponse } from "next/server";
import { getSupabase, calcProchainEntretien } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { clientId, date_entretien } = await req.json();
  const sb = getSupabase();

  const { data: client, error } = await sb.from("clients").select("type_chaudiere").eq("id", clientId).single();
  if (error || !client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const prochain_entretien = calcProchainEntretien(date_entretien, client.type_chaudiere);

  await sb.from("clients").update({
    dernier_entretien: date_entretien,
    prochain_entretien,
  }).eq("id", clientId);

  return NextResponse.json({ success: true, prochain_entretien });
}
