"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import appConfig from "@/app.config";
import { useLang } from "@/components/i18n/language-provider";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { createClient } from "@/lib/supabase/client";

function translateAuthError(message: string, ui: Record<string, string>): string {
  const m = message.toLowerCase();
  if (m.includes("email not confirmed")) return ui.errEmailNotConfirmed;
  if (m.includes("invalid login credentials")) return ui.errInvalidCredentials;
  if (m.includes("user already registered") || m.includes("already registered")) return ui.errUserExists;
  return ui.errGeneric;
}

export function AuthScreen({ mode }: { mode: "login" | "signup" }) {
  const { ui, t, lang } = useLang();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resent, setResent] = useState(false);

  async function enter(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    const form = e?.target as HTMLFormElement | undefined;
    const email = (form?.querySelector<HTMLInputElement>("#email")?.value ?? "").trim();
    const password = form?.querySelector<HTMLInputElement>("#password")?.value ?? "";
    const fullName = form?.querySelector<HTMLInputElement>("#name")?.value ?? "";
    setPendingEmail(email);
    setResent(false);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (!data.session) {
          // Email confirmation required — no session yet, don't navigate away.
          setPendingEmail(email);
          setNeedsConfirmation(true);
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? translateAuthError(err.message, ui) : ui.errGeneric);
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    setResent(false);
    const supabase = createClient();
    await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setResent(true);
  }

  const isLogin = mode === "login";
  const stats = appConfig.marketing.stats.slice(0, 3);

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Left — brand panel */}
      <section
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ backgroundImage: "var(--grad-brand)" }}
      >
        <span className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-black/15 blur-3xl" />

        <Link href="/" className="relative">
          <Logo onDark />
        </Link>

        <div className="relative max-w-md">
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">
            {t(appConfig.marketing.badge)}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
            {t(appConfig.tagline)}
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/85">{ui.authBlurb}</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.value} className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <p className="font-display text-2xl font-semibold tabular-nums">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-white/75">{t(s.label)}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/65">
          © {appConfig.name}
        </p>
      </section>

      {/* Right — form */}
      <section className="relative flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute right-5 top-5">
          <LanguageToggle />
        </div>

        <div className="w-full max-w-sm space-y-7">
          <Link href="/" className="inline-flex lg:hidden">
            <Logo />
          </Link>

          {needsConfirmation ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {appConfig.name}
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
                  {ui.checkEmailTitle}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground">
                {ui.checkEmailBody}
              </p>
              <p className="text-sm font-medium">{pendingEmail}</p>

              {resent && (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
                  {ui.resendConfirmationSent}
                </p>
              )}

              <Button type="button" variant="outline" className="w-full" onClick={resendConfirmation}>
                {ui.resendConfirmation}
              </Button>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {appConfig.name}
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">
                  {isLogin ? ui.welcomeBack : ui.createAccount}
                </h2>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <form onSubmit={enter} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">{ui.fullName}</Label>
                    <Input id="name" name="name" placeholder={lang === "tr" ? "Adın Soyadın" : "Jane Doe"} />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">{ui.email}</Label>
                  <Input id="email" name="email" type="email" placeholder="you@company.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">{ui.password}</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" disabled={loading} className="w-full gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isLogin ? ui.signIn : ui.getStarted}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? ui.noAccount : ui.haveAccount}{" "}
                <Link
                  href={isLogin ? "/signup" : "/login"}
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  {isLogin ? ui.getStarted : ui.signIn}
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

