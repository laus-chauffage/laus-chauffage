import { NextRequest, NextResponse } from "next/server";
import { getMonthEvents } from "@/lib/google-calendar";

export async function GET(req: NextRequest) {
  const year = parseInt(req.nextUrl.searchParams.get("year") || "");
  const month = parseInt(req.nextUrl.searchParams.get("month") || "");
  if (!year || !month) return NextResponse.json({ error: "year et month requis" }, { status: 400 });
  try {
    const events = await getMonthEvents(year, month);
    return NextResponse.json({ events });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
