import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      { error: "FAL_KEY .env.local'de ayarlanmamış. https://fal.ai/dashboard/keys adresinden al." },
      { status: 500 }
    );
  }

  fal.config({ credentials: process.env.FAL_KEY });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "file alanı eksik" }, { status: 400 });
  }

  const t0 = Date.now();

  // fal.ai storage'a yükle → kalıcı URL al
  const imageUrl = await fal.storage.upload(file);

  // Clarity Upscaler: emlak fotoğrafı için ışık + netlik iyileştirmesi
  const result = await fal.subscribe("fal-ai/clarity-upscaler", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: {
      image_url: imageUrl,
      prompt: "real estate interior photo, professional, bright, clean, high quality",
      creativity: 0.30,
      resemblance: 0.65,
      num_inference_steps: 18,
    } as any,
  });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const data = result.data as Record<string, any>;

  return NextResponse.json({
    original_url: imageUrl,
    enhanced_url: data.image?.url ?? data.images?.[0]?.url ?? null,
    elapsed_s: parseFloat(elapsed),
    // Fiyat tahmini: fal.ai clarity-upscaler ~$0.03-0.08/görsel
    cost_usd: 0.05,
    model: "fal-ai/clarity-upscaler",
  });
}
