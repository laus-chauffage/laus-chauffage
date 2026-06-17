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
  prenom: string;
  nom: string;
  email: string;
  typeChaudiere: string;
  bookingUrl: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: "Il est temps de planifier votre entretien — Laus Chauffage",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1e3a5f;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:20px">🔥 Laus Chauffage</h1>
        </div>
        <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px;border:1px solid #eee">
          <p>Bonjour <strong>${data.prenom} ${data.nom}</strong>,</p>
          <p>L'entretien de votre <strong>${data.typeChaudiere}</strong> arrive à échéance. Un entretien régulier garantit la sécurité et les performances de votre installation.</p>
          <div style="text-align:center;margin:24px 0">
            <a href="${data.bookingUrl}" style="background:#c0392b;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px">
              Réserver mon entretien en ligne
            </a>
          </div>
          <p style="color:#666;font-size:14px">Ou appelez-nous au <a href="tel:+32475200487" style="color:#c0392b">+32 475 20 04 87</a>.</p>
          <p style="color:#c0392b;font-weight:bold">Laus Chauffage</p>
        </div>
      </div>
    `,
  });
}
