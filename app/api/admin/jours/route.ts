import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const service = req.nextUrl.searchParams.get("service");
  const serviceType = service === "installation" ? "devis" : service ? "entretien" : null;
  const supabase = getSupabase();

  let query = supabase.from("jours_config").select("*").order("service_type").order("jour");
  if (serviceType) query = query.eq("service_type", serviceType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ jours: data });
}

export async function POST(req: NextRequest) {
  const { service_type, jour, actif } = await req.json();
  const supabase = getSupabase();

  const { error } = await supabase
    .from("jours_config")
    .update({ actif })
    .eq("service_type", service_type)
    .eq("jour", jour);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
