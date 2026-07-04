"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Wand2, Clapperboard, Armchair, Upload, Loader2, AlertCircle, CheckCircle2, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface EnhanceResult {
  original_url: string;
  enhanced_url: string;
  width: number | null;
  height: number | null;
  elapsed_s: number;
  cost_usd: number;
  model: string;
}

interface StageResult {
  staged_url: string;
  style: string;
  elapsed_s: number;
  cost_usd?: number;
  model: string;
}

interface VideoResult {
  video_url: string;
  elapsed_s: number;
  cost_usd: number;
  model: string;
}

const STYLES = [
  { key: "scandinavian", label: "Scandinave" },
  { key: "modern",       label: "Minimaliste moderne" },
  { key: "warmwood",     label: "Bois chaleureux" },
  { key: "industrial",   label: "Industriel" },
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

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
      {label}
    </span>
  );
}

async function downloadFile(url: string, filename: string) {
  const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("proxy error");
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
  } catch {
    window.open(url, "_blank", "noopener");
  }
}

function DownloadButton({ url, filename }: { url: string; filename: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => { setBusy(true); await downloadFile(url, filename); setBusy(false); }}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      {busy ? "Téléchargement…" : "Télécharger"}
    </button>
  );
}

export default function TestPage() {
  return (
    <Suspense>
      <TestPageInner />
    </Suspense>
  );
}

function TestPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const [listingId, setListingId]           = useState<string | null>(searchParams.get("listing"));
  const [listingAddress, setListingAddress] = useState<string | null>(null);
  const [saveError, setSaveError]           = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!listingId) return;
    const supabase = createClient();
    supabase.from("listings").select("address").eq("id", listingId).single()
      .then(({ data }) => { if (data) setListingAddress(data.address as string); });
  }, [listingId]);

  // Ensures every generation is tied to a real, persisted listing row —
  // creates one on first use if the page was opened without ?listing=<id>.
  const ensureListingId = useCallback(async (fileName?: string): Promise<string> => {
    if (listingId) return listingId;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Session non active, impossible d'enregistrer");
    const address = fileName ? `Nouvelle annonce · ${fileName}` : `Nouvelle annonce · ${new Date().toLocaleDateString("fr-FR")}`;
    const { data, error } = await supabase.from("listings")
      .insert({ user_id: user.id, address })
      .select("id, address")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Impossible de créer l'annonce");
    setListingId(data.id);
    setListingAddress(data.address as string);
    router.replace(`/test?listing=${data.id}`);
    return data.id as string;
  }, [listingId, router]);

  async function persistToListing(fields: Record<string, unknown>, fileName?: string) {
    try {
      const id = await ensureListingId(fileName);
      const supabase = createClient();
      const { error } = await supabase.from("listings").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      setSaveError(null);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  }

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

  async function safeJson(res: Response): Promise<Record<string, unknown>> {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Erreur serveur (${res.status}): ${text.slice(0, 200)}`);
    }
  }

  async function runEnhance() {
    if (!file) return;
    setEnhancing(true);
    setEnhanceError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/enhance", { method: "POST", body: fd });
      const submitted = await safeJson(res);
      if (!res.ok) {
        const detail = submitted.detail ? ` → ${typeof submitted.detail === "string" ? submitted.detail : JSON.stringify(submitted.detail)}` : "";
        throw new Error(((submitted.error as string) ?? "Erreur inconnue") + detail);
      }

      const { status_url, response_url, original_url } = submitted as {
        status_url: string; response_url: string; original_url: string;
      };
      if (!status_url || !response_url) throw new Error("Impossible de démarrer l'amélioration : " + JSON.stringify(submitted));

      const t0 = Date.now();
      while (true) {
        await new Promise((r) => setTimeout(r, 4000));
        const pollRes = await fetch(
          `/api/enhance?status_url=${encodeURIComponent(status_url)}&response_url=${encodeURIComponent(response_url)}&original_url=${encodeURIComponent(original_url)}`
        );
        const poll = await safeJson(pollRes);
        if (!pollRes.ok) {
          const detail = poll.detail ? ` → ${typeof poll.detail === "string" ? poll.detail : JSON.stringify(poll.detail)}` : "";
          throw new Error(((poll.error as string) ?? "Erreur de suivi") + detail);
        }

        if (poll.status === "completed") {
          const enhanced_url = poll.enhanced_url as string;
          setEnhanceResult({
            original_url: poll.original_url as string,
            enhanced_url,
            width: poll.width as number | null,
            height: poll.height as number | null,
            elapsed_s: parseFloat(((Date.now() - t0) / 1000).toFixed(1)),
            cost_usd: poll.cost_usd as number ?? 0.03,
            model: poll.model as string ?? "",
          });
          await persistToListing({ enhanced_url, status: "enhancing", photos: 1 }, file.name);
          break;
        }
        if (poll.status === "failed" || poll.status === "error") {
          throw new Error("Échec de l'amélioration");
        }
      }
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
      const res = await fetch("/api/stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: enhanceResult.enhanced_url,
          style: selectedStyle,
          img_w: enhanceResult.width,
          img_h: enhanceResult.height,
        }),
      });
      const submitted = await safeJson(res);
      if (!res.ok) {
        const detail = submitted.detail ? ` → ${typeof submitted.detail === "string" ? submitted.detail : JSON.stringify(submitted.detail)}` : "";
        throw new Error(((submitted.error as string) ?? "Erreur inconnue") + detail);
      }

      const { style } = submitted as { request_id: string; style: string; status_url: string; response_url: string };
      let status_url = submitted.status_url as string;
      let response_url = submitted.response_url as string;
      if (!status_url || !response_url) throw new Error("Impossible de démarrer le home staging : " + JSON.stringify(submitted));

      let phase: "stage" | "sharpen" = "stage";
      let fallbackUrl: string | undefined;

      const t0 = Date.now();
      while (true) {
        await new Promise((r) => setTimeout(r, 4000));
        const qs = new URLSearchParams({ status_url, response_url, phase });
        if (fallbackUrl) qs.set("fallback_url", fallbackUrl);
        const pollRes = await fetch(`/api/stage?${qs.toString()}`);
        const poll = await safeJson(pollRes);
        if (!pollRes.ok) {
          const detail = poll.detail ? ` → ${typeof poll.detail === "string" ? poll.detail : JSON.stringify(poll.detail)}` : "";
          throw new Error(((poll.error as string) ?? "Erreur de suivi") + detail);
        }

        if (poll.status === "processing" && poll.phase === "sharpen") {
          phase = "sharpen";
          status_url = poll.status_url as string;
          response_url = poll.response_url as string;
          fallbackUrl = poll.fallback_url as string;
          continue;
        }

        if (poll.status === "completed") {
          const staged_url = poll.staged_url as string;
          setStageResult({
            staged_url,
            style,
            elapsed_s: parseFloat(((Date.now() - t0) / 1000).toFixed(1)),
            cost_usd: poll.cost_usd as number ?? 0.05,
            model: poll.model as string ?? "",
          });
          await persistToListing({ staged_url, status: "staged" });
          break;
        }
        if (poll.status === "failed" || poll.status === "error") {
          throw new Error("Échec du home staging");
        }
      }
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
          prompt: "Smooth, continuous camera movement panning slowly across the room from left to right, like a real estate walkthrough video. Natural depth and parallax between foreground and background. Room and furniture must stay structurally identical to the source image throughout - no morphing, no new objects appearing, no walls or windows changing shape.",
        }),
      });
      const submitted = await safeJson(res);
      if (!res.ok) throw new Error((submitted.error as string) ?? JSON.stringify(submitted.detail ?? submitted));

      const { task_id } = submitted as { task_id: string };
      if (!task_id) throw new Error("Impossible de démarrer la génération vidéo : " + JSON.stringify(submitted));

      const t0 = Date.now();
      const MAX_WAIT_MS = 10 * 60 * 1000; // Le rendu Kling peut parfois prendre plusieurs minutes
      while (true) {
        if (Date.now() - t0 > MAX_WAIT_MS) throw new Error("La génération vidéo n'a pas abouti en 10 minutes");
        await new Promise((r) => setTimeout(r, 5000));

        const pollRes = await fetch(`/api/video?task_id=${encodeURIComponent(task_id)}`);
        const poll = await safeJson(pollRes);
        if (!pollRes.ok) {
          const detail = poll.detail ? ` → ${typeof poll.detail === "string" ? poll.detail : JSON.stringify(poll.detail)}` : "";
          throw new Error(((poll.error as string) ?? "Erreur de suivi") + detail);
        }

        if (poll.status === "completed") {
          const video_url = poll.video_url as string;
          setVideoResult({
            video_url,
            elapsed_s: parseFloat(((Date.now() - t0) / 1000).toFixed(1)),
            cost_usd: poll.cost_usd as number ?? 0.20,
            model: poll.model as string ?? "",
          });
          await persistToListing({ video_url, video: true, status: "ready" });
          break;
        }
      }
    } catch (e: unknown) {
      setVideoError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Titre */}
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Test du studio</h2>
        <p className="text-sm text-muted-foreground">
          Téléversez une photo, améliorez-la, meublez-la et générez une vidéo de présentation.
        </p>
        {listingAddress && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <Save className="h-3.5 w-3.5" /> Les résultats sont enregistrés dans l&rsquo;annonce &laquo; {listingAddress} &raquo;
          </p>
        )}
        {saveError && <ErrorBox msg={`Le résultat n'a pas pu être enregistré dans l'annonce : ${saveError}`} />}
      </div>

      {/* ── Étape 1 : Téléverser & Améliorer ── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="mb-4 font-semibold">1 · Téléverser et améliorer une photo</h3>

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
            <img src={preview} alt="Photo téléversée" className="max-h-52 rounded-lg object-contain" />
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Cliquez ou glissez-déposez · JPG, PNG, WEBP</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onFileChange} />

        {file && (
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="truncate text-sm text-muted-foreground">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
            <Button onClick={runEnhance} disabled={enhancing} className="shrink-0 gap-2">
              {enhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {enhancing ? "Amélioration en cours…" : "Améliorer"}
            </Button>
          </div>
        )}
        {enhanceError && <ErrorBox msg={enhanceError} />}
      </section>

      {/* ── Étape 2 : Résultat de l'amélioration ── */}
      {enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-success" />
              2 · Résultat de l&rsquo;amélioration
            </h3>
            <StatusBadge label={`${enhanceResult.elapsed_s}s`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Original" className="w-full rounded-lg border border-border object-contain" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Amélioré</p>
                <DownloadButton url={enhanceResult.enhanced_url} filename="enhanced.jpg" />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={enhanceResult.enhanced_url} alt="Amélioré" className="w-full rounded-lg border border-primary/30 object-contain" />
            </div>
          </div>
        </section>
      )}

      {/* ── Étape 3 : Home staging ── */}
      {enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="mb-4 font-semibold">
            {stageResult ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                3 · Résultat du home staging
              </span>
            ) : "3 · Home staging virtuel"}
          </h3>

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
                <StatusBadge label={`${stageResult.elapsed_s}s`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Amélioré</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={enhanceResult.enhanced_url} alt="Amélioré" className="w-full rounded-lg border border-border object-contain" />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Meublé · {STYLES.find((s) => s.key === stageResult.style)?.label}
                    </p>
                    <DownloadButton url={stageResult.staged_url} filename={`staged-${stageResult.style}.jpg`} />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stageResult.staged_url} alt="Meublé" className="w-full rounded-lg border border-primary/30 object-contain" />
                </div>
              </div>
              <button
                onClick={() => { setStageResult(null); setStageError(null); setVideoResult(null); }}
                className="mt-3 text-xs text-muted-foreground underline"
              >
                Essayer un autre style
              </button>
            </>
          ) : (
            <Button onClick={runStage} disabled={staging} className="gap-2">
              {staging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Armchair className="h-4 w-4" />}
              {staging ? "Home staging en cours… (~20 s)" : `Appliquer le home staging ${STYLES.find((s) => s.key === selectedStyle)?.label}`}
            </Button>
          )}
          {stageError && <ErrorBox msg={stageError} />}
        </section>
      )}

      {/* ── Étape 4 : Vidéo ── */}
      {(stageResult ?? (enhanceResult && !staging)) && enhanceResult && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          {videoResult ? (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  4 · Vidéo de présentation
                </h3>
                <StatusBadge label={`${videoResult.elapsed_s}s`} />
              </div>
              <video src={videoResult.video_url} controls autoPlay loop className="w-full rounded-lg border border-border" />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {stageResult ? "Visuel meublé" : "Visuel amélioré"} utilisé comme source
                </p>
                <DownloadButton url={videoResult.video_url} filename="video-presentation.mp4" />
              </div>
            </>
          ) : (
            <>
              <h3 className="mb-4 font-semibold">4 · Générer la vidéo de présentation</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                En utilisant {stageResult ? "le visuel meublé" : "le visuel amélioré"} comme source, une vidéo de présentation de 5 secondes est générée.
              </p>
              <Button onClick={runVideo} disabled={generating} className="gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clapperboard className="h-4 w-4" />}
                {generating ? "Génération de la vidéo…" : "Générer la vidéo de présentation"}
              </Button>
              {generating && (
                <p className="mt-2 text-xs text-muted-foreground">60 secondes à quelques minutes. Gardez la page ouverte.</p>
              )}
            </>
          )}
          {videoError && <ErrorBox msg={videoError} />}
        </section>
      )}
    </div>
  );
}
