import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const label = formData.get("label") as string;

  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${label.replace(/\s+/g, "-").toLowerCase()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await getSupabase().storage.from("photos").upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const url = getSupabase().storage.from("photos").getPublicUrl(fileName).data.publicUrl;
  return NextResponse.json({ success: true, url, name: fileName });
}
