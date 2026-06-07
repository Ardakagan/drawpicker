import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const secret = process.env.DODO_WEBHOOK_SECRET;
    const incomingSecret = req.headers.get("x-webhook-secret");

    if (!secret) {
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }
    if (incomingSecret !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const supabase = getSupabaseAdmin();

    const eventType = body.type || body.event_type;
    const metadata = body.data?.metadata || body.metadata || {};
    const userId = metadata.user_id;
    const plan = metadata.plan;
    const interval = metadata.interval || "monthly";
    const mode = metadata.mode === "one_time" ? "one_time" : "subscription";
    const subscriptionId = body.data?.id || body.subscription_id;

    const validPlans = ["starter", "pro", "business", "diamond", "free"];
    const normalizedPlan = typeof plan === "string" ? plan.toLowerCase().trim() : undefined;

    if (!userId || !normalizedPlan || !validPlans.includes(normalizedPlan)) {
      return NextResponse.json({ received: true });
    }

    function periodEndFrom(now: Date) {
      const end = new Date(now);
      if (interval === "yearly") end.setFullYear(end.getFullYear() + 1);
      else end.setMonth(end.getMonth() + 1);
      return end;
    }

    // Ödeme başarılı / abonelik aktif (hem abonelik hem tek seferlik buraya düşer)
    if (
      eventType === "payment.succeeded" ||
      eventType === "subscription.active" ||
      eventType === "subscription.activated" ||
      eventType === "checkout.completed"
    ) {
      const now = new Date();
      const periodStart = now;
      const periodEnd = periodEndFrom(now);

      const update: any = {
        plan: normalizedPlan,
        plan_type: mode, // "subscription" | "one_time"
        subscription_status: mode === "one_time" ? "one_time" : "active",
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        credits: 0,
        free_used: true,
      };

      // Abonelikte sonraki ödeme = dönem sonu; tek seferlikte sonraki ödeme yok
      if (mode === "subscription") {
        update.subscription_id = subscriptionId;
        update.next_billing_date = periodEnd.toISOString();
      } else {
        update.subscription_id = null;
        update.next_billing_date = null;
      }

      await supabase.from("users").update(update).eq("id", userId);
    }

    // Abonelik iptal (tek seferlikte bu event gelmez)
    if (eventType === "subscription.cancelled" || eventType === "subscription.canceled") {
      await supabase
        .from("users")
        .update({ plan: "free", plan_type: "subscription", subscription_status: "cancelled", next_billing_date: null })
        .eq("id", userId);
    }

    // Abonelik yenilendi
    if (eventType === "subscription.renewed") {
      const now = new Date();
      const periodEnd = periodEndFrom(now);

      await supabase
        .from("users")
        .update({
          subscription_status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          next_billing_date: periodEnd.toISOString(),
          draws_this_month: 0,
          draws_reset_at: now.toISOString(),
        })
        .eq("id", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
