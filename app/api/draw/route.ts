import { NextResponse } from "next/server";
import { applyLocalFilters } from "@/lib/filters";
import { userKey } from "@/lib/utils";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { DrawRequest, User } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function cert() {
  return (
    "DP-" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
}

export async function POST(req: Request) {
  try {
    const body: DrawRequest = await req.json();

    const {
      users,
      winnerCount,
      backupCount,
      filters,
      platform,
    } = body;

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "No users found" },
        { status: 400 }
      );
    }

    let filtered: User[] = applyLocalFilters(users, filters);

    filtered = filtered.filter(
      (u, i, arr) =>
        arr.findIndex((x) => userKey(x) === userKey(u)) === i
    );

    const mixed = shuffle(filtered);

    const winners = mixed.slice(0, winnerCount || 1);

    const backups = mixed.slice(
      winnerCount || 1,
      (winnerCount || 1) + (backupCount || 0)
    );

    const certCode = cert();

    const drawId = crypto.randomUUID();

    const supabaseAdmin = getSupabaseAdmin();

    const { error: saveError } = await supabaseAdmin
      .from("draw_results")
      .insert({
        id: drawId,
        platform: platform || "instagram",
        total: filtered.length,
        winners,
        backups,
        cert_code: certCode,
        created_at: new Date().toISOString(),
      });

    if (saveError) {
      console.error(saveError);

      return NextResponse.json(
        {
          error: "Failed to save result",
          details: saveError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      drawId,
      certCode,
      total: filtered.length,
      winners,
      backups,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}