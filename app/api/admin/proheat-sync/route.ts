import { NextRequest, NextResponse } from "next/server";
import { getSupabase, calcProchainEntretien } from "@/lib/supabase";
import { format, subDays, parse } from "date-fns";

const PROHEAT_BASE = "https://api.testocloud.be/expose";

async function fetchJson(url: string, secretKey: string) {
  const res = await fetch(url, {
    headers: { "X-expose-secret-key": secretKey, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ProHeat API error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const buf = await res.arrayBuffer();
  const text = new TextDecoder("windows-1252").decode(buf);
  return JSON.parse(text);
}

async function fetchCertsRange(secretKey: string, from: Date, to: Date) {
  const fromStr = format(from, "dd-MM-yyyy");
  const toStr = format(to, "dd-MM-yyyy");
  const data = await fetchJson(`${PROHEAT_BASE}/pull-certificates?from_date=${fromStr}&to_date=${toStr}&language=fr`, secretKey);
  return data.success && Array.isArray(data.data) ? data.data : [];
}

async function fetchCerts(secretKey: string, days = 14) {
  const to = new Date();
  const from = subDays(to, days);
  if (days <= 14) return fetchCertsRange(secretKey, from, to);

  // Chunks de 14 jours max (limite API ProHeat = 15 jours)
  const allCerts: any[] = [];
  const fromTs = from.getTime();
  let chunkEndTs = to.getTime();
  while (chunkEndTs > fromTs) {
    const chunkStartTs = Math.max(chunkEndTs - 14 * 24 * 60 * 60 * 1000, fromTs);
    const chunk = await fetchCertsRange(secretKey, new Date(chunkStartTs), new Date(chunkEndTs));
    allCerts.push(...chunk);
    chunkEndTs = chunkStartTs - 24 * 60 * 60 * 1000;
    await new Promise(r => setTimeout(r, 500));
  }
  return allCerts;
}

async function fetchClientById(secretKey: string, clientId: number, certDate: string) {
  // certDate is in "dd-MM-yyyy" format (ProHeat format)
  const data = await fetchJson(`${PROHEAT_BASE}/pull-client?from_date=${certDate}&to_date=${certDate}&language=fr`, secretKey);
  if (!data.success || !Array.isArray(data.data)) return null;
  return data.data.find((c: any) => c.id === clientId) || null;
}

function parseProheatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = parse(dateStr, "dd-MM-yyyy", new Date());
    return format(d, "yyyy-MM-dd");
  } catch {
    return null;
  }
}

function parseName(fullName: string) {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return { prenom: "", nom: parts[0] };
  return { prenom: parts[0], nom: parts.slice(1).join(" ") };
}

function parseTypeChaudiere(fuel: string | null | undefined): "mazout" | "gaz" {
  if (String(fuel) === "2") return "gaz";
  return "mazout";
}

// Appelé par le cron Vercel chaque lundi matin
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return runSync(14);
}

async function runSync(days: number) {
  try {
    const secretKey = process.env.PROHEAT_API_KEY;
    if (!secretKey) return NextResponse.json({ error: "Clé API non configurée" }, { status: 500 });

    const certs = await fetchCerts(secretKey, days);

    const sb = getSupabase();
    let updated = 0;
    let created = 0;
    let skipped = 0;

    for (const cert of certs) {
      const certDate = parseProheatDate(cert.certification_date);
      if (!certDate) { skipped++; continue; }

      // Cherche le client par proheat_id
      const { data: existing } = await sb
        .from("clients")
        .select("id, type_chaudiere, dernier_entretien")
        .eq("proheat_id", String(cert.client_id))
        .maybeSingle();

      if (existing) {
        // Met à jour seulement si la certification est plus récente
        if (existing.dernier_entretien && existing.dernier_entretien >= certDate) { skipped++; continue; }
        const prochain = calcProchainEntretien(certDate, existing.type_chaudiere);
        await sb.from("clients").update({
          dernier_entretien: certDate,
          prochain_entretien: prochain,
        }).eq("id", existing.id);
        updated++;
      } else {
        // Nouveau client → récupère ses infos depuis ProHeat (on passe la date du cert pour le retrouver)
        await new Promise(r => setTimeout(r, days > 30 ? 1000 : 300));
        const c = await fetchClientById(secretKey, cert.client_id, cert.certification_date);
        if (!c || !c.name) { skipped++; continue; }

        const { prenom, nom } = parseName(c.name);
        const phone = (c.phone || "").replace(/\s/g, "");
        const fuel = c.heating_appliance?.[0]?.wallonie?.fuel;
        const type_chaudiere = parseTypeChaudiere(fuel);
        const prochain = calcProchainEntretien(certDate, type_chaudiere);

        // Vérifie si déjà en base par téléphone
        const { data: byPhone } = phone ? await sb
          .from("clients").select("id").eq("telephone", phone).maybeSingle()
          : { data: null };

        if (byPhone) {
          await sb.from("clients").update({
            proheat_id: String(c.id),
            dernier_entretien: certDate,
            prochain_entretien: prochain,
            type_chaudiere,
          }).eq("id", byPhone.id);
          updated++;
        } else {
          const { error: insertError } = await sb.from("clients").insert({
            proheat_id: String(c.id),
            prenom: prenom || "—",
            nom,
            email: c.email || null,
            telephone: phone || "—",
            rue: c.address || "—",
            numero: c.house_no || null,
            commune: c.city || "—",
            code_postal: c.postal_code || null,
            type_chaudiere,
            dernier_entretien: certDate,
            prochain_entretien: prochain,
          });
          if (insertError) {
            console.error("Insert error:", insertError.message);
            skipped++;
          } else {
            created++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      certs_found: certs.length,
      updated,
      created,
      skipped,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur sync" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return runSync(body.days ?? 14);
}
