"use client";

import { useState, useRef } from "react";
import { Wand2, Clapperboard, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhanceResult {
  original_url: string;
  enhanced_url: string;
  elapsed_s: number;
  cost_usd: number;
  model: string;
}

interface VideoResult {
  video_url: string;
  elapsed_s: number;
  cost_usd: number;
  model: string;
}

function ApiStatus({ label, envKey }: { label: string; envKey: string }) {
  // Sadece UI; gerçek kontrol sunucu tarafında yapılır
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">({envKey})</span>
    </div>
  );
}

export default function TestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [enhancing, setEnhancing] = useState(false);
  const [enhanceResult, setEnhanceResult] = useState<EnhanceResult | null>(null);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setEnhanceResult(null);
    setVideoResult(null);
    setEnhanceError(null);
    setVideoError(null);
  }

  async function runEnhance() {
    if (!file) return;
    setEnhancing(true);
    setEnhanceError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/enhance", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setEnhanceResult(data);
    } catch (e: unknown) {
      setEnhanceError(e instanceof Error ? e.message : String(e));
    } finally {
      setEnhancing(false);
    }
  }

  async function runVideo() {
    if (!enhanceResult) return;
    setGenerating(true);
    setVideoError(null);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: enhanceResult.enhanced_url,
          prompt: "Smooth cinematic flyover of this real estate property, professional quality",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? JSON.stringify(data.detail ?? data));
      setVideoResult(data);
    } catch (e: unknown) {
      setVideoError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerating(false);
    }
  }

  const totalCost = (enhanceResult?.cost_usd ?? 0) + (videoResult?.cost_usd ?? 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Başlık */}
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">API Test Stüdyosu</h2>
        <p className="text-sm text-muted-foreground">
          fal.ai foto iyileştirme ve kie.ai video üretimini gerçek anahtarlarla test et.
        </p>
      </div>

      {/* API anahtar hatırlatıcısı */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Anahtarlar</span>
        <ApiStatus label="fal.ai" envKey="FAL_KEY" />
        <ApiStatus label="kie.ai" envKey="KIE_API_KEY" />
        <span className="text-xs text-muted-foreground">.env.local dosyasına gir → sunucuyu yeniden başlat</span>
      </div>

      {/* ── Adım 1: Yükle & İyileştir ── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="mb-4 font-semibold text-base">1 · Fotoğraf yükle → fal.ai ile iyileştir</h3>

        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          {preview ? (
            <img src={preview} alt="Yüklenen fotoğraf" className="max-h-52 rounded-lg object-contain" />
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Tıkla veya sürükle · JPG, PNG, WEBP</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onFileChange} />

        {file && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground truncate">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </p>
            <Button onClick={runEnhance} disabled={enhancing} className="shrink-0 gap-2">
              {enhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {enhancing ? "İyileştiriliyor…" : "fal.ai ile iyileştir"}
            </Button>
          </div>
        )}

        {enhanceError && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="break-all">{enhanceError}</span>
          </div>
        )}
      </section>

      {/* ── Adım 2: İyileştirme sonucu ── */}
      {enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              2 · fal.ai sonucu
            </h3>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              {enhanceResult.elapsed_s}s · ~${enhanceResult.cost_usd.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Orijinal</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Orijinal" className="w-full rounded-lg object-contain border border-border" />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">İyileştirilmiş</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enhanceResult.enhanced_url}
                alt="İyileştirilmiş"
                className="w-full rounded-lg object-contain border border-primary/30"
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">Model: {enhanceResult.model}</p>

          {/* kie.ai video butonu */}
          <div className="mt-5 border-t border-border pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">İyileştirilmiş görselden drone-tarzı tanıtım videosu üret</p>
              <Button onClick={runVideo} disabled={generating} className="gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clapperboard className="h-4 w-4" />}
                {generating ? "Video üretiliyor… (60-120s)" : "kie.ai ile video üret"}
              </Button>
            </div>
            {generating && (
              <p className="mt-2 text-xs text-muted-foreground">
                Video render işlemi 60-120 saniye sürebilir. Sayfa açık kalsın.
              </p>
            )}
          </div>

          {videoError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="break-all">{videoError}</span>
            </div>
          )}
        </section>
      )}

      {/* ── Adım 3: Video sonucu ── */}
      {videoResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              3 · kie.ai sonucu
            </h3>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
              {videoResult.elapsed_s}s · ~${videoResult.cost_usd.toFixed(2)}
            </span>
          </div>
          <video
            src={videoResult.video_url}
            controls
            autoPlay
            loop
            className="w-full rounded-lg border border-border"
          />
          <p className="mt-3 text-xs text-muted-foreground">Model: {videoResult.model}</p>
        </section>
      )}

      {/* ── Maliyet özeti ── */}
      {(enhanceResult ?? videoResult) && (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-4 font-semibold">Maliyet özeti</h3>
          <div className="space-y-2.5 text-sm">
            {enhanceResult && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">fal.ai</span>
                  <span className="ml-2 text-muted-foreground">clarity-upscaler · 1 görsel</span>
                </div>
                <span className="font-semibold tabular-nums">${enhanceResult.cost_usd.toFixed(2)}</span>
              </div>
            )}
            {videoResult && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">kie.ai</span>
                  <span className="ml-2 text-muted-foreground">img2video · 5 saniyelik video</span>
                </div>
                <span className="font-semibold tabular-nums">${videoResult.cost_usd.toFixed(2)}</span>
              </div>
            )}
            {enhanceResult && videoResult && (
              <div className="flex items-center justify-between border-t border-primary/20 pt-3 text-base">
                <span className="font-semibold">Toplam (bu ilan için)</span>
                <span className="font-bold tabular-nums text-primary">${totalCost.toFixed(2)}</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            * Fiyatlar yaklaşıktır. Gerçek kullanım için{" "}
            <a href="https://fal.ai/dashboard" target="_blank" rel="noopener noreferrer" className="underline">
              fal.ai
            </a>{" "}
            ve{" "}
            <a href="https://kieai.erweima.ai" target="_blank" rel="noopener noreferrer" className="underline">
              kie.ai
            </a>{" "}
            hesap panellerini kontrol et.
          </p>
        </section>
      )}
    </div>
  );
}
