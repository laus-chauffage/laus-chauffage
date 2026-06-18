import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { addMonths, startOfMonth, endOfMonth, format } from "date-fns";
import { fr } from "date-fns/locale";
import { buildLettre, CSS } from "@/app/api/rappels/print/route";

export async function GET() {
  const moisProchain = addMonths(new Date(), 1);
  const debut = format(startOfMonth(moisProchain), "yyyy-MM-dd");
  const fin = format(endOfMonth(moisProchain), "yyyy-MM-dd");
  const moisLabel = format(moisProchain, "MMMM yyyy", { locale: fr });

  const sb = getSupabase();
  const { data: clients, error } = await sb
    .from("clients")
    .select("*")
    .gte("prochain_entretien", debut)
    .lte("prochain_entretien", fin)
    .eq("mode_contact", "courrier")
    .order("nom");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!clients || clients.length === 0) {
    return new NextResponse(`<html><body style="font-family:Arial;padding:40px;color:#1e3a5f"><p>Aucun client courrier pour ${moisLabel}.</p></body></html>`, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const today = format(new Date(), "d MMMM yyyy", { locale: fr });

  for (const client of clients) {
    await sb.from("rappels").insert({ client_id: client.id, type: "courrier", date_envoi: new Date().toISOString() });
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rappels courrier — ${moisLabel}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="barre">
    <span>${clients.length} lettre(s) — <span style="text-transform:capitalize">${moisLabel}</span></span>
    <button onclick="window.print()">Imprimer tout</button>
  </div>
  ${clients.map((c: any) => buildLettre(c, today)).join("\n")}
  <script>window.print(); window.onafterprint = () => { document.body.innerHTML = '<p style="font-family:Arial;padding:40px;color:#999">Vous pouvez fermer cet onglet.</p>'; };</script>
</body>
</html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
