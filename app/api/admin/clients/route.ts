import { NextRequest, NextResponse } from "next/server";
import { getSupabase, calcProchainEntretien, calcStatut } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await getSupabase()
    .from("clients")
    .select("*")
    .order("prochain_entretien", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clients = (data || []).map((c: any) => ({
    ...c,
    statut: calcStatut(c.prochain_entretien),
  }));

  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prenom, nom, email, telephone, adresse, commune, type_chaudiere, dernier_entretien, mode_contact } = body;

  const prochain_entretien = calcProchainEntretien(dernier_entretien, type_chaudiere);

  const { error } = await getSupabase().from("clients").insert({
    prenom, nom, email: email || null, telephone, adresse, commune,
    type_chaudiere, dernier_entretien, prochain_entretien, mode_contact,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
