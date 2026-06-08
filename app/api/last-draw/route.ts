import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("draw_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    const last = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return NextResponse.json({ success: true, lastDraw: last }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ success: false, lastDraw: null });
  }
}
