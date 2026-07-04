"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/i18n/language-provider";
import { createClient } from "@/lib/supabase/client";

type DbListing = {
  id: string;
  address: string;
  district: string | null;
  enhanced_url: string | null;
  staged_url: string | null;
};

function StagingCard({ l }: { l: DbListing }) {
  const { lang } = useLang();
  const [showAfter, setShowAfter] = useState(true);
  const tr = lang === "tr";
  const before = l.enhanced_url;
  const after = l.staged_url!;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={showAfter ? after : (before ?? after)}
          alt={l.address}
          className="aspect-video w-full object-cover transition-opacity duration-300"
        />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium ${showAfter ? "bg-primary text-primary-foreground" : "bg-black/45 text-white"}`}>
          {showAfter ? (tr ? "Sonra" : "After") : (tr ? "Önce" : "Before")}
        </span>
        <button
          onClick={() => setShowAfter((v) => !v)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow transition hover:scale-105"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {showAfter ? (tr ? "Önce'yi gör" : "See before") : (tr ? "Sonra'yı gör" : "See after")}
        </button>
        {!before && showAfter === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white">
            {tr ? "Orijinal fotoğraf yok" : "No original photo"}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0">
          <p className="truncate font-medium">{l.address}</p>
          {l.district && <p className="truncate text-xs text-muted-foreground">{l.district}</p>}
        </div>
      </div>
    </div>
  );
}

export default function StagingPage() {
  const { lang } = useLang();
  const [staged, setStaged] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("listings")
      .select("id, address, district, enhanced_url, staged_url")
      .not("staged_url", "is", null)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setStaged(data ?? []);
        setLoading(false);
      });
  }, []);

  const tr = lang === "tr";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {tr ? "Sanal Staging" : "Virtual Staging"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tr ? "Boş odaları saniyeler içinde döşe. Önce/Sonra'yı karşılaştır." : "Furnish empty rooms in seconds. Compare before & after."}
          </p>
        </div>
        <Link href="/listings">
          <Button className="gap-2"><Wand2 className="h-4 w-4" />{tr ? "Oda döşe" : "Stage a room"}</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="aspect-video bg-muted" />
              <div className="h-14 bg-card" />
            </div>
          ))}
        </div>
      ) : staged.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-24 text-center">
          <Wand2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 font-display text-lg font-semibold">
            {tr ? "Henüz staging yok" : "No staged rooms yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tr
              ? "İlanlar sayfasından bir ilan ekle ve sanal staging adımını çalıştır."
              : "Add a listing on the Listings page and run the virtual staging step."}
          </p>
          <Link href="/listings" className="mt-5">
            <Button className="gap-2"><Wand2 className="h-4 w-4" />{tr ? "Staging başlat" : "Start staging"}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {staged.map((l) => <StagingCard key={l.id} l={l} />)}
        </div>
      )}
    </div>
  );
}
