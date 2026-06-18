import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { addYears, subWeeks, isBefore, parseISO } from "date-fns";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});

export function calcProchainEntretien(dernierEntretien: string, type: "mazout" | "gaz"): string {
  const date = parseISO(dernierEntretien);
  const prochain = type === "mazout" ? addYears(date, 1) : addYears(date, 2);
  return prochain.toISOString().split("T")[0];
}

export function calcStatut(prochainEntretien: string | null): "ok" | "bientot" | "en_retard" {
  if (!prochainEntretien) return "ok";
  const prochain = parseISO(prochainEntretien);
  const now = new Date();
  const seuil = subWeeks(prochain, 6);

  if (isBefore(prochain, now)) return "en_retard";
  if (isBefore(seuil, now)) return "bientot";
  return "ok";
}
