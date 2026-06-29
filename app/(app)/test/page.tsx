"use client";

import { useState, useRef } from "react";
import { Wand2, Clapperboard, Armchair, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnhanceResult {
  original_url: string;
  enhanced_url: string;
  elapsed_s: number;
  cost_usd: number;
  model: string;
}

interface StageResult {
  staged_url: string;
  style: string;
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

const STYLES = [
  { key: "scandinavian", label: "İskandinav" },
  { key: "modern",       label: "Modern Minimal" },
  { key: "warmwood",     label: "Sıcak Ahşap" },
  { key: "industrial",   label: "Endüstriyel" },
] as const;

type StyleKey = (typeof STYLES)[number]["key"];

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="break-all">{msg}</span>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
      {label}
    </span>
  );
}

export default function TestPage() {
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [enhancing, setEnhancing]         = useState(false);
  const [enhanceResult, setEnhanceResult] = useState<EnhanceResult | null>(null);
  const [enhanceError, setEnhanceError]   = useState<string | null>(null);

  const [selectedStyle, setSelectedStyle] = useState<StyleKey>("scandinavian");
  const [staging, setStaging]             = useState(false);
  const [stageResult, setStageResult]     = useState<StageResult | null>(null);
  const [stageError, setStageError]       = useState<string | null>(null);

  const [generating, setGenerating]     = useState(false);
  const [videoResult, setVideoResult]   = useState<VideoResult | null>(null);
  const [videoError, setVideoError]     = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setEnhanceResult(null);
    setStageResult(null);
    setVideoResult(null);
    setEnhanceError(null);
    setStageError(null);
    setVideoError(null);
  }

  async function runEnhance() {
    if (!file) return;
    setEnhancing(true);
    setEnhanceError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/enhance", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setEnhanceResult(data);
    } catch (e: unknown) {
      setEnhanceError(e instanceof Error ? e.message : String(e));
    } finally {
      setEnhancing(false);
    }
  }

  async function runStage() {
    if (!enhanceResult) return;
    setStaging(true);
    setStageError(null);
    try {
      const res  = await fetch("/api/stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: enhanceResult.enhanced_url, style: selectedStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bilinmeyen hata");
      setStageResult(data);
    } catch (e: unknown) {
      setStageError(e instanceof Error ? e.message : String(e));
    } finally {
      setStaging(false);
    }
  }

  async function runVideo() {
    const imageUrl = stageResult?.staged_url ?? enhanceResult?.enhanced_url;
    if (!imageUrl) return;
    setGenerating(true);
    setVideoError(null);
    try {
      const res  = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt: "Smooth cinematic flyover of this furnished real estate property, professional quality",
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

  const totalCost =
    (enhanceResult?.cost_usd ?? 0) +
    (stageResult?.cost_usd ?? 0) +
    (videoResult?.cost_usd ?? 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Başlık */}
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">API Test Stüdyosu</h2>
        <p className="text-sm text-muted-foreground">
          fal.ai iyileştirme · fal.ai flux/dev staging · kie.ai video — gerçek anahtarlarla test et.
        </p>
      </div>

      {/* API anahtar hatırlatıcısı */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Anahtarlar</span>
        {[
          { label: "fal.ai", key: "FAL_KEY" },
          { label: "kie.ai", key: "KIE_API_KEY" },
        ].map((a) => (
          <div key={a.key} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-medium">{a.label}</span>
            <span className="text-xs text-muted-foreground">({a.key})</span>
          </div>
        ))}
      </div>

      {/* ── Adım 1: Yükle & İyileştir ── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="mb-4 font-semibold">1 · Fotoğraf yükle → fal.ai clarity-upscaler</h3>

        <div
          role="button" tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors ${
            file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
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
            <p className="truncate text-sm text-muted-foreground">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
            <Button onClick={runEnhance} disabled={enhancing} className="shrink-0 gap-2">
              {enhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {enhancing ? "İyileştiriliyor…" : "fal.ai ile iyileştir"}
            </Button>
          </div>
        )}
        {enhanceError && <ErrorBox msg={enhanceError} />}
      </section>

      {/* ── Adım 2: İyileştirme sonucu ── */}
      {enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-success" />
              2 · İyileştirme sonucu
            </h3>
            <Badge label={`${enhanceResult.elapsed_s}s · ~$${enhanceResult.cost_usd.toFixed(2)}`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Orijinal</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Orijinal" className="w-full rounded-lg border border-border object-contain" />
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">İyileştirilmiş</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={enhanceResult.enhanced_url} alt="İyileştirilmiş" className="w-full rounded-lg border border-primary/30 object-contain" />
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Model: {enhanceResult.model}</p>
        </section>
      )}

      {/* ── Adım 3: Staging ── */}
      {enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-semibold">
            {stageResult ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                3 · Staging sonucu
              </span>
            ) : "3 · fal.ai flux/dev ile sanal staging"}
          </h3>

          {/* Stil seçici */}
          {!stageResult && (
            <div className="mb-4 flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSelectedStyle(s.key)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedStyle === s.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {stageResult ? (
            <>
              <div className="mb-3 flex justify-end">
                <Badge label={`${stageResult.elapsed_s}s · ~$${stageResult.cost_usd.toFixed(2)}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">İyileştirilmiş</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={enhanceResult.enhanced_url} alt="İyileştirilmiş" className="w-full rounded-lg border border-border object-contain" />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Staged · {STYLES.find((s) => s.key === stageResult.style)?.label}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stageResult.staged_url} alt="Staged" className="w-full rounded-lg border border-primary/30 object-contain" />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Model: {stageResult.model}</p>
              <button
                onClick={() => { setStageResult(null); setStageError(null); setVideoResult(null); }}
                className="mt-3 text-xs text-muted-foreground underline"
              >
                Farklı stil dene
              </button>
            </>
          ) : (
            <Button onClick={runStage} disabled={staging} className="gap-2">
              {staging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Armchair className="h-4 w-4" />}
              {staging ? "Staging yapılıyor… (~20s)" : `${STYLES.find((s) => s.key === selectedStyle)?.label} staging uygula`}
            </Button>
          )}
          {stageError && <ErrorBox msg={stageError} />}
        </section>
      )}

      {/* ── Adım 4: Video ── */}
      {(stageResult ?? (enhanceResult && !staging)) && enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          {videoResult ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  4 · Video sonucu
                </h3>
                <Badge label={`${videoResult.elapsed_s}s · ~$${videoResult.cost_usd.toFixed(2)}`} />
              </div>
              <video src={videoResult.video_url} controls autoPlay loop className="w-full rounded-lg border border-border" />
              <p className="mt-2 text-xs text-muted-foreground">Model: {videoResult.model}</p>
            </>
          ) : (
            <>
              <h3 className="mb-4 font-semibold">4 · kie.ai ile drone-tarzı video</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {stageResult ? "Staged görsel" : "İyileştirilmiş görsel"} kullanılacak → 5 saniyelik tanıtım videosu
              </p>
              <Button onClick={runVideo} disabled={generating} className="gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clapperboard className="h-4 w-4" />}
                {generating ? "Video üretiliyor… (60-120s)" : "kie.ai ile video üret"}
              </Button>
              {generating && (
                <p className="mt-2 text-xs text-muted-foreground">60-120 saniye sürebilir. Sayfa açık kalsın.</p>
              )}
            </>
          )}
          {videoError && <ErrorBox msg={videoError} />}
        </section>
      )}

      {/* ── Maliyet özeti ── */}
      {(enhanceResult ?? stageResult ?? videoResult) && (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-4 font-semibold">Maliyet özeti</h3>
          <div className="space-y-2.5 text-sm">
            {enhanceResult && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">fal.ai · clarity-upscaler (iyileştirme)</span>
                <span className="font-semibold tabular-nums">${enhanceResult.cost_usd.toFixed(3)}</span>
              </div>
            )}
            {stageResult && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  fal.ai · flux/dev img2img (staging · {STYLES.find((s) => s.key === stageResult.style)?.label})
                </span>
                <span className="font-semibold tabular-nums">${stageResult.cost_usd.toFixed(3)}</span>
              </div>
            )}
            {videoResult && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">kie.ai · img2video (5s video)</span>
                <span className="font-semibold tabular-nums">${videoResult.cost_usd.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-primary/20 pt-3 text-base">
              <span className="font-semibold">Toplam (bu ilan)</span>
              <span className="font-bold tabular-nums text-primary">${totalCost.toFixed(3)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            * Tahmini fiyatlar. Gerçek maliyet için{" "}
            <a href="https://fal.ai/dashboard" target="_blank" rel="noopener noreferrer" className="underline">fal.ai</a>
            {" "}ve{" "}
            <a href="https://kieai.erweima.ai" target="_blank" rel="noopener noreferrer" className="underline">kie.ai</a>
            {" "}panellerini kontrol et.
          </p>
        </section>
      )}
    </div>
  );
}
