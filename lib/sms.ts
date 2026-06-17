import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSmsConfirmation(data: {
  telephone: string;
  prenom: string;
  service: string;
  date: string;
  creneau: string;
}) {
  const to = data.telephone.startsWith("+") ? data.telephone : `+32${data.telephone.replace(/^0/, "")}`;

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: `Bonjour ${data.prenom}, votre RDV Laus Chauffage est confirmé pour le ${data.date} à ${data.creneau} (${data.service}). Info : +32 475 20 04 87`,
  });
}

export async function sendSmsRappel24h(data: {
  telephone: string;
  prenom: string;
  date: string;
  creneau: string;
}) {
  const to = data.telephone.startsWith("+") ? data.telephone : `+32${data.telephone.replace(/^0/, "")}`;

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: `Rappel Laus Chauffage : votre rendez-vous est demain ${data.date} à ${data.creneau}. Info : +32 475 20 04 87`,
  });
}
