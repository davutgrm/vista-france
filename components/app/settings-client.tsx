"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Zap, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";

const PLANS: { key: string; label: string; price: string; period: string; credits: number; features: string[]; featured: boolean }[] = [
  { key: "solo",   label: "Solo",   price: "€0",  period: "/mois", credits: 20,  features: ["20 crédits/mois", "Amélioration photo"], featured: false },
  { key: "pro",    label: "Pro",    price: "€29", period: "/mois", credits: 180, features: ["180 crédits/mois", "Amélioration photo", "Home staging virtuel", "Génération vidéo", "Rendu prioritaire"], featured: true },
  { key: "acente", label: "Agence", price: "€69", period: "/mois", credits: 450, features: ["450 crédits/mois", "Tout ce qui est dans Pro", "Équipe & rôles", "Support prioritaire"], featured: false },
];

type PlanKey = string;

export function SettingsClient() {
  const { ui } = useLang();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const paidPlan = searchParams.get("plan");

  const [profile, setProfile] = useState<{ name: string; email: string; credits: number; plan: PlanKey } | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.auth.getUser(),
      fetch("/api/me"),
    ]).then(async ([{ data: { user } }, meRes]) => {
      const me = meRes.ok ? await meRes.json() : null;
      if (user) {
        setProfile({
          name: (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "",
          email: user.email ?? "",
          credits: me?.credits ?? 0,
          plan: (me?.plan ?? "solo") as PlanKey,
        });
      }
    });
  }, [paymentStatus]); // re-fetch if returning from Stripe

  async function upgrade(planKey: string) {
    setUpgrading(planKey);
    setUpgradeError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });
      const json = await res.json() as { url?: string; error?: string };
      if (json.url) {
        window.location.href = json.url;
      } else {
        setUpgradeError(json.error ?? "Une erreur est survenue");
        setUpgrading(null);
      }
    } catch (e) {
      setUpgradeError(String(e));
      setUpgrading(null);
    }
  }

  const currentPlanIdx = PLANS.findIndex((p) => p.key === (profile?.plan ?? "solo"));

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Payment success banner */}
      {paymentStatus === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-success">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-medium">
            Paiement réussi ! {paidPlan && `Forfait ${paidPlan.charAt(0).toUpperCase() + paidPlan.slice(1)} activé.`} Vos crédits ont été mis à jour.
          </span>
        </div>
      )}

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <p className="text-sm text-muted-foreground">Informations de compte et solde de crédits.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nom complet</Label>
                  <Input defaultValue={profile.name} readOnly />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input defaultValue={profile.email} readOnly />
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-medium">
                    {profile.credits} crédits restants
                    <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground capitalize">
                      {profile.plan}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amélioration : 1 cr · Home staging : 2 cr · Vidéo : 9 cr
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="h-10 animate-pulse rounded-lg bg-muted" />
              <div className="h-14 animate-pulse rounded-lg bg-muted" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan upgrade */}
      <Card>
        <CardHeader>
          <CardTitle>Forfait</CardTitle>
          <p className="text-sm text-muted-foreground">Les crédits sont renouvelés chaque mois. Vous pouvez annuler à tout moment.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {upgradeError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{upgradeError}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan, idx) => {
              const isCurrent = profile?.plan === plan.key;
              const isDowngrade = idx < currentPlanIdx;
              return (
                <div
                  key={plan.key}
                  className={`relative flex flex-col rounded-2xl border p-5 ${
                    plan.featured
                      ? "border-primary bg-primary/5 shadow-pop"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      Populaire
                    </span>
                  )}
                  <div className="mb-4">
                    <p className="font-display text-base font-semibold">{plan.label}</p>
                    <p className="mt-1 font-display text-3xl font-bold tabular-nums">
                      {plan.price}
                      <span className="text-base font-normal text-muted-foreground">{plan.period}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{plan.credits} crédits/mois</p>
                  </div>
                  <ul className="mb-5 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted py-2 text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success" /> Forfait actif
                    </div>
                  ) : isDowngrade ? (
                    <div className="flex items-center justify-center rounded-lg border border-border py-2 text-sm text-muted-foreground">
                      Inférieur à votre forfait actuel
                    </div>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      variant={plan.featured ? "primary" : "outline"}
                      disabled={upgrading === plan.key}
                      onClick={() => upgrade(plan.key)}
                    >
                      {upgrading === plan.key && <Loader2 className="h-4 w-4 animate-spin" />}
                      Passer à {plan.label}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Paiement sécurisé via Stripe · Annulation à tout moment · Hors TVA
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            {ui.contactHint.split(/(davutsenol\.fr@gmail\.com)/).map((part, i) =>
              part === "davutsenol.fr@gmail.com" ? (
                <a key={i} href={`mailto:${part}`} className="text-primary underline">
                  {part}
                </a>
              ) : (
                part
              )
            )}
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
