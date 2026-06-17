import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("disponibilites")
    .select("*")
    .order("service_type")
    .order("jour")
    .order("heure");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ disponibilites: data });
}

export async function POST(req: NextRequest) {
  const { service_type, jour, heure, actif } = await req.json();
  const supabase = getSupabase();

  const { error } = await supabase
    .from("disponibilites")
    .update({ actif })
    .eq("service_type", service_type)
    .eq("jour", jour)
    .eq("heure", heure);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
