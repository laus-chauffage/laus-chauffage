import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function buildLettre(client: any, today: string): string {
  const typeLabel = client.type_chaudiere === "mazout" ? "chaudière mazout" : "chaudière gaz";
  const typeLabelUpper = typeLabel.toUpperCase();
  const prochainFormatted = client.prochain_entretien
    ? format(parseISO(client.prochain_entretien), "MMMM yyyy", { locale: fr })
    : "prochainement";
  const adresseComplete = [
    client.adresse,
    [client.code_postal, client.commune].filter(Boolean).join(" "),
  ].filter(Boolean).join("<br>");

  const salutation = client.civilite === "Mme" ? `Madame ${client.nom}` : `Monsieur ${client.nom}`;

  return `
<div class="lettre">
  <div class="repere-pli" style="top:99mm"></div>
  <div class="repere-pli" style="top:198mm"></div>

  <!-- En-tête -->
  <div class="header">
    <div>
      <div class="logo">Laus <span class="logo-sep">|</span> Chauffage</div>
      <div class="tagline">Votre chauffagiste en Brabant wallon</div>
      <div class="header-adresse">Route de Bruxelles, 17 — 1430 Rebecq</div>
    </div>
    <div class="header-coords">
      +32 475 20 04 87<br>
      sebastien@laus-chauffage.be
    </div>
  </div>

  <!-- Bandeau type -->
  <div class="bandeau">RAPPEL D'ENTRETIEN — ${typeLabelUpper}</div>

  <!-- Zone adresse -->
  <div class="zone-adresse">
    <div class="adresse-row">
      <div class="date-ligne-left">Rebecq, le ${today}</div>
      <div class="destinataire-bloc">
        <div class="destinataire">
          <strong>${client.prenom} ${client.nom}</strong><br>
          ${adresseComplete}
        </div>
      </div>
    </div>
  </div>

  <!-- Corps -->
  <div class="corps">
    <p>Bonjour <strong>${salutation}</strong>,</p>

    <p>L'entretien de votre <strong>${typeLabel}</strong> arrive bientôt à échéance en <strong>${prochainFormatted}</strong>. Pour assurer la sécurité, les performances et la longévité de votre installation, il est important de planifier cet entretien dans les meilleurs délais.</p>

    <!-- Encadré avantages -->
    <div class="encadre">
      <div class="encadre-titre">Pourquoi entretenir votre chaudière ?</div>
      <div class="point"><span class="puce"></span><div><strong>Sécurité</strong> — Prévenez les risques liés au monoxyde de carbone.</div></div>
      <div class="point"><span class="puce"></span><div><strong>Performance</strong> — Un appareil entretenu consomme moins d'énergie.</div></div>
      <div class="point"><span class="puce"></span><div><strong>Durabilité</strong> — Prolongez la vie de votre installation.</div></div>
      <div class="point"><span class="puce"></span><div><strong>Obligation légale</strong> — L'entretien est obligatoire en Belgique.</div></div>
    </div>

    <p>Nos créneaux se remplissent rapidement. N'hésitez pas à prendre rendez-vous dès maintenant :</p>

    <!-- Contacts -->
    <div class="contacts">
      <div class="contact-item"><div class="contact-icon">T</div><div><strong>+32 475 20 04 87</strong> &nbsp;(lun–ven, 8h–17h)</div></div>
      <div class="contact-item"><div class="contact-icon">@</div><div>sebastien@laus-chauffage.be</div></div>
      <div class="contact-item"><div class="contact-icon">W</div><div>www.laus-chauffage.be/reservation</div></div>
    </div>

    <p>Dans l'attente de votre prise de contact, nous restons à votre disposition pour toute question.</p>

    <!-- Signature -->
    <div class="signature">
      <p>Cordialement,</p>
      <div class="sig-name">Sébastien Laus</div>
      <div class="sig-title">Laus Chauffage</div>
    </div>
  </div>

  <!-- Pied -->
  <div class="footer">
    Laus Chauffage — Route de Bruxelles, 17 — 1430 Rebecq — +32 475 20 04 87 — sebastien@laus-chauffage.be — www.laus-chauffage.be
  </div>

</div>`;
}

export const CSS = `
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 10.5pt; color: #1a1a1a; background: white; }

  .lettre {
    width: 210mm;
    min-height: 297mm;
    display: flex;
    flex-direction: column;
    page-break-after: always;
    background: white;
    position: relative;
  }
  .lettre:last-child { page-break-after: avoid; }

  .repere-pli {
    position: absolute;
    left: 0;
    width: 6mm;
    height: 0;
    border-top: 0.4pt solid #aaa;
  }

  /* En-tête */
  .header {
    background: #1e3a5f;
    padding: 20px 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .logo { font-size: 22pt; font-weight: bold; color: white; }
  .logo-sep { color: #c0392b; }
  .tagline { font-size: 8pt; color: #aac4e0; margin-top: 3px; }
  .header-adresse { font-size: 8pt; color: #aac4e0; margin-top: 5px; }
  .header-coords { font-size: 8.5pt; color: #cce0f5; text-align: right; line-height: 1.8; }

  /* Bandeau */
  .bandeau {
    background: #c0392b;
    padding: 10px 28px;
    color: white;
    font-size: 10pt;
    font-weight: bold;
    letter-spacing: 0.05em;
  }

  /* Zone adresse */
  .zone-adresse {
    padding: 28px 28px 20px;
    border-bottom: 1px solid #e0e0e0;
  }
  .destinataire-bloc {
    width: 48%;
  }
  .expediteur-mini {
    font-size: 7.5pt;
    color: #999;
    border-bottom: 1px solid #ddd;
    padding-bottom: 6px;
    margin-bottom: 10px;
    text-decoration: underline;
  }
  .destinataire {
    font-size: 11pt;
    line-height: 1.8;
    color: #1a1a1a;
  }

  .adresse-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 10px;
  }
  .date-ligne-left {
    font-size: 9.5pt;
    color: #666;
    align-self: flex-end;
    margin-bottom: 4px;
  }

  /* Corps */
  .corps { padding: 32px 28px 20px; flex: 1; }
  p { margin-bottom: 12px; line-height: 1.65; font-size: 10.5pt; }

  /* Encadré */
  .encadre {
    border: 1.5px solid #e0e0e0;
    border-left: 4px solid #c0392b;
    border-radius: 0 5px 5px 0;
    padding: 14px 18px;
    margin: 16px 0;
    background: #f7f9fc;
  }
  .encadre-titre {
    font-size: 9pt;
    font-weight: bold;
    color: #1e3a5f;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 10px;
  }
  .point {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 9.5pt;
    line-height: 1.5;
    margin-bottom: 7px;
  }
  .puce {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c0392b;
    flex-shrink: 0;
    margin-top: 4px;
  }

  /* Contacts */
  .contacts { margin: 14px 0 18px; display: flex; flex-direction: column; gap: 7px; }
  .contact-item { display: flex; align-items: center; gap: 10px; font-size: 10pt; }
  .contact-icon {
    width: 22px;
    height: 22px;
    background: #1e3a5f;
    color: white;
    border-radius: 50%;
    font-size: 8pt;
    font-weight: bold;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Signature */
  .signature { margin-top: 28px; }
  .sig-name { font-weight: bold; font-size: 11pt; color: #1e3a5f; margin-top: 14px; }
  .sig-title { font-size: 9pt; color: #666; margin-top: 2px; }

  /* Pied */
  .footer {
    background: #1e3a5f;
    color: #aac4e0;
    font-size: 8pt;
    text-align: center;
    padding: 10px 28px;
    margin-top: auto;
  }

  /* Barre UI */
  .barre {
    background: #1e3a5f;
    color: white;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .barre button {
    background: #c0392b;
    color: white;
    border: none;
    padding: 7px 18px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 13px;
  }
  @media print { .barre { display: none !important; } }
`;

export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) return NextResponse.json({ error: "clientId requis" }, { status: 400 });

  const sb = getSupabase();
  const { data: client, error } = await sb.from("clients").select("*").eq("id", clientId).single();
  if (error || !client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const today = format(new Date(), "d MMMM yyyy", { locale: fr });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rappel — ${client.prenom} ${client.nom}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="barre">
    <span>Rappel — ${client.prenom} ${client.nom}</span>
    <button onclick="window.print()">Imprimer</button>
  </div>
  ${buildLettre(client, today)}
  <script>window.print(); window.onafterprint = () => { document.body.innerHTML = '<p style="font-family:Arial;padding:40px;color:#999">Vous pouvez fermer cet onglet.</p>'; };</script>
</body>
</html>`;

  await sb.from("rappels").insert({ client_id: clientId, type: "courrier", date_envoi: new Date().toISOString() });

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
