import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendSatisfactionEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { clientId } = await req.json();
    const sb = getSupabase();

    const { data: client, error } = await sb.from("clients").select("*").eq("id", clientId).single();
    if (error || !client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    if (!client.email) return NextResponse.json({ skipped: true });

    await sendSatisfactionEmail({
      civilite: client.civilite,
      prenom: client.prenom,
      nom: client.nom,
      email: client.email,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }
}
