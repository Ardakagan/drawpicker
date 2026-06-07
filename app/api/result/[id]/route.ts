import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params?.id;

    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json({ result: null }, { status: 404 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("draw_results")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("RESULT FETCH ERROR:", error);
      return NextResponse.json({ result: null }, { status: 500 });
    }

    return NextResponse.json({ result: data || null });
  } catch (err: any) {
    console.error("RESULT API ERROR:", err);
    return NextResponse.json({ result: null }, { status: 500 });
  }
}
