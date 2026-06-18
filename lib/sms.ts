import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM = process.env.TWILIO_FROM || process.env.TWILIO_PHONE_NUMBER;

function formatPhone(tel: string): string {
  const digits = tel.replace(/\D/g, "");
  if (digits.startsWith("32")) return `+${digits}`;
  if (digits.startsWith("0")) return `+32${digits.slice(1)}`;
  return `+32${digits}`;
}

export async function sendSmsConfirmation(data: {
  telephone: string;
  prenom: string;
  service: string;
  date: string;
  creneau: string;
}) {
  const to = data.telephone.startsWith("+") ? data.telephone : `+32${data.telephone.replace(/^0/, "")}`;

  await client.messages.create({
    from: FROM,
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
    from: FROM,
    to,
    body: `Rappel Laus Chauffage : votre rendez-vous est demain ${data.date} à ${data.creneau}. Info : +32 475 20 04 87`,
  });
}

export async function sendRappelEntretienSMS(data: {
  civilite?: string;
  prenom: string;
  nom: string;
  telephone: string;
  prochain_entretien?: string;
}) {
  const salutation = data.civilite === "Mme" ? `Madame ${data.nom}` : `Monsieur ${data.nom}`;
  const date = data.prochain_entretien
    ? ` prévu en ${new Date(data.prochain_entretien).toLocaleDateString("fr-BE", { month: "long", year: "numeric" })}`
    : "";

  await client.messages.create({
    from: FROM,
    to: formatPhone(data.telephone),
    body: `Bonjour ${salutation}, votre entretien chaudière annuel${date} approche. Prenez RDV sur www.laus-chauffage.be ou appelez le +32 475 20 04 87. — Laus Chauffage`,
  });
}
