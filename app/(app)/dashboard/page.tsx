"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Wand2, Armchair, Clapperboard, Play, Plus,
  BedDouble, Maximize, ImagePlus, Zap, Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/property-image";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";

type DbListing = {
  id: string;
  address: string;
  district: string | null;
  price: string | null;
  beds: number;
  area: number;
  status: string;
  photos: number;
  video: boolean;
  tour: boolean;
  hue: string | null;
  scene: string | null;
  enhanced_url: string | null;
  staged_url: string | null;
  video_url: string | null;
  created_at: string;
};

const STATUS_TONE: Record<string, "neutral" | "warning" | "info" | "success"> = {
  queued: "neutral", enhancing: "warning", staged: "info", ready: "success",
};
const STATUS_LABEL: Record<string, { tr: string; en: string }> = {
  queued: { tr: "Kuyrukta", en: "Queued" },
  enhancing: { tr: "İyileştiriliyor", en: "Enhancing" },
  staged: { tr: "Döşendi", en: "Staged" },
  ready: { tr: "Hazır", en: "Ready" },
};

function Thumb({ l, className }: { l: DbListing; className?: string }) {
  const src = l.staged_url ?? l.enhanced_url ?? null;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={l.address} className={`object-cover ${className ?? ""}`} />;
  }
  return (
    <PropertyImage
      scene={(l.scene as "city" | "coast" | "house" | "loft" | "vineyard") ?? "city"}
      hue={l.hue ?? "255"}
      className={className}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="aspect-video bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { lang } = useLang();
  const [listings, setListings] = useState<DbListing[]>([]);
  const [credits, setCredits] = useState<{ credits: number; plan: string } | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: listData }, { data: authData }, meRes] = await Promise.all([
        supabase.from("listings").select("*").order("created_at", { ascending: false }),
        supabase.auth.getUser(),
        fetch("/api/me"),
      ]);
      setListings(listData ?? []);
      const user = authData?.user;
      if (user) {
        setUserName(
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          ""
        );
      }
      if (meRes.ok) setCredits(await meRes.json());
      setLoading(false);
    }
    load();
  }, []);

  const staged = listings.filter((l) => l.staged_url);
  const withVideo = listings.filter((l) => l.video_url);
  const recent = listings.slice(0, 6);
  const featured = withVideo[0] ?? listings[0] ?? null;
  const strip = listings.filter((l) => l.id !== featured?.id).slice(0, 4);

  const tr = lang === "tr";

  const stats = [
    { icon: Building2,   value: listings.length,   label: tr ? "Toplam ilan"    : "Total listings" },
    { icon: Armchair,    value: staged.length,      label: tr ? "Staging"        : "Staged" },
    { icon: Clapperboard,value: withVideo.length,   label: tr ? "Video"          : "Videos" },
    { icon: Zap,         value: credits?.credits ?? "—", label: tr ? "Kalan kredi"  : "Credits left" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* ── Credit bar ─────────────────────────────────────────────── */}
      {credits && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 shadow-soft">
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium tabular-nums">
              {credits.credits} {tr ? "kredi kaldı" : "credits remaining"}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground capitalize">
              {credits.plan}
            </span>
          </div>
          <Link href="/settings" className="text-xs text-muted-foreground transition hover:text-foreground">
            {tr ? "Planı yükselt →" : "Upgrade plan →"}
          </Link>
        </div>
      )}

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl ring-1 ring-border shadow-soft" style={{ background: "var(--grad-hero)" }}>
        <span className="blob -left-12 -top-20 h-64 w-64 bg-primary/30 drift" aria-hidden />
        <div className="relative grid gap-7 p-7 lg:grid-cols-[1.05fr_1fr] lg:p-9">

          {/* Left */}
          <div className="flex flex-col">
            <p className="label-mono flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
              {tr ? "Stüdyo · Bugün" : "Studio · Today"}
            </p>
            <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-tight lg:text-[44px]">
              {tr ? "Merhaba" : "Hello"}{userName ? `, ${userName}.` : "."}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {tr
                ? "Portföyün burada. Fotoğraf yükle; Visuimo ışığı düzeltir, boş odaları döşer ve tanıtım videosunu oluşturur."
                : "Your portfolio is here. Upload photos; Visuimo fixes the light, stages empty rooms and renders the tour video."}
            </p>
            <div className="mt-5">
              <Link href="/listings">
                <Button size="lg" className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  {tr ? "İlan görselleştir" : "Visualize a listing"}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-auto grid grid-cols-2 gap-3 pt-7 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-card/70 p-3 ring-1 ring-border backdrop-blur">
                  <s.icon className="h-4 w-4 text-primary" />
                  <p className="mt-2 font-display text-xl font-semibold tabular-nums">{s.value}</p>
                  <p className="text-[11px] leading-tight text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — featured listing */}
          <div>
            {loading ? (
              <div className="animate-pulse overflow-hidden rounded-2xl bg-card/70 ring-1 ring-border">
                <div className="aspect-video bg-muted/60" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted/60" />
                  <div className="h-3 w-1/2 rounded bg-muted/60" />
                </div>
              </div>
            ) : featured ? (
              <>
                <div className="overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border">
                  <div className="relative">
                    <Thumb l={featured} className="aspect-video w-full" />
                    {featured.video_url && (
                      <a href={featured.video_url} target="_blank" rel="noopener noreferrer"
                        className="absolute inset-0 grid place-items-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-foreground shadow-pop transition hover:scale-105">
                          <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                        </span>
                      </a>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                      {tr ? "Öne çıkan" : "Featured"}
                    </span>
                    <Badge tone={STATUS_TONE[featured.status] ?? "neutral"}
                      className="absolute right-3 top-3 capitalize shadow-sm">
                      {STATUS_LABEL[featured.status]?.[lang] ?? featured.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{featured.address}</p>
                      {featured.district && <p className="text-xs text-muted-foreground">{featured.district}</p>}
                    </div>
                    {featured.price && (
                      <p className="font-display text-lg font-semibold tabular-nums text-primary">{featured.price}</p>
                    )}
                  </div>
                </div>
                {strip.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {strip.map((l) => (
                      <div key={l.id} className="overflow-hidden rounded-lg ring-1 ring-border">
                        <Thumb l={l} className="aspect-video w-full" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 py-16 text-center">
                <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {tr ? "Henüz ilan yok" : "No listings yet"}
                </p>
                <Link href="/listings" className="mt-3">
                  <Button size="sm" className="gap-2"><Plus className="h-3.5 w-3.5" />{tr ? "İlan ekle" : "Add listing"}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Recent Listings ─────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {tr ? "Son İlanlar" : "Recent Listings"}
          </h2>
          <Link href="/listings" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            {tr ? "Tümü" : "All"}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 font-display text-lg font-semibold">{tr ? "İlan yok" : "No listings"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tr ? "İlk ilanını ekleyerek başla." : "Add your first listing to get started."}
            </p>
            <Link href="/listings" className="mt-5">
              <Button className="gap-2"><Plus className="h-4 w-4" />{tr ? "İlan ekle" : "Add listing"}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((l) => (
              <div key={l.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
                <div className="relative">
                  <Thumb l={l} className="aspect-video w-full" />
                  <Badge tone={STATUS_TONE[l.status] ?? "neutral"} className="absolute left-3 top-3 capitalize shadow-sm">
                    {STATUS_LABEL[l.status]?.[lang] ?? l.status}
                  </Badge>
                  {l.price && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-0.5 text-[12px] font-semibold text-white backdrop-blur">
                      {l.price}
                    </span>
                  )}
                  {l.video_url && (
                    <span className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-foreground">
                      <Play className="h-3.5 w-3.5 translate-x-px fill-current" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="truncate font-medium">{l.address}</p>
                  {l.district && <p className="text-xs text-muted-foreground">{l.district}</p>}
                  <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{l.beds}</span>
                    <span className="inline-flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{l.area} m²</span>
                    <span className="ml-auto flex items-center gap-1.5">
                      {l.staged_url && <Armchair className="h-3.5 w-3.5 text-primary" />}
                      {l.video_url && <Clapperboard className="h-3.5 w-3.5 text-primary" />}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Before / After Staging ──────────────────────────────────── */}
      {(loading || staged.length > 0) && (
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">
            {tr ? "Sanal Staging — Önce / Sonra" : "Virtual Staging — Before / After"}
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <div className="grid grid-cols-2">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="aspect-[4/3] bg-muted/70" />
                  </div>
                  <div className="h-10 bg-card" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staged.slice(0, 6).map((l) => (
                <div key={l.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      {l.enhanced_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.enhanced_url} alt="" className="aspect-[4/3] w-full object-cover opacity-90 grayscale-[0.35]" />
                      ) : (
                        <Thumb l={l} className="aspect-[4/3] w-full opacity-90 grayscale-[0.35]" />
                      )}
                      <span className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                        {tr ? "Önce" : "Before"}
                      </span>
                    </div>
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.staged_url!} alt="" className="aspect-[4/3] w-full object-cover" />
                      <span className="absolute right-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                        {tr ? "Sonra" : "After"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <p className="truncate text-[13px] font-medium">{l.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Videos ─────────────────────────────────────────────────── */}
      {(loading || withVideo.length > 0) && (
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {tr ? "Üretilen Videolar" : "Generated Videos"}
            </h2>
            <Link href="/videos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {tr ? "Tümü" : "All"}
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <div className="aspect-video bg-muted" />
                  <div className="space-y-1.5 p-3">
                    <div className="h-3 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {withVideo.slice(0, 4).map((l) => (
                <a key={l.id} href={l.video_url!} target="_blank" rel="noopener noreferrer"
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
                  <div className="relative">
                    <Thumb l={l} className="aspect-video w-full" />
                    <span className="absolute inset-0 bg-black/15" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-foreground shadow transition group-hover:scale-105">
                        <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                      </span>
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{l.address}</p>
                    {l.district && <p className="truncate text-xs text-muted-foreground">{l.district}</p>}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
