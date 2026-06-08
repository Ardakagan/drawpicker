import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PLANS, type PlanKey, getDodoProductId } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { plan, interval = "monthly", mode = "subscription" } = await req.json();

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "login_required" }, { status: 401 });
    }

    // Rate limiting: max 10 checkout requests per user per 10 minutes
    try {
      const windowMinutes = 10;
      const now = new Date();

      const { data: rlRow, error: rlSelectError } = await supabase
        .from("checkout_rate_limits")
        .select("user_id, request_count, window_start")
        .eq("user_id", user.id)
        .maybeSingle();

      if (rlSelectError) {
        console.error("RATE LIMIT SELECT ERROR:", rlSelectError);
        return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
      }

      if (!rlRow) {
        const { error: insertErr } = await supabase.from("checkout_rate_limits").insert({
          user_id: user.id,
          request_count: 1,
          window_start: now.toISOString(),
        });
        if (insertErr) {
          console.error("RATE LIMIT INSERT ERROR:", insertErr);
          return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
        }
      } else {
        const windowStart = new Date(rlRow.window_start || now.toISOString());
        const windowEnd = new Date(windowStart.getTime() + windowMinutes * 60 * 1000);

        if (now > windowEnd) {
          // Window expired -> reset
          const { error: resetErr } = await supabase
            .from("checkout_rate_limits")
            .update({ request_count: 1, window_start: now.toISOString() })
            .eq("user_id", user.id);
          if (resetErr) {
            console.error("RATE LIMIT RESET ERROR:", resetErr);
            return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
          }
        } else {
          // Window active
          const count = Number(rlRow.request_count || 0);
          if (count >= 10) {
            return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
          }

          const { error: incErr } = await supabase
            .from("checkout_rate_limits")
            .update({ request_count: count + 1 })
            .eq("user_id", user.id);
          if (incErr) {
            console.error("RATE LIMIT INC ERROR:", incErr);
            return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
          }
        }
      }
    } catch (e) {
      console.error("RATE LIMIT UNKNOWN ERROR:", e);
      return NextResponse.json({ error: "rate_limit_check_failed" }, { status: 500 });
    }

    const planData = PLANS[plan as PlanKey];
    if (!planData) {
      return NextResponse.json({ error: "Geçersiz plan" }, { status: 400 });
    }

    // Do not create checkout for the free plan
    if (plan === "free") {
      return NextResponse.json({ error: "Cannot create checkout for free plan" }, { status: 400 });
    }

    const billingMode: "subscription" | "one_time" =
      mode === "one_time" ? "one_time" : "subscription";
    const billingInterval: "monthly" | "yearly" =
      interval === "yearly" ? "yearly" : "monthly";

    const productId = getDodoProductId(plan, billingMode, billingInterval);
    if (!productId) {
      return NextResponse.json(
        {
          error:
            billingMode === "one_time"
              ? "Bu plan için tek seferlik ürün henüz tanımlı değil."
              : "Dodo Product ID eksik",
        },
        { status: 500 }
      );
    }

    const apiKey = process.env.DODO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DODO_API_KEY eksik" }, { status: 500 });
    }

    const endpoint = "https://live.dodopayments.com/checkouts";

    const payload: any = {
      customer: {
        email: user.email,
        name: user.email?.split("@")[0] || "Customer",
        create_new_customer: false,
      },
      product_cart: [{ product_id: productId, quantity: 1 }],
      return_url: "https://drawpicker.io/dashboard?payment=success",
      metadata: {
        user_id: user.id,
        plan: plan,
        interval: billingInterval,
        mode: billingMode,
      },
    };

    const dodoRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const dodoData = await dodoRes.json();

    if (!dodoRes.ok) {
      console.error("DODO ERROR:", dodoData);
      return NextResponse.json(
        { error: "Ödeme sistemi hatası: " + JSON.stringify(dodoData) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl:
        dodoData.checkout_url ||
        dodoData.payment_link ||
        dodoData.url ||
        dodoData.checkout?.url,
    });
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
