"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Play, Wand2, Clapperboard, PanelsTopLeft, ImagePlus,
  BedDouble, Maximize, Plus, X, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PropertyImage } from "@/components/property-image";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type ListingStatus = "queued" | "enhancing" | "staged" | "ready";

type DbListing = {
  id: string;
  address: string;
  district: string | null;
  price: string | null;
  beds: number;
  area: number;
  status: ListingStatus;
  photos: number;
  video: boolean;
  tour: boolean;
  hue: string | null;
  scene: string | null;
  enhanced_url: string | null;
  staged_url: string | null;
};

const statusLabel = {
  queued:    { tr: "Kuyrukta",        en: "Queued" },
  enhancing: { tr: "İyileştiriliyor", en: "Enhancing" },
  staged:    { tr: "Döşendi",         en: "Staged" },
  ready:     { tr: "Hazır",           en: "Ready" },
} as const;

const statusTone = {
  queued: "neutral", enhancing: "warning", staged: "info", ready: "success",
} as const;

export default function ListingsPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<ListingStatus | "all">("all");
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function fetchListings() {
    const supabase = createClient();
    const { data } = await supabase
      .from("listings")
      .select("id, address, district, price, beds, area, status, photos, video, tour, hue, scene, enhanced_url, staged_url")
      .order("created_at", { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchListings(); }, []);

  async function addListing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setAddError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAddError("Oturum açık değil"); setSaving(false); return; }
    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      address: (fd.get("address") as string).trim(),
      district: (fd.get("district") as string).trim() || null,
      price: (fd.get("price") as string).trim() || null,
      beds: Number(fd.get("beds")) || 0,
      area: Number(fd.get("area")) || 0,
    });
    if (error) { setAddError(error.message); setSaving(false); return; }
    form.reset();
    setShowAdd(false);
    setSaving(false);
    fetchListings();
  }

  const m = {
    tr: {
      title: "İlanlar", sub: "Tüm portföyün ve görselleştirme durumları.",
      add: "Yeni ilan", all: "Tümü",
      emptyTitle: "Henüz ilan yok", emptySub: "İlk ilanını ekleyerek başla.",
      modalTitle: "Yeni ilan ekle",
      fAddress: "Adres", fDistrict: "Semt / İlçe", fPrice: "Fiyat",
      fBeds: "Oda sayısı", fArea: "Alan (m²)",
      cancel: "İptal", save: "Kaydet",
    },
    en: {
      title: "Listings", sub: "Your whole portfolio and its visualization status.",
      add: "New listing", all: "All",
      emptyTitle: "No listings yet", emptySub: "Add your first listing to get started.",
      modalTitle: "Add new listing",
      fAddress: "Address", fDistrict: "District / Area", fPrice: "Price",
      fBeds: "Bedrooms", fArea: "Area (m²)",
      cancel: "Cancel", save: "Save",
    },
  }[lang];

  const filters: (ListingStatus | "all")[] = ["all", "ready", "staged", "enhancing", "queued"];
  const shown = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{m.title}</h2>
          <p className="text-sm text-muted-foreground">{m.sub}</p>
        </div>
        <Button className="gap-2" onClick={() => { setAddError(null); setShowAdd(true); }}>
          <Plus className="h-4 w-4" /> {m.add}
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}>
            {f === "all" ? m.all : t(statusLabel[f])}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
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
      )}

      {/* Empty state */}
      {!loading && shown.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <ImagePlus className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 font-display text-lg font-semibold">{m.emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{m.emptySub}</p>
          <Button className="mt-6 gap-2" onClick={() => { setAddError(null); setShowAdd(true); }}>
            <Plus className="h-4 w-4" /> {m.add}
          </Button>
        </div>
      )}

      {/* Listing grid */}
      {!loading && shown.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l) => (
            <div key={l.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="relative">
                {l.staged_url || l.enhanced_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(l.staged_url ?? l.enhanced_url)!}
                    alt={l.address}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <PropertyImage
                    scene={(l.scene as "city" | "coast" | "house" | "loft" | "vineyard") ?? "city"}
                    hue={l.hue ?? "255"}
                    className="aspect-video w-full"
                  />
                )}
                <Badge tone={statusTone[l.status]} className="absolute left-3 top-3 capitalize shadow-sm">
                  {t(statusLabel[l.status])}
                </Badge>
                {l.price && (
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-0.5 text-[12px] font-semibold text-white backdrop-blur">
                    {l.price}
                  </span>
                )}
                {l.video && (
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
                  <span className="inline-flex items-center gap-1"><ImagePlus className="h-3.5 w-3.5" />{l.photos}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    {l.video && <Clapperboard className="h-3.5 w-3.5 text-primary" />}
                    {l.tour && <PanelsTopLeft className="h-3.5 w-3.5 text-primary" />}
                  </span>
                </div>
                {l.status !== "ready" && (
                  <Link href={`/test?listing=${l.id}`} className="mt-3 block">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <Wand2 className="h-3.5 w-3.5" />
                      {lang === "tr" ? "Görselleştir" : "Visualize"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add listing modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-pop">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">{m.modalTitle}</h3>
              <button
                onClick={() => setShowAdd(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {addError && (
              <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{addError}</p>
            )}

            <form onSubmit={addListing} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address">{m.fAddress} *</Label>
                <Input
                  id="address" name="address" required
                  placeholder="12 Avenue Foch, Paris 16e"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district">{m.fDistrict}</Label>
                <Input
                  id="district" name="district"
                  placeholder="16e Arrondissement, Paris"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">{m.fPrice}</Label>
                <Input id="price" name="price" placeholder="€450.000" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="beds">{m.fBeds}</Label>
                  <Input id="beds" name="beds" type="number" min="0" defaultValue="0" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="area">{m.fArea}</Label>
                  <Input id="area" name="area" type="number" min="0" defaultValue="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>
                  {m.cancel}
                </Button>
                <Button type="submit" disabled={saving} className="flex-1 gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {m.save}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
