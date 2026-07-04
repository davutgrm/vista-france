import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, deductCredits } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

const CREDIT_COST = 1;
const MODEL_PATH = "fal-ai/aura-sr";
const FAL_QUEUE_BASE = "https://queue.fal.run";

function err(msg: string, detail?: unknown, status = 500) {
  console.error("[enhance]", msg, detail ?? "");
  return NextResponse.json({ error: msg, detail: detail ?? null }, { status });
}

function getKey() {
  return (process.env.FAL_KEY ?? "")
    .split("").filter((c) => c.charCodeAt(0) !== 65279).join("").trim();
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });

  const credit = await deductCredits(user.id, CREDIT_COST);
  if (!credit.ok) return NextResponse.json({ error: "Krediniz yetersiz, planınızı yükseltin" }, { status: 402 });

  const key = getKey();
  if (!key) return err("FAL_KEY ayarlanmamış. https://fal.ai/dashboard/keys adresinden al.", undefined, 500);

  fal.config({ credentials: key });

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch (e) {
    return err("FormData okunamadı", String(e), 400);
  }

  if (!file) return err("file alanı eksik", undefined, 400);

  let imageUrl: string;
  try {
    imageUrl = await fal.storage.upload(file);
  } catch (e) {
    return err("fal.ai storage bağlantı hatası", String(e));
  }

  try {
    const submitRes = await fetch(`${FAL_QUEUE_BASE}/${MODEL_PATH}`, {
      method: "POST",
      headers: { "Authorization": `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        upscaling_factor: 2,
        overlapping_tiles: true,
      }),
    });

    const text = await submitRes.text();
    let submitJson: Record<string, unknown>;
    try { submitJson = JSON.parse(text); }
    catch { return err("fal.ai submit JSON parse hatası", { status: submitRes.status, body: text.slice(0, 300) }); }

    if (!submitRes.ok) return err("fal.ai submit başarısız", { httpStatus: submitRes.status, body: submitJson });

    const status_url = submitJson.status_url as string | undefined;
    const response_url = submitJson.response_url as string | undefined;
    const request_id = (submitJson.request_id ?? submitJson.requestId) as string | undefined;

    if (!status_url || !response_url) {
      return err("fal.ai URL'leri dönmedi", { request_id, status_url, response_url, keys: Object.keys(submitJson) });
    }

    return NextResponse.json({ request_id, status_url, response_url, original_url: imageUrl, status: "queued" });
  } catch (e) { return err("fal.ai kuyruğa gönderilemedi", String(e)); }
}

export async function GET(req: NextRequest) {
  const key = getKey();
  if (!key) return err("FAL_KEY ayarlanmamış", undefined, 500);

  const params = new URL(req.url).searchParams;
  const status_url = params.get("status_url");
  const response_url = params.get("response_url");
  const original_url = params.get("original_url");

  if (!status_url || !response_url) return err("status_url / response_url gerekli", undefined, 400);

  try {
    const statusRes = await fetch(status_url, { headers: { "Authorization": `Key ${key}` } });
    const text = await statusRes.text();

    let statusJson: Record<string, unknown>;
    try { statusJson = JSON.parse(text); }
    catch { return err("fal.ai status JSON parse hatası", { httpStatus: statusRes.status, body: text.slice(0, 300) }); }

    if (!statusRes.ok) return err("fal.ai durum sorgusu başarısız", { httpStatus: statusRes.status, body: statusJson });

    const st = ((statusJson.status ?? "unknown") as string).toUpperCase();

    if (st === "COMPLETED") {
      const resultRes = await fetch(response_url, { headers: { "Authorization": `Key ${key}` } });
      const resultText = await resultRes.text();

      let resultJson: Record<string, unknown>;
      try { resultJson = JSON.parse(resultText); }
      catch { return err("fal.ai result JSON parse hatası", resultText.slice(0, 300), 502); }

      const imgObj = (resultJson.image ?? (resultJson.images as Array<{ url: string }> | undefined)?.[0]) as
        { url?: string; width?: number; height?: number } | undefined;
      const enhancedUrl = imgObj?.url ?? null;
      if (!enhancedUrl) return err("fal.ai görsel URL döndürmedi", resultJson, 502);

      return NextResponse.json({
        status: "completed",
        original_url,
        enhanced_url: enhancedUrl,
        width: imgObj?.width ?? null,
        height: imgObj?.height ?? null,
        cost_usd: 0.03,
        model: MODEL_PATH,
      });
    }

    if (st === "FAILED") return err("fal.ai işlem başarısız", statusJson, 502);

    return NextResponse.json({ status: st.toLowerCase() });
  } catch (e) { return err("Durum sorgulanamadı", String(e)); }
}
