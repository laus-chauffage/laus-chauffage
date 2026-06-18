import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Laus Chauffage <sebastien@laus-chauffage.be>";

export async function sendConfirmationRequestEmail(data: {
  prenom: string;
  nom: string;
  email: string;
  service: string;
  date: string;
  creneau: string;
  adresse: string;
  commune: string;
  confirmUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "Confirmez votre rendez-vous — Laus Chauffage",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1e3a5f;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">🔥 Laus Chauffage</h1>
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #eee">
          <p>Bonjour <strong>${data.prenom} ${data.nom}</strong>,</p>
          <p>Vous avez demandé un rendez-vous. Veuillez <strong>confirmer votre demande</strong> en cliquant sur le bouton ci-dessous :</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Service</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${data.service}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Date</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${data.date}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Heure</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${data.creneau}</td></tr>
            <tr><td style="padding:8px;color:#666">Adresse</td><td style="padding:8px;font-weight:bold">${data.adresse}, ${data.commune}</td></tr>
          </table>
          <div style="text-align:center;margin:24px 0">
            <a href="${data.confirmUrl}" style="background:#c0392b;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
              ✅ Confirmer mon rendez-vous
            </a>
          </div>
          <p style="color:#999;font-size:12px;text-align:center">Ce lien est valable 24 heures. Sans confirmation, votre réservation sera annulée automatiquement.</p>
          <p style="color:#666;font-size:14px">En cas de question : <a href="tel:+32475200487" style="color:#c0392b">+32 475 20 04 87</a></p>
        </div>
      </div>
    `,
  });
}

export async function sendConfirmationEmail(data: {
  prenom: string;
  nom: string;
  email: string;
  service: string;
  date: string;
  creneau: string;
  adresse: string;
  commune: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "Votre rendez-vous est confirmé — Laus Chauffage",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1e3a5f;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">🔥 Laus Chauffage</h1>
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #eee">
          <p>Bonjour <strong>${data.prenom} ${data.nom}</strong>,</p>
          <p>Votre rendez-vous est <strong>confirmé</strong> !</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Service</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${data.service}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Date</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${data.date}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666">Heure</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">${data.creneau}</td></tr>
            <tr><td style="padding:8px;color:#666">Adresse</td><td style="padding:8px;font-weight:bold">${data.adresse}, ${data.commune}</td></tr>
          </table>
          <p style="color:#666;font-size:14px">En cas de question : <a href="tel:+32475200487" style="color:#c0392b">+32 475 20 04 87</a></p>
          <p style="color:#c0392b;font-weight:bold">Laus Chauffage</p>
        </div>
      </div>
    `,
  });
}

export async function sendContactEmail(data: { nom: string; email: string; telephone: string; message: string }) {
  await resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL!,
    replyTo: data.email,
    subject: `Message de contact — ${data.nom}`,
    html: `<p><strong>De :</strong> ${data.nom} (${data.email})</p><p><strong>Tél :</strong> ${data.telephone}</p><p><strong>Message :</strong><br/>${data.message}</p>`,
  });
}

export async function sendRappelEmail(data: {
  civilite?: string;
  prenom: string;
  nom: string;
  email: string;
  typeChaudiere: string;
  bookingUrl: string;
}) {
  const salutation = data.civilite === "Mme" ? `Madame ${data.nom}` : `Monsieur ${data.nom}`;
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `${salutation}, l'entretien de votre ${data.typeChaudiere} approche — Laus Chauffage`,
    html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

  <!-- En-tête -->
  <tr>
    <td style="background:#1e3a5f;padding:24px 32px;border-radius:10px 10px 0 0">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <span style="font-size:22px;font-weight:bold;color:white">Laus </span><span style="font-size:22px;font-weight:bold;color:#c0392b">|</span><span style="font-size:22px;font-weight:bold;color:white"> Chauffage</span>
            <div style="font-size:11px;color:#aac4e0;margin-top:3px">Votre chauffagiste en Brabant wallon</div>
          </td>
          <td align="right" style="font-size:11px;color:#cce0f5;line-height:1.7">
            +32 475 20 04 87<br>
            sebastien@laus-chauffage.be
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bandeau rappel -->
  <tr>
    <td style="background:#c0392b;padding:12px 32px">
      <span style="color:white;font-size:13px;font-weight:bold;letter-spacing:0.04em">RAPPEL D'ENTRETIEN — ${data.typeChaudiere.toUpperCase()}</span>
    </td>
  </tr>

  <!-- Corps -->
  <tr>
    <td style="background:white;padding:32px 32px 24px">
      <p style="font-size:16px;color:#1e3a5f;font-weight:bold;margin:0 0 16px">Bonjour ${salutation},</p>
      <p style="font-size:14px;color:#333;line-height:1.7;margin:0 0 16px">
        L'entretien de votre <strong>${data.typeChaudiere}</strong> arrive bientôt à échéance. Pour assurer la sécurité, les performances et la longévité de votre installation, il est important de planifier cet entretien dans les meilleurs délais.
      </p>

      <!-- Avantages -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f9fc;border-left:4px solid #c0392b;border-radius:0 6px 6px 0;padding:0;margin:20px 0">
        <tr><td style="padding:16px 20px">
          <div style="font-size:11px;font-weight:bold;color:#1e3a5f;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px">Pourquoi entretenir votre chaudière ?</div>
          ${[
            ["Sécurité", "Prévenez les risques liés au monoxyde de carbone."],
            ["Performance", "Un appareil entretenu consomme moins d'énergie."],
            ["Durabilité", "Prolongez la vie de votre installation."],
            ["Obligation légale", "L'entretien est obligatoire en Belgique."],
          ].map(([titre, desc]) => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:8px"><tr>
            <td width="10" valign="top" style="padding-top:5px"><div style="width:8px;height:8px;border-radius:50%;background:#c0392b"></div></td>
            <td style="padding-left:10px;font-size:13px;color:#333;line-height:1.5"><strong style="color:#1e3a5f">${titre}</strong> — ${desc}</td>
          </tr></table>`).join("")}
        </td></tr>
      </table>

      <p style="font-size:14px;color:#333;line-height:1.7;margin:0 0 24px">
        Nos créneaux se remplissent vite. Réservez dès maintenant en un clic :
      </p>

      <!-- Bouton CTA -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:8px 0 24px">
          <a href="${data.bookingUrl}?service=entretien" style="display:inline-block;background:#c0392b;color:white;text-decoration:none;font-weight:bold;font-size:15px;padding:14px 36px;border-radius:8px;letter-spacing:0.02em">
            Prendre rendez-vous en ligne
          </a>
        </td></tr>
      </table>

      <!-- Contact alternatif -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;padding-top:20px;margin-top:4px">
        <tr>
          <td align="center" style="font-size:13px;color:#555;padding-bottom:6px">
            Ou contactez-nous directement :
          </td>
        </tr>
        <tr>
          <td align="center">
            <a href="tel:+32475200487" style="display:inline-block;border:2px solid #1e3a5f;color:#1e3a5f;text-decoration:none;font-weight:bold;font-size:14px;padding:9px 24px;border-radius:7px;margin-top:6px">
              +32 475 20 04 87
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Signature -->
  <tr>
    <td style="background:#f7f9fc;padding:20px 32px;border-top:1px solid #e0e8f0">
      <p style="margin:0 0 4px;font-size:13px;color:#555">Cordialement,</p>
      <p style="margin:0;font-size:14px;font-weight:bold;color:#1e3a5f">Sébastien Laus</p>
      <p style="margin:0;font-size:12px;color:#888">Laus Chauffage</p>
    </td>
  </tr>

  <!-- Pied -->
  <tr>
    <td style="background:#1e3a5f;padding:12px 32px;border-radius:0 0 10px 10px;text-align:center">
      <p style="margin:0;font-size:10px;color:#aac4e0">
        Laus Chauffage — Route de Bruxelles, 17 — 1430 Rebecq<br>
        <a href="${data.bookingUrl}" style="color:#c0392b;text-decoration:none">www.laus-chauffage.be</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  });
}
