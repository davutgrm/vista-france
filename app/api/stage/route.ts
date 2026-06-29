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

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json(
      { error: "FAL_KEY .env.local'de ayarlanmamış" },
      { status: 500 }
    );
  }

  fal.config({ credentials: process.env.FAL_KEY });

  const { image_url, style = "scandinavian", strength = 0.65 } =
    await req.json() as { image_url?: string; style?: string; strength?: number };

  if (!image_url) {
    return NextResponse.json({ error: "image_url gerekli" }, { status: 400 });
  }

  const prompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.scandinavian;
  const t0 = Date.now();

  const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: {
      image_url,
      prompt,
      strength,          // 0.65 = oda yapısını koru, mobilyayı değiştir
      num_inference_steps: 28,
      guidance_scale: 3.5,
    } as any,
  });

  const data = result.data as Record<string, any>;
  const stagedUrl: string | undefined =
    data.images?.[0]?.url ?? data.image?.url;

  if (!stagedUrl) {
    return NextResponse.json(
      { error: "fal.ai görsel URL döndürmedi", detail: data },
      { status: 502 }
    );
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  return NextResponse.json({
    staged_url: stagedUrl,
    style,
    elapsed_s: parseFloat(elapsed),
    // fal-ai/flux/dev img2img: ~$0.025/görsel
    cost_usd: 0.025,
    model: "fal-ai/flux/dev/image-to-image",
  });
}
