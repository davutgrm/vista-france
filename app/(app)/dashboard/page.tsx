"use client";

import Link from "next/link";
import {
  ArrowUpRight, Play, Wand2, Clapperboard, Armchair, ImagePlus, BedDouble, Maximize,
  PanelsTopLeft, Flame, MessageCircle, Phone, Globe, TrendingUp, TrendingDown, Eye,
  Clock, Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/property-image";
import { useLang } from "@/components/i18n/language-provider";
import {
  activity, beforeAfter, droneJobs, inquiries, inquiries14d, listingPerf, listings,
  portals, renderQueue, staging, studio, videos, views14d,
} from "@/lib/demo/data";
import { formatRelative } from "@/lib/utils";

const statusLabel = {
  queued: { tr: "Kuyrukta", en: "Queued" }, enhancing: { tr: "İyileştiriliyor", en: "Enhancing" },
  staged: { tr: "Döşendi", en: "Staged" }, ready: { tr: "Hazır", en: "Ready" },
} as const;
const statusTone = { queued: "neutral", enhancing: "warning", staged: "info", ready: "success" } as const;
const kindIcon = { enhance: Wand2, stage: Armchair, video: Clapperboard, tour: PanelsTopLeft };
const viaIcon = { WhatsApp: MessageCircle, Telefon: Phone, Portal: Globe } as const;

function Sparkline({ data }: { data: number[] }) {
  const w = 280, h = 64, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 8) - 4]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.32" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill="var(--color-primary)" />
    </svg>
  );
}

/** Two-series line chart (views + inquiries) sharing an x-axis. */
function DualSpark({ a, b }: { a: number[]; b: number[] }) {
  const w = 540, h = 150;
  const toPts = (data: number[]) => {
    const max = Math.max(...data), min = Math.min(...data);
    return data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 16) - 8]);
  };
  const pa = toPts(a), pb = toPts(b);
  const path = (pts: number[][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${path(pa)} L${w} ${h} L0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dual-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="var(--color-border)" strokeWidth="1" />)}
      <path d={area} fill="url(#dual-a)" />
      <path d={path(pa)} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path(pb)} fill="none" stroke="var(--color-serif)" strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pa[pa.length - 1][0]} cy={pa[pa.length - 1][1]} r="3.5" fill="var(--color-primary)" />
      <circle cx={pb[pb.length - 1][0]} cy={pb[pb.length - 1][1]} r="3.5" fill="var(--color-serif)" />
    </svg>
  );
}

export default function VistaStudio() {
  const { lang, t } = useLang();
  const featured = listings.find((l) => l.video && l.tour) ?? listings[0];
  const strip = listings.filter((l) => l.id !== featured.id).slice(0, 4);

  const m = {
    tr: { eyebrow: "Stüdyo · Bugün", hi: "Merhaba Deniz.", body: "Portföyün canlı. Yeni fotoğraf yükle; Vista ışığı düzeltir, boş odaları döşer ve tanıtım videosunu render eder.",
      visualize: "İlan görselleştir", queue: "render kuyruğunda", featured: "Öne çıkan ilan", tourReady: "Sanal tur hazır", play: "Videoyu oynat",
      visualized: "Bu ay görselleştirilen", videosMade: "Üretilen video", inquiries: "İlan başına ilgi", stagedK: "Döşenen oda", avgK: "Ort. render süresi",
      listings: "İlanların", all: "Tümü", queueT: "Render kuyruğu", portalsT: "Portal dağıtımı", live: "yayında",
      perf: "İlan görüntülenmeleri", last14: "son 14 gün", inq: "Gelen talepler", videosT: "Üretilen videolar",
      stagingT: "Sanal staging — önce / sonra", before: "Önce", after: "Sonra", activity: "Son hareketler", visualizeBtn: "Görselleştir",
      droneT: "Drone-tarzı video işleri", done: "Hazır", rendering: "render", galleryT: "Önce / sonra galerisi", view: "Görüntülenme", inqShort: "talep",
      trendsT: "Görüntülenme & talep akışı", views: "Görüntülenme", inquiriesAxis: "Talep", perfTableT: "İlan performansı", thViews: "Görüntülenme", thInq: "Talep", thCtr: "Tıklama", thTrend: "14g değişim", distribute: "Dağıt" },
    en: { eyebrow: "Studio · Today", hi: "Hello Deniz.", body: "Your portfolio is live. Upload photos; Vista fixes the light, stages empty rooms and renders the tour video.",
      visualize: "Visualize a listing", queue: "in the render queue", featured: "Featured listing", tourReady: "Virtual tour ready", play: "Play video",
      visualized: "Visualized this month", videosMade: "Videos rendered", inquiries: "Inquiries per listing", stagedK: "Rooms staged", avgK: "Avg render time",
      listings: "Your listings", all: "All", queueT: "Render queue", portalsT: "Portal distribution", live: "live",
      perf: "Listing views", last14: "last 14 days", inq: "Incoming inquiries", videosT: "Rendered videos",
      stagingT: "Virtual staging — before / after", before: "Before", after: "After", activity: "Recent activity", visualizeBtn: "Visualize",
      droneT: "Drone-style video jobs", done: "Ready", rendering: "rendering", galleryT: "Before / after gallery", view: "Views", inqShort: "inquiries",
      trendsT: "Views & inquiries trend", views: "Views", inquiriesAxis: "Inquiries", perfTableT: "Listing performance", thViews: "Views", thInq: "Inquiries", thCtr: "CTR", thTrend: "14d change", distribute: "Distribute" },
  }[lang];

  const stats = [
    { icon: ImagePlus, value: studio.visualized, label: m.visualized, good: false },
    { icon: Clapperboard, value: studio.videos, label: m.videosMade, good: false },
    { icon: TrendingUp, value: studio.inquiriesDelta, label: m.inquiries, good: true },
    { icon: Armchair, value: studio.staged, label: m.stagedK, good: false },
    { icon: Clock, value: studio.avgTime, label: m.avgK, good: false },
  ];
  const totalViews = views14d.reduce((a, b) => a + b, 0);
  const totalInq = inquiries14d.reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl ring-1 ring-border shadow-soft" style={{ background: "var(--grad-hero)" }}>
        <span className="blob -left-12 -top-20 h-64 w-64 bg-primary/30 drift" aria-hidden />
        <span className="blob right-1/3 top-10 h-40 w-40" aria-hidden style={{ background: "color-mix(in oklch, var(--color-serif) 35%, transparent)" }} />
        <div className="relative grid gap-7 p-7 lg:grid-cols-[1.05fr_1fr] lg:p-9">
          <div className="flex flex-col">
            <p className="label-mono flex items-center gap-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> {m.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-tight lg:text-[44px]">
              {m.hi} <span className="display-accent font-normal">{studio.queue} {m.queue}.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            <div className="mt-5">
              <Link href="/listings"><Button size="lg" className="gap-2"><Wand2 className="h-4 w-4" /> {m.visualize}</Button></Link>
            </div>
            <div className="mt-auto grid grid-cols-3 gap-3 pt-7 sm:grid-cols-5">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-card/70 p-3 ring-1 ring-border backdrop-blur">
                  <s.icon className="h-4 w-4 text-primary" />
                  <p className={`mt-2 font-display text-xl font-semibold tabular-nums ${s.good ? "text-success" : ""}`}>{s.value}</p>
                  <p className="text-[11px] leading-tight text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured media + filmstrip */}
          <div>
            <div className="overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border">
              <div className="relative">
                <PropertyImage scene={featured.scene} hue={featured.hue} className="aspect-video w-full" />
                <button className="absolute inset-0 grid place-items-center" aria-label={m.play}>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-foreground shadow-pop transition hover:scale-105">
                    <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                  </span>
                </button>
                <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">{m.featured}</span>
                <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-1 text-[10px] font-medium text-white tabular-nums backdrop-blur">4K · 0:42</span>
                <span className="absolute bottom-3 right-3 rounded-full bg-success/90 px-2.5 py-1 text-[11px] font-medium text-success-foreground">{m.tourReady}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{featured.address}</p>
                  <p className="text-xs text-muted-foreground">{featured.district}</p>
                </div>
                <p className="font-display text-lg font-semibold tabular-nums text-primary">{featured.price}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {strip.map((l) => (
                <div key={l.id} className="overflow-hidden rounded-lg ring-1 ring-border">
                  <PropertyImage scene={l.scene} hue={l.hue} className="aspect-video w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Render queue + portals ──────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.queueT}</h2>
            <span className="label-mono text-muted-foreground">{renderQueue.length} {lang === "tr" ? "iş" : "jobs"}</span>
          </div>
          <ul className="mt-4 space-y-4">
            {renderQueue.map((j) => {
              const Icon = kindIcon[j.kind];
              const active = j.progress > 0;
              return (
                <li key={j.id} className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <p className="truncate font-medium">{j.listing}</p>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{active ? `${j.progress}% · ${j.eta}` : j.eta}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t(j.stage)}</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${active ? "bg-primary" : "bg-border"}`} style={{ width: `${Math.max(j.progress, 4)}%`, backgroundImage: active ? "linear-gradient(90deg, var(--color-primary), color-mix(in oklch, var(--color-primary) 60%, var(--color-serif)))" : undefined }} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.portalsT}</h2>
          <ul className="mt-4 space-y-2.5">
            {portals.map((p) => (
              <li key={p.name} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                <span className={`h-2 w-2 rounded-full ${p.tone === "success" ? "bg-success" : p.tone === "warning" ? "bg-warning" : "bg-muted-foreground"}`} />
                <span className="flex-1 text-sm font-medium">{p.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{p.live} {m.live}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Listings ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">{m.listings}</h2>
          <Link href="/listings" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">{m.all} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <div key={l.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="relative">
                <PropertyImage scene={l.scene} hue={l.hue} className="aspect-video w-full" />
                <Badge tone={statusTone[l.status]} className="absolute left-3 top-3 capitalize shadow-sm">{t(statusLabel[l.status])}</Badge>
                <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-0.5 text-[12px] font-semibold text-white backdrop-blur">{l.price}</span>
                {l.video && <span className="absolute bottom-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-foreground"><Play className="h-3.5 w-3.5 translate-x-px fill-current" /></span>}
              </div>
              <div className="p-4">
                <p className="truncate font-medium">{l.address}</p>
                <p className="text-xs text-muted-foreground">{l.district}</p>
                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{l.beds}</span>
                  <span className="inline-flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{l.area} m²</span>
                  <span className="inline-flex items-center gap-1"><ImagePlus className="h-3.5 w-3.5" />{l.photos}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    {l.video && <Clapperboard className="h-3.5 w-3.5 text-primary" />}
                    {l.tour && <PanelsTopLeft className="h-3.5 w-3.5 text-primary" />}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Before/after gallery + drone-video jobs ─────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">{m.galleryT}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {beforeAfter.map((ba) => (
              <div key={ba.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <PropertyImage scene={ba.before.scene} hue={ba.before.hue} className="aspect-[4/3] w-full opacity-90 grayscale-[0.35]" />
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur">{m.before}</span>
                  </div>
                  <div className="relative">
                    <PropertyImage scene={ba.after.scene} hue={ba.after.hue} className="aspect-[4/3] w-full" />
                    <span className="absolute right-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">{m.after}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <p className="truncate text-[13px] font-medium">{ba.listing}</p>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">{t(ba.style)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.droneT}</h2>
            <span className="label-mono text-muted-foreground">{droneJobs.length}</span>
          </div>
          <ul className="mt-4 space-y-4">
            {droneJobs.map((d) => {
              const done = d.progress >= 100;
              return (
                <li key={d.id} className="flex items-center gap-3">
                  <div className="relative shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
                    <PropertyImage scene={d.scene} hue={d.hue} className="h-12 w-16" />
                    <span className="absolute inset-0 grid place-items-center bg-black/25">
                      <Play className="h-3.5 w-3.5 translate-x-px fill-white text-white" />
                    </span>
                    <span className="absolute bottom-0.5 right-0.5 rounded bg-black/65 px-1 text-[9px] font-medium text-white tabular-nums">{d.duration}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{d.listing}</p>
                      {done
                        ? <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">{m.done}</span>
                        : <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{d.progress}%</span>}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{t(d.style)} · {t(d.format)}</p>
                    {!done && (
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${d.progress}%`, backgroundImage: "linear-gradient(90deg, var(--color-primary), var(--color-serif))" }} />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Performance + inquiries ─────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight">{m.perf}</h2>
              <p className="text-sm text-muted-foreground">{m.last14}</p>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1 font-display text-2xl font-semibold tabular-nums"><Eye className="h-4 w-4 text-muted-foreground" />{totalViews.toLocaleString()}</p>
              <p className="inline-flex items-center gap-0.5 text-xs font-semibold text-success"><TrendingUp className="h-3 w-3" />+38%</p>
            </div>
          </div>
          <div className="mt-4"><Sparkline data={views14d} /></div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.inq}</h2>
          <ul className="mt-4 space-y-2.5">
            {inquiries.map((q) => {
              const Via = viaIcon[q.via];
              return (
                <li key={q.id} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{q.name.split(" ").map((s) => s[0]).join("")}</span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium">{q.name}{q.hot && <Flame className="h-3.5 w-3.5 text-destructive" />}</p>
                    <p className="truncate text-xs text-muted-foreground">{q.listing}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Via className="h-3.5 w-3.5" />{q.at}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Rendered videos ─────────────────────────────────────────── */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">{m.videosT}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <div key={v.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="relative">
                <PropertyImage scene={v.scene} hue={v.hue} className="aspect-video w-full" />
                <span className="absolute inset-0 bg-black/15" />
                <button className="absolute inset-0 grid place-items-center" aria-label="play"><span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-foreground shadow transition group-hover:scale-105"><Play className="h-5 w-5 translate-x-0.5 fill-current" /></span></button>
                <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white tabular-nums">{v.duration}</span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium">{t(v.style)}</p>
                <p className="truncate text-xs text-muted-foreground">{v.listing} · {t(v.format)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Views & inquiries trend (dual line) ─────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">{m.trendsT}</h2>
            <p className="text-sm text-muted-foreground">{m.last14}</p>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" />{m.views}</p>
              <p className="font-display text-xl font-semibold tabular-nums">{totalViews.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-serif)" }} />{m.inquiriesAxis}</p>
              <p className="font-display text-xl font-semibold tabular-nums">{totalInq}</p>
            </div>
          </div>
        </div>
        <div className="mt-5"><DualSpark a={views14d} b={inquiries14d} /></div>
      </section>

      {/* ── Per-listing performance table ───────────────────────────── */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.perfTableT}</h2>
          <span className="label-mono text-muted-foreground">{listingPerf.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-medium">{m.listings}</th>
                <th className="px-4 py-3 text-right font-medium tabular-nums">{m.thViews}</th>
                <th className="px-4 py-3 text-right font-medium tabular-nums">{m.thInq}</th>
                <th className="px-4 py-3 text-right font-medium tabular-nums">{m.thCtr}</th>
                <th className="px-4 py-3 text-right font-medium tabular-nums">{m.thTrend}</th>
                <th className="px-6 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {listingPerf.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 transition hover:bg-muted/40">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 overflow-hidden rounded-md ring-1 ring-border"><PropertyImage scene={p.scene} hue={p.hue} className="h-9 w-12" /></div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.address}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.district}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.inquiries}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{p.ctr}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${p.trend >= 0 ? "text-success" : "text-destructive"}`}>
                      {p.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{p.trend >= 0 ? "+" : ""}{p.trend}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground">
                      <Send className="h-3 w-3" />{m.distribute}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Staging + activity ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="mb-3 font-display text-xl font-semibold tracking-tight">{m.stagingT}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {staging.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="grid grid-cols-2">
                  <Room hue={s.beforeHue} furnished={false} label={m.before} dark />
                  <Room hue={s.afterHue} furnished label={m.after} />
                </div>
                <div className="flex items-center justify-between p-3">
                  <p className="text-sm font-medium">{t(s.room)} · {s.listing}</p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{t(s.style)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold tracking-tight">{m.activity}</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 text-sm">
                  <p className="leading-snug"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{t(a.action)}</span> <span className="font-medium">{a.target}</span></p>
                  <p className="text-xs text-muted-foreground">{formatRelative(a.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* Tiny interior SVG for staging before/after. */
function Room({ hue, furnished, label, dark }: { hue: string; furnished: boolean; label: string; dark?: boolean }) {
  return (
    <div className="relative">
      <svg viewBox="0 0 200 150" className="aspect-[4/3] w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="200" height="150" fill={`oklch(${furnished ? "90% 0.03" : "88% 0.012"} ${furnished ? hue : "85"})`} />
        <rect y="104" width="200" height="46" fill={`oklch(${furnished ? "74% 0.06" : "80% 0.01"} ${furnished ? hue : "70"})`} />
        <rect x="118" y="26" width="60" height="56" rx="2" fill={`oklch(82% 0.1 ${furnished ? hue : "230"})`} stroke="#fff" strokeWidth="3" />
        {furnished && (
          <g>
            <rect x="22" y="84" width="74" height="30" rx="5" fill={`oklch(56% 0.1 ${hue})`} />
            <rect x="26" y="74" width="66" height="16" rx="5" fill={`oklch(64% 0.1 ${hue})`} />
            <rect x="40" y="118" width="46" height="6" rx="3" fill={`oklch(46% 0.08 30)`} />
            <circle cx="150" cy="92" r="8" fill="#ffd27a" />
            <rect x="148" y="92" width="4" height="22" fill="#6b5a3c" />
          </g>
        )}
      </svg>
      <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-medium ${furnished ? "bg-primary text-primary-foreground" : "bg-black/45 text-white"}`}>{label}</span>
    </div>
  );
}
