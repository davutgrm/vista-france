"use client";

import { useState } from "react";
import { Play, Wand2, Clapperboard, PanelsTopLeft, ImagePlus, BedDouble, Maximize, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyImage } from "@/components/property-image";
import { useLang } from "@/components/i18n/language-provider";
import { listings, type ListingStatus } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

const statusLabel = {
  queued: { tr: "Kuyrukta", en: "Queued" }, enhancing: { tr: "İyileştiriliyor", en: "Enhancing" },
  staged: { tr: "Döşendi", en: "Staged" }, ready: { tr: "Hazır", en: "Ready" },
} as const;
const statusTone = { queued: "neutral", enhancing: "warning", staged: "info", ready: "success" } as const;

export default function ListingsPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<ListingStatus | "all">("all");

  const m = {
    tr: { title: "İlanlar", sub: "Tüm portföyün ve görselleştirme durumları.", add: "Yeni ilan", all: "Tümü" },
    en: { title: "Listings", sub: "Your whole portfolio and its visualization status.", add: "New listing", all: "All" },
  }[lang];

  const filters: (ListingStatus | "all")[] = ["all", "ready", "staged", "enhancing", "queued"];
  const shown = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> {m.add}</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted")}>
            {f === "all" ? m.all : t(statusLabel[f])}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((l) => (
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
              {l.status !== "ready" && (
                <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5"><Wand2 className="h-3.5 w-3.5" /> {lang === "tr" ? "Görselleştir" : "Visualize"}</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
