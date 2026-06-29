import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

function err(msg: string, detail?: unknown, status = 500) {
  console.error("[enhance]", msg, detail ?? "");
  return NextResponse.json({ error: msg, detail: detail ?? null }, { status });
}

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return err("FAL_KEY .env.local'de ayarlanmamış. https://fal.ai/dashboard/keys adresinden al.", undefined, 500);
  }

  fal.config({ credentials: process.env.FAL_KEY });

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch (e) {
    return err("FormData okunamadı", String(e), 400);
  }

  if (!file) return err("file alanı eksik", undefined, 400);

  const t0 = Date.now();

  let imageUrl: string;
  try {
    imageUrl = await fal.storage.upload(file);
  } catch (e: unknown) {
    return err("fal.ai storage upload başarısız", String(e));
  }

  let result: Awaited<ReturnType<typeof fal.subscribe>>;
  try {
    result = await fal.subscribe("fal-ai/clarity-upscaler", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: {
        image_url: imageUrl,
        prompt: "real estate interior photo, professional, bright, clean, high quality",
        creativity: 0.30,
        resemblance: 0.65,
        num_inference_steps: 18,
      } as any,
    });
  } catch (e: unknown) {
    return err("fal-ai/clarity-upscaler çağrısı başarısız", String(e));
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const data = result.data as Record<string, any>;
  const enhancedUrl: string | null = data.image?.url ?? data.images?.[0]?.url ?? null;

  if (!enhancedUrl) {
    return err("fal.ai görsel URL döndürmedi", data);
  }

  return NextResponse.json({
    original_url: imageUrl,
    enhanced_url: enhancedUrl,
    elapsed_s: parseFloat(elapsed),
    cost_usd: 0.05,
    model: "fal-ai/clarity-upscaler",
  });
}
