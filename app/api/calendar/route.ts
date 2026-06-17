import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/google-calendar";
import { getSupabase } from "@/lib/supabase";

const ALL_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00"];

function getServiceType(service: string | null): "entretien" | "devis" {
  return service === "installation" ? "devis" : "entretien";
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date requis" }, { status: 400 });

  const service = req.nextUrl.searchParams.get("service");
  const serviceType = getServiceType(service);
  const jour = new Date(date).getDay(); // 1=lun ... 5=ven

  try {
    const supabase = getSupabase();

    const { data } = await supabase
      .from("disponibilites")
      .select("heure")
      .eq("service_type", serviceType)
      .eq("jour", jour)
      .eq("actif", true)
      .order("heure");

    const configuredSlots = data?.map((r: { heure: string }) => r.heure) ?? ALL_SLOTS;

    if (configuredSlots.length === 0) {
      return NextResponse.json({ available: [] });
    }

    const available = await getAvailableSlots(date);
    const filtered = available.filter((s) => configuredSlots.includes(s));

    return NextResponse.json({ available: filtered });
  } catch (err: any) {
    console.error("Calendar error:", err?.message || err);
    return NextResponse.json({ available: ALL_SLOTS, error: err?.message });
  }
}
