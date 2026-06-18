import { NextRequest, NextResponse } from "next/server";
import { getSupabase, calcProchainEntretien, calcStatut } from "@/lib/supabase";

export async function GET() {
  const sb = getSupabase();
  const [clientsRes, rappelsRes] = await Promise.all([
    sb.from("clients").select("*").order("prochain_entretien", { ascending: true }),
    sb.from("rappels").select("client_id, type, date_envoi").gte("date_envoi", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()).order("date_envoi", { ascending: false }),
  ]);

  if (clientsRes.error) return NextResponse.json({ error: clientsRes.error.message }, { status: 500 });

  // Groupe les rappels par client_id → dernier rappel par type
  const rappelsMap: Record<string, { email?: string; courrier?: string; sms?: string }> = {};
  for (const r of (rappelsRes.data || [])) {
    if (!rappelsMap[r.client_id]) rappelsMap[r.client_id] = {};
    const m = rappelsMap[r.client_id];
    if (r.type === "email" && !m.email) m.email = r.date_envoi;
    if (r.type === "courrier" && !m.courrier) m.courrier = r.date_envoi;
    if (r.type === "sms" && !m.sms) m.sms = r.date_envoi;
  }

  const clients = (clientsRes.data || []).map((c: any) => ({
    ...c,
    statut: calcStatut(c.prochain_entretien),
    rappels_envoyes: rappelsMap[c.id] || {},
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
