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
    return err("FAL_KEY .env.local'de ayarlanmamış. https://fal.ai/dashboard/keys adresinden al.", 500);
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

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const imageUrl = `data:${file.type || "image/jpeg"};base64,${base64}`;

  const t0 = Date.now();

  let result: Awaited<ReturnType<typeof fal.subscribe>>;
  try {
    // aura-sr: hızlı AI upscaler, base64 data URL destekler
    result = await fal.subscribe("fal-ai/aura-sr", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: {
        image_url: imageUrl,
        upscaling_factor: 2,
        overlapping_tiles: true,
      } as any,
    });
  } catch (e: unknown) {
    // Hata mesajının tamamını döndür — UI'da görünsün
    return err(`fal-ai/aura-sr başarısız: ${String(e)}`);
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const data = result.data as Record<string, any>;
  const enhancedUrl: string | null = data.image?.url ?? data.images?.[0]?.url ?? null;

  if (!enhancedUrl) {
    return err(`fal.ai URL döndürmedi. Ham yanıt: ${JSON.stringify(data)}`);
  }

  return NextResponse.json({
    original_url: "",
    enhanced_url: enhancedUrl,
    elapsed_s: parseFloat(elapsed),
    cost_usd: 0.03,
    model: "fal-ai/aura-sr",
  });
}
