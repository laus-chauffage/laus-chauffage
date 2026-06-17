import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { deleteCalendarEvent } from "@/lib/google-calendar";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const sb = getSupabase();

  const { data: resa, error } = await sb.from("reservations").select("google_event_id").eq("id", id).single();
  if (error || !resa) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });

  if (resa.google_event_id) {
    try {
      await deleteCalendarEvent(resa.google_event_id);
    } catch (err) {
      console.error("Google Calendar delete error:", err);
    }
  }

  await sb.from("reservations").update({ statut: "annule" }).eq("id", id);

  return NextResponse.json({ success: true });
}
