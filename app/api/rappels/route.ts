import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendRappelEmail } from "@/lib/mailer";
import { sendRappelEntretienSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const { clientId, mode } = await req.json();
  const sb = getSupabase();

  const { data: client, error } = await sb
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error || !client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const sendMode = mode || client.mode_contact;

  if (sendMode === "sms") {
    if (!client.telephone) return NextResponse.json({ error: "Pas de téléphone" }, { status: 400 });
    await sendRappelEntretienSMS({
      civilite: client.civilite,
      prenom: client.prenom,
      nom: client.nom,
      telephone: client.telephone,
      prochain_entretien: client.prochain_entretien,
    });
    await sb.from("rappels").insert({ client_id: clientId, type: "sms", date_envoi: new Date().toISOString() });
    return NextResponse.json({ success: true });
  }

  // email (défaut)
  if (!client.email) return NextResponse.json({ error: "Pas d'email" }, { status: 400 });
  const typeLabel = client.type_chaudiere === "mazout" ? "chaudière mazout" : "chaudière gaz";
  await sendRappelEmail({
    civilite: client.civilite,
    prenom: client.prenom,
    nom: client.nom,
    email: client.email,
    typeChaudiere: typeLabel,
    bookingUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation`,
  });
  await sb.from("rappels").insert({ client_id: clientId, type: "email", date_envoi: new Date().toISOString() });
  return NextResponse.json({ success: true });
}
