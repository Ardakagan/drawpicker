import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getPlanByDodoProductId } from "@/lib/plans";

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
    const metadataPlan = typeof metadata.plan === "string" ? metadata.plan.toLowerCase().trim() : undefined;
    const interval = metadata.interval || "monthly";
    const mode = metadata.mode === "one_time" ? "one_time" : "subscription";
    const subscriptionId = body.data?.id || body.subscription_id;

    // Idempotency: derive a unique event/payment id from common locations
    const eventId =
      body.id ||
      body.event_id ||
      body.data?.id ||
      body.data?.payment_id ||
      body.data?.checkout_id ||
      body.payment_id ||
      body.checkout_id ||
      null;

    if (eventId) {
      const { error: eventInsertError } = await supabase
        .from("webhook_events")
        .insert({ id: String(eventId), provider: "dodo", event_type: eventType || "unknown" });

      if (eventInsertError) {
        // Postgres unique violation
        if (String((eventInsertError as any).code) === "23505") {
          return NextResponse.json({ received: true, duplicate: true });
        }
        console.error("WEBHOOK EVENT INSERT ERROR:", eventInsertError);
        return NextResponse.json({ error: "Webhook event log failed" }, { status: 500 });
      }
    } else {
      console.warn("Webhook event id missing; idempotency skipped");
    }

    // Try to derive product_id from common payload locations
    const productIdRaw =
      body.data?.product_id ||
      body.data?.product?.id ||
      body.data?.items?.[0]?.product_id ||
      body.data?.product_cart?.[0]?.product_id ||
      body.product_id ||
      body.product?.id ||
      null;

    const productId = productIdRaw ? String(productIdRaw).trim() : null;

    let planFromProduct: string | null = null;
    if (productId) {
      planFromProduct = getPlanByDodoProductId(productId);
      if (!planFromProduct) {
        // Unknown product - do not upgrade user
        return NextResponse.json({ received: true, ignored: "unknown_product" });
      }
    }

    // Allowed metadata plan values (legacy product matching is authoritative)
    const allowedMetadataPlans = ["bronze", "silver", "gold", "diamond", "free"];

    const normalizedPlan = planFromProduct || (allowedMetadataPlans.includes(metadataPlan || "") ? metadataPlan : undefined);

    if (!userId || !normalizedPlan) {
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
