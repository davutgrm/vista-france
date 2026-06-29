"use client";

import { useState } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/i18n/language-provider";
import { staging, type Staging } from "@/lib/demo/data";

/** Interior room sketch — empty vs furnished. */
function Room({ hue, furnished }: { hue: string; furnished: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className="aspect-[16/10] w-full transition-opacity duration-300" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="320" height="200" fill={`oklch(${furnished ? "90% 0.03" : "89% 0.012"} ${furnished ? hue : "85"})`} />
      <rect y="140" width="320" height="60" fill={`oklch(${furnished ? "72% 0.06" : "80% 0.012"} ${furnished ? hue : "70"})`} />
      {/* window */}
      <rect x="196" y="34" width="92" height="80" rx="3" fill={`oklch(82% 0.1 230)`} stroke="#fff" strokeWidth="4" />
      <line x1="242" y1="34" x2="242" y2="114" stroke="#fff" strokeWidth="3" />
      {furnished && (
        <g>
          <rect x="30" y="112" width="120" height="44" rx="8" fill={`oklch(56% 0.11 ${hue})`} />
          <rect x="36" y="96" width="108" height="24" rx="8" fill={`oklch(64% 0.11 ${hue})`} />
          <rect x="44" y="100" width="44" height="20" rx="6" fill={`oklch(72% 0.08 ${hue})`} />
          <rect x="60" y="164" width="80" height="8" rx="4" fill={`oklch(44% 0.08 30)`} />
          <circle cx="246" cy="128" r="11" fill="#ffd27a" />
          <rect x="243" y="128" width="6" height="30" fill="#6b5a3c" />
          <path d="M232 116 q14 -10 28 0 z" fill="#2a2a2a" />
        </g>
      )}
    </svg>
  );
}

function StagingCard({ s }: { s: Staging }) {
  const { lang, t } = useLang();
  const [after, setAfter] = useState(true);
  const lbl = { before: lang === "tr" ? "Önce" : "Before", after: lang === "tr" ? "Sonra" : "After" };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative">
        <Room hue={s.afterHue} furnished={after} />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${after ? "bg-primary text-primary-foreground" : "bg-black/45 text-white"}`}>
          {after ? lbl.after : lbl.before}
        </span>
        <button onClick={() => setAfter((v) => !v)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow transition hover:scale-105">
          <ArrowLeftRight className="h-3.5 w-3.5" /> {after ? lbl.before : lbl.after}
        </button>
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">{t(s.room)}</p>
          <p className="text-xs text-muted-foreground">{s.listing}</p>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{t(s.style)}</span>
      </div>
    </div>
  );
}

export default function StagingPage() {
  const { lang } = useLang();
  const m = {
    tr: { title: "Sanal Staging", sub: "Boş odaları saniyeler içinde döşe. Önce/Sonra'yı karşılaştır.", add: "Oda döşe" },
    en: { title: "Virtual Staging", sub: "Furnish empty rooms in seconds. Compare before & after.", add: "Stage a room" },
  }[lang];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> {m.add}</Button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {staging.map((s) => <StagingCard key={s.id} s={s} />)}
      </div>
    </div>
  );
}
