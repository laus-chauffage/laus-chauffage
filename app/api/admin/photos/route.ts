import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const sb = getSupabase();
  const { data, error } = await sb.storage.from("photos").list("", { sortBy: { column: "created_at", order: "desc" } });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const photos = (data || []).map((file) => ({
    name: file.name,
    url: sb.storage.from("photos").getPublicUrl(file.name).data.publicUrl,
  }));

  return NextResponse.json({ photos });
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  const { error } = await getSupabase().storage.from("photos").remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
