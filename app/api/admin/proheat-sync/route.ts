import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { format, subMonths, parse, addYears } from "date-fns";

const PROHEAT_BASE = "https://api.testocloud.be/expose";

async function fetchInChunks(endpoint: string, secretKey: string, months = 36) {
  const to = new Date();
  const from = subMonths(to, months);
  const results: any[] = [];
  let cursor = new Date(from);

  while (cursor < to) {
    const chunkEnd = new Date(cursor);
    chunkEnd.setDate(chunkEnd.getDate() + 14);
    if (chunkEnd > to) chunkEnd.setTime(to.getTime());

    const fromStr = format(cursor, "dd-MM-yyyy");
    const toStr = format(chunkEnd, "dd-MM-yyyy");

    const res = await fetch(
      `${PROHEAT_BASE}/${endpoint}?from_date=${fromStr}&to_date=${toStr}&language=fr`,
      { headers: { "X-expose-secret-key": secretKey, "Content-Type": "application/json" } }
    );

    if (!res.ok) throw new Error(`ProHeat API error ${res.status} on ${endpoint}`);
    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      for (const item of data.data) {
        if (!results.find((x) => x.id === item.id)) results.push(item);
      }
    }

    cursor.setDate(cursor.getDate() + 15);
  }

  return results;
}

function parseName(fullName: string) {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return { prenom: "", nom: parts[0] };
  return { prenom: parts[0], nom: parts.slice(1).join(" ") };
}

function parseProheatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    // ProHeat returns dates as "22-04-2020"
    const d = parse(dateStr, "dd-MM-yyyy", new Date());
    return format(d, "yyyy-MM-dd");
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { secretKey } = await req.json();
    if (!secretKey) return NextResponse.json({ error: "Clé API manquante" }, { status: 400 });

    // Fetch clients (last 36 months) and certificates (last 36 months) in parallel
    const [clients, certs] = await Promise.all([
      fetchInChunks("pull-client", secretKey, 36),
      fetchInChunks("pull-certificates", secretKey, 36),
    ]);

    // Build a map: proheat client_id → most recent certification_date + next_certification_date
    const certMap = new Map<number, { dernier: string; prochain: string | null }>();
    for (const cert of certs) {
      const clientId = cert.client_id;
      const certDate = parseProheatDate(cert.certification_date);
      const nextDate = parseProheatDate(cert.next_certification_date);
      if (!certDate) continue;

      const existing = certMap.get(clientId);
      if (!existing || certDate > existing.dernier) {
        certMap.set(clientId, { dernier: certDate, prochain: nextDate });
      }
    }

    const sb = getSupabase();
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const c of clients) {
      if (!c.name || !c.phone) { skipped++; continue; }

      const { prenom, nom } = parseName(c.name);
      const phone = (c.phone || "").replace(/\s/g, "");
      const dates = certMap.get(c.id);

      const contactFields = {
        email: c.email || undefined,
        telephone: phone,
        adresse: c.address || c.street || "",
        commune: c.city || "",
        code_postal: c.postal_code || "",
        ...(dates ? {
          dernier_entretien: dates.dernier,
          prochain_entretien: dates.prochain,
        } : {}),
      };

      // Check if already exists by proheat_id
      const { data: existing } = await sb
        .from("clients")
        .select("id")
        .eq("proheat_id", String(c.id))
        .maybeSingle();

      if (existing) {
        await sb.from("clients").update(contactFields).eq("id", existing.id);
        updated++;
      } else {
        // Check by phone to avoid duplicates
        const { data: byPhone } = await sb
          .from("clients")
          .select("id")
          .eq("telephone", phone)
          .maybeSingle();

        if (byPhone) {
          await sb.from("clients").update({ proheat_id: String(c.id), ...contactFields }).eq("id", byPhone.id);
          updated++;
        } else {
          await sb.from("clients").insert({
            proheat_id: String(c.id),
            prenom: prenom || "—",
            nom,
            email: c.email || null,
            telephone: phone,
            adresse: c.address || c.street || "—",
            commune: c.city || "—",
            code_postal: c.postal_code || null,
            type_chaudiere: "gaz",
            ...(dates ? {
              dernier_entretien: dates.dernier,
              prochain_entretien: dates.prochain,
            } : {}),
          });
          created++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: clients.length,
      created,
      updated,
      skipped,
      certsSynced: certMap.size,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur sync" }, { status: 500 });
  }
}
