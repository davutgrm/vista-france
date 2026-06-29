import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

function err(msg: string, status = 500) {
  console.error("[enhance]", msg);
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return err("FAL_KEY ayarlanmamış. https://fal.ai/dashboard/keys adresinden al.", 500);
  }

  fal.config({ credentials: process.env.FAL_KEY });

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch (e) {
    return err(`FormData okunamadı: ${String(e)}`, 400);
  }

  if (!file) return err("file alanı eksik", 400);

  // fal.ai storage'a ham binary olarak yükle (SDK'yı atlıyoruz — BOM sorunu yok)
  const arrayBuf = await file.arrayBuffer();

  let imageUrl: string;
  try {
    const uploadRes = await fetch("https://storage.fal.ai/upload", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        "Content-Type": file.type || "image/jpeg",
      },
      body: arrayBuf,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      return err(`fal.ai upload hatası (${uploadRes.status}): ${text}`);
    }

    const json = await uploadRes.json() as { url?: string };
    if (!json.url) return err(`fal.ai upload URL döndürmedi: ${JSON.stringify(json)}`);
    imageUrl = json.url;
  } catch (e) {
    return err(`fal.ai storage bağlantı hatası: ${String(e)}`);
  }

  // Yüklenen URL ile aura-sr çağır
  const t0 = Date.now();

  let result: Awaited<ReturnType<typeof fal.subscribe>>;
  try {
    result = await fal.subscribe("fal-ai/aura-sr", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: {
        image_url: imageUrl,
        upscaling_factor: 2,
        overlapping_tiles: true,
      } as any,
    });
  } catch (e) {
    return err(`fal-ai/aura-sr başarısız: ${String(e)}`);
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const data = result.data as Record<string, any>;
  const enhancedUrl: string | null = data.image?.url ?? data.images?.[0]?.url ?? null;

  if (!enhancedUrl) {
    return err(`fal.ai görsel URL döndürmedi. Yanıt: ${JSON.stringify(data)}`);
  }

  return NextResponse.json({
    original_url: imageUrl,
    enhanced_url: enhancedUrl,
    elapsed_s: parseFloat(elapsed),
    cost_usd: 0.03,
    model: "fal-ai/aura-sr",
  });
}
