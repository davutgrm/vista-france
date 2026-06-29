import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const STYLE_PROMPTS: Record<string, string> = {
  scandinavian:
    "Scandinavian style living room, light oak furniture, white linen sofa, minimalist decor, potted plants, warm natural light, professional real estate photography, photorealistic",
  modern:
    "Modern minimalist interior, sleek low-profile furniture, neutral palette, floor-to-ceiling windows, natural light, professional real estate photography, photorealistic",
  warmwood:
    "Warm wood interior design, natural walnut furniture, cozy throw pillows, earth tones, ambient lighting, professional real estate photography, photorealistic",
  industrial:
    "Industrial loft interior, exposed concrete walls, dark metal furniture, Edison pendant lights, urban aesthetic, professional real estate photography, photorealistic",
};

function err(msg: string, detail?: unknown, status = 500) {
  console.error("[stage]", msg, detail ?? "");
  return NextResponse.json({ error: msg, detail: detail ?? null }, { status });
}

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return err("FAL_KEY .env.local'de ayarlanmamış", undefined, 500);
  }

  fal.config({ credentials: process.env.FAL_KEY });

  let body: { image_url?: string; style?: string; strength?: number };
  try {
    body = await req.json();
  } catch (e) {
    return err("İstek gövdesi JSON değil", String(e), 400);
  }

  const { image_url, style = "scandinavian", strength = 0.65 } = body;
  if (!image_url) return err("image_url gerekli", undefined, 400);

  const prompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.scandinavian;
  const t0 = Date.now();

  let result: Awaited<ReturnType<typeof fal.subscribe>>;
  try {
    result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: {
        image_url,
        prompt,
        strength,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      } as any,
    });
  } catch (e: unknown) {
    return err("fal-ai/flux/dev/image-to-image çağrısı başarısız", String(e));
  }

  const data = result.data as Record<string, any>;
  const stagedUrl: string | null = data.images?.[0]?.url ?? data.image?.url ?? null;

  if (!stagedUrl) return err("fal.ai görsel URL döndürmedi", data, 502);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  return NextResponse.json({
    staged_url: stagedUrl,
    style,
    elapsed_s: parseFloat(elapsed),
    cost_usd: 0.025,
    model: "fal-ai/flux/dev/image-to-image",
  });
}
