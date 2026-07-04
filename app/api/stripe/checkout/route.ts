import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/credits";

export const runtime = "nodejs";

const PLANS: Record<string, { credits: number; priceEnvKey: string }> = {
  pro:    { credits: 180, priceEnvKey: "STRIPE_PRICE_PRO" },
  acente: { credits: 450, priceEnvKey: "STRIPE_PRICE_ACENTE" },
};

function stripe() {
  const key = (process.env.STRIPE_SECRET_KEY ?? "").replace(/\s/g, "");
  if (!key) throw new Error("STRIPE_SECRET_KEY ayarlanmamış");
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export async function POST(req: NextRequest) {
  let plan: string;
  try {
    const body = await req.json() as { plan?: string };
    plan = body.plan ?? "";
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const planConfig = PLANS[plan];
  if (!planConfig) return NextResponse.json({ error: "Geçersiz plan: pro veya acente olmalı" }, { status: 400 });

  const priceId = (process.env[planConfig.priceEnvKey] ?? "").trim();
  if (!priceId) return NextResponse.json({ error: `${planConfig.priceEnvKey} ayarlanmamış` }, { status: 500 });

  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://vista-umber-mu.vercel.app").trim().replace(/\/$/, "");

  try {
    const s = stripe();
    const session = await s.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id: user.id, plan },
      subscription_data: { metadata: { user_id: user.id, plan } },
      success_url: `${appUrl}/settings?payment=success&plan=${plan}`,
      cancel_url: `${appUrl}/settings`,
      customer_email: user.email ?? undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe/checkout]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
