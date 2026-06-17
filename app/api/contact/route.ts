import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await sendContactEmail(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }
}
