import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) return NextResponse.json({ error: "clientId requis" }, { status: 400 });

  const sb = getSupabase();
  const { data: client, error } = await sb.from("clients").select("*").eq("id", clientId).single();

  if (error || !client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const typeLabel = client.type_chaudiere === "mazout" ? "chaudière mazout" : "chaudière gaz";
  const prochainFormatted = format(parseISO(client.prochain_entretien), "MMMM yyyy", { locale: fr });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rappel entretien — ${client.prenom} ${client.nom}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #1a1a1a; }
    .header { border-bottom: 3px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 32px; }
    .company { font-size: 22px; font-weight: bold; color: #1e3a5f; }
    .highlight { background: #fff3e0; border-left: 4px solid #c0392b; padding: 12px 16px; margin: 24px 0; }
    .footer { margin-top: 48px; border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #666; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">🔥 Laus Chauffage</div>
    <div style="color:#666;font-size:14px">Route de Bruxelles, 17 — Rebecq | +32 475 20 04 87 | sebastien@laus-chauffage.be</div>
  </div>
  <div style="margin-bottom:32px">
    <strong>${client.prenom} ${client.nom}</strong><br>
    ${client.adresse}<br>
    ${client.commune}
  </div>
  <p>Rebecq, le ${format(new Date(), "d MMMM yyyy", { locale: fr })}</p>
  <p>Madame, Monsieur ${client.nom},</p>
  <p>Nous vous contactons afin de vous rappeler que l'entretien de votre <strong>${typeLabel}</strong> arrive à échéance en <strong>${prochainFormatted}</strong>.</p>
  <div class="highlight">
    Un entretien régulier est <strong>obligatoire</strong> en Belgique et vous garantit :
    <ul style="margin:8px 0">
      <li>La sécurité de votre installation</li>
      <li>Des performances optimales et des économies d'énergie</li>
      <li>La validité de votre garantie constructeur</li>
    </ul>
  </div>
  <p>Pour prendre rendez-vous :</p>
  <ul>
    <li>Appelez le <strong>+32 475 20 04 87</strong> (lun–ven, 8h–17h)</li>
    <li>Réservez en ligne : <strong>www.laus-chauffage.be/reservation</strong></li>
  </ul>
  <p>Cordialement,</p>
  <p><strong>Sébastien Laus</strong><br>Laus Chauffage</p>
  <div class="footer">Laus Chauffage — Route de Bruxelles, 17 — 1430 Rebecq</div>
  <script>window.print();</script>
</body>
</html>`;

  await sb.from("rappels").insert({ client_id: clientId, type: "courrier", date_envoi: new Date().toISOString() });

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
