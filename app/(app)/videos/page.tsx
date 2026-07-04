"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Clapperboard, BedDouble, Maximize, ExternalLink } from "lucide-react";
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
  hue: string | null;
  scene: string | null;
  enhanced_url: string | null;
  staged_url: string | null;
  video_url: string;
  created_at: string;
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

export default function VideosPage() {
  const { lang } = useLang();
  const [videos, setVideos] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("listings")
      .select("id, address, district, price, beds, area, hue, scene, enhanced_url, staged_url, video_url, created_at")
      .not("video_url", "is", null)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setVideos((data ?? []) as DbListing[]);
        setLoading(false);
      });
  }, []);

  const fr = lang === "fr";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {fr ? "Vidéos" : "Videos"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {fr ? "Vidéos de présentation générées à partir de vos annonces." : "Tour videos generated from your listings."}
          </p>
        </div>
        <Link href="/listings">
          <Button className="gap-2">
            <Clapperboard className="h-4 w-4" />
            {fr ? "Générer une vidéo" : "Generate video"}
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="aspect-video bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-24 text-center">
          <Clapperboard className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 font-display text-lg font-semibold">
            {fr ? "Aucune vidéo pour l'instant" : "No videos yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {fr
              ? "Ajoutez une annonce depuis la page Annonces et lancez les étapes de visualisation."
              : "Add a listing on the Listings page and run the visualisation steps."}
          </p>
          <Link href="/listings" className="mt-5">
            <Button className="gap-2">
              <Clapperboard className="h-4 w-4" />
              {fr ? "Générer une vidéo" : "Generate video"}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((l) => (
            <div key={l.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="relative">
                <Thumb l={l} className="aspect-video w-full" />
                <span className="absolute inset-0 bg-black/15" />
                <a href={l.video_url} target="_blank" rel="noopener noreferrer"
                  className="absolute inset-0 grid place-items-center" aria-label={fr ? "Lire la vidéo" : "Play video"}>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-foreground shadow-pop transition group-hover:scale-105">
                    <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                  </span>
                </a>
              </div>
              <div className="p-4">
                <p className="truncate font-medium">{l.address}</p>
                {l.district && <p className="truncate text-xs text-muted-foreground">{l.district}</p>}
                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  {l.beds > 0 && <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{l.beds}</span>}
                  {l.area > 0 && <span className="inline-flex items-center gap-1"><Maximize className="h-3.5 w-3.5" />{l.area} m²</span>}
                  <a href={l.video_url} target="_blank" rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground">
                    <ExternalLink className="h-3 w-3" />
                    {fr ? "Ouvrir" : "Open"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
