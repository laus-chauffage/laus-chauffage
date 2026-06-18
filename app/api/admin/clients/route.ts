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
  const { civilite, prenom, nom, email, telephone, adresse, code_postal, commune, type_chaudiere, dernier_entretien, mode_contact } = body;

  const prochain_entretien = calcProchainEntretien(dernier_entretien, type_chaudiere);

  const { error } = await getSupabase().from("clients").insert({
    civilite: civilite || 'M', prenom, nom, email: email || null, telephone, adresse, code_postal: code_postal || null, commune,
    type_chaudiere, dernier_entretien, prochain_entretien, mode_contact,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await getSupabase().from("clients").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, civilite, prenom, nom, email, telephone, adresse, code_postal, commune, type_chaudiere, dernier_entretien, mode_contact } = body;

  const prochain_entretien = dernier_entretien ? calcProchainEntretien(dernier_entretien, type_chaudiere) : null;

  const { error } = await getSupabase().from("clients").update({
    civilite: civilite || 'M', prenom, nom, email: email || null, telephone, adresse, code_postal: code_postal || null, commune,
    type_chaudiere, dernier_entretien: dernier_entretien || null,
    prochain_entretien, mode_contact,
  }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
