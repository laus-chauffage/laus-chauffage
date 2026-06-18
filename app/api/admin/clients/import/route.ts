import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Parse CSV complet en gérant les champs multi-lignes entre guillemets
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  // Supprime le BOM UTF-8 éventuel
  const input = text.replace(/^﻿/, "");

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(field.trim()); field = ""; }
      else if (ch === '\n') {
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = "";
      } else if (ch === '\r') {
        // ignore \r
      } else {
        field += ch;
      }
    }
  }
  if (field || row.length) { row.push(field.trim()); rows.push(row); }
  return rows;
}

function get(cols: string[], i: number): string {
  return i >= 0 && cols[i] ? cols[i].replace(/"/g, "").trim() : "";
}

function firstValue(val: string): string {
  // Gère les valeurs multiples séparées par " ::: "
  return val.split(" ::: ")[0].trim();
}

export async function POST(req: NextRequest) {
  let text = "";
  try { text = await req.text(); } catch (e) {
    return NextResponse.json({ error: "Impossible de lire le fichier" }, { status: 400 });
  }

  try {
  const rows = parseCSV(text);

  if (rows.length < 2) {
    return NextResponse.json({ error: "Fichier vide ou illisible" }, { status: 400 });
  }

  const headers = rows[0].map(h => h.replace(/"/g, "").trim());
  const idx = (...names: string[]) => {
    for (const name of names) {
      const i = headers.findIndex(h => h === name);
      if (i >= 0) return i;
    }
    return -1;
  };

  const iFirst  = idx("First Name", "Given Name");
  const iLast   = idx("Last Name", "Family Name");
  const iEmail  = idx("E-mail 1 - Value");
  const iPhone  = idx("Phone 1 - Value");
  const iStreet    = idx("Address 1 - Street");
  const iCity      = idx("Address 1 - City");
  const iRegion    = idx("Address 1 - Region");
  const iPostalCode = idx("Address 1 - Postal Code");

  const clients = [];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i];
    if (!cols || cols.every(c => !c)) continue;

    const prenom = get(cols, iFirst);
    const nom = get(cols, iLast);
    if (!prenom && !nom) continue;

    const telephone = firstValue(get(cols, iPhone)).replace(/\s/g, "");
    const adresseRaw = get(cols, iStreet);
    // Nettoie les sauts de ligne éventuels dans l'adresse
    const adresse = adresseRaw.replace(/\n/g, ", ").replace(/,\s*,/g, ",").trim();
    const commune = get(cols, iCity) || get(cols, iRegion);

    clients.push({
      prenom: prenom || "—",
      nom: nom || "—",
      email: get(cols, iEmail) || null,
      telephone: telephone || "—",
      adresse: adresse || "—",
      code_postal: get(cols, iPostalCode) || null,
      commune: commune || "—",
      type_chaudiere: "mazout",
      dernier_entretien: null,
      prochain_entretien: null,
      mode_contact: "email",
    });
  }

  if (clients.length === 0) {
    return NextResponse.json({
      error: "Aucun contact trouvé. Vérifiez que le fichier est bien un export Google CSV.",
    }, { status: 400 });
  }

  const sb = getSupabase();
  let inserted = 0;
  let skipped = 0;

  for (const client of clients) {
    const { data: existing } = await sb
      .from("clients")
      .select("id")
      .eq("nom", client.nom)
      .eq("prenom", client.prenom)
      .maybeSingle();

    if (existing) { skipped++; continue; }

    const { error } = await sb.from("clients").insert(client);
    if (!error) inserted++;
  }

  return NextResponse.json({ inserted, skipped });

  } catch (e: any) {
    console.error("Import CSV error:", e);
    return NextResponse.json({ error: e?.message || "Erreur inconnue" }, { status: 500 });
  }
}
