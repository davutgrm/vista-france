import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Credits granted per plan on activation or renewal
const PLAN_CREDITS: Record<string, number> = {
  pro: 180,
  acente: 450,
  solo: 20,
};

function stripe() {
  const key = (process.env.STRIPE_SECRET_KEY ?? "").replace(/\s/g, "");
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

async function applyPlan(userId: string, plan: string) {
  const credits = PLAN_CREDITS[plan] ?? 20;
  const admin = await createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ plan, credits, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) console.error("[stripe/webhook] DB update error:", error);
  else console.log("[stripe/webhook] plan applied:", plan, "credits:", credits, "user:", userId);
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY non configurée" }, { status: 500 });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET non configurée" }, { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "En-tête stripe-signature manquant" }, { status: 400 });

  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    console.error("[stripe/webhook] signature error:", e);
    return NextResponse.json({ error: "Échec de la vérification de la signature du webhook" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        if (userId && plan) await applyPlan(userId, plan);
        break;
      }
      case "invoice.payment_succeeded": {
        // Subscription renewal — replenish credits
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        // billing_reason 'subscription_create' is already handled by checkout.session.completed
        if (invoice.billing_reason === "subscription_create") break;
        const subId: string | null = typeof invoice.subscription === "string"
          ? invoice.subscription
          : (invoice.subscription?.id ?? null);
        if (!subId) break;
        const sub = await stripe().subscriptions.retrieve(subId);
        const userId = sub.metadata?.user_id;
        const plan = sub.metadata?.plan;
        if (userId && plan) await applyPlan(userId, plan);
        break;
      }
      case "customer.subscription.deleted": {
        // Cancellation → downgrade to solo
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) await applyPlan(userId, "solo");
        break;
      }
    }
  } catch (e) {
    console.error("[stripe/webhook] handler error:", e);
    return NextResponse.json({ error: "Erreur de traitement" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
