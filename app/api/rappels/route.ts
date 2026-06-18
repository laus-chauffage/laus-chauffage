import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendRappelEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { clientId } = await req.json();
  const sb = getSupabase();

  const { data: client, error } = await sb
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (error || !client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
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

  await sb.from("rappels").insert({
    client_id: clientId,
    type: "email",
    date_envoi: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
