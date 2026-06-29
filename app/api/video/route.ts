import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 300; // video render 60-180s alabilir

// Kie.ai API — https://kieai.erweima.ai
// Endpoint yanlışsa gerçek hata yanıtı döner → kieai.erweima.ai/docs ile karşılaştır
const KIE_BASE = "https://kieai.erweima.ai";

export async function POST(req: NextRequest) {
  if (!process.env.KIE_API_KEY) {
    return NextResponse.json(
      { error: "KIE_API_KEY .env.local'de ayarlanmamış. https://kieai.erweima.ai adresinden al." },
      { status: 500 }
    );
  }

  const { image_url, prompt } = await req.json() as { image_url?: string; prompt?: string };
  if (!image_url) {
    return NextResponse.json({ error: "image_url gerekli" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.KIE_API_KEY}`,
    "Content-Type": "application/json",
  };

  const t0 = Date.now();

  // 1. Video üretim görevi oluştur
  const createRes = await fetch(`${KIE_BASE}/api/v1/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "img2video",
      imageUrl: image_url,
      prompt: prompt ?? "Smooth cinematic drone flyover of this real estate property",
      duration: 5,
      ratio: "16:9",
    }),
  });

  const createData = await createRes.json() as Record<string, any>;

  if (!createRes.ok || (createData.code !== undefined && createData.code !== 0 && createData.code !== 200)) {
    return NextResponse.json(
      { error: "Kie.ai görev oluşturulamadı", detail: createData },
      { status: 502 }
    );
  }

  const taskId: string = createData.data?.taskId ?? createData.data?.task_id ?? createData.taskId;
  if (!taskId) {
    return NextResponse.json(
      { error: "Kie.ai'den taskId gelmedi", detail: createData },
      { status: 502 }
    );
  }

  // 2. Tamamlanana kadar yokla (maks. 240s, 5s aralıklarla)
  for (let i = 0; i < 48; i++) {
    await new Promise((r) => setTimeout(r, 5000));

    const pollRes = await fetch(`${KIE_BASE}/api/v1/query/${taskId}`, { headers });
    const pollData = await pollRes.json() as Record<string, any>;
    const d = pollData.data ?? pollData;

    const videoUrl: string | undefined =
      d.videoUrl ?? d.video_url ?? d.result?.videoUrl ?? d.result?.video_url;

    if (videoUrl) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      return NextResponse.json({
        video_url: videoUrl,
        task_id: taskId,
        elapsed_s: parseFloat(elapsed),
        // Fiyat tahmini: kie.ai ~$0.10-0.30 / 5 saniyelik video (plana göre değişir)
        cost_usd: 0.20,
        model: "kie.ai/img2video",
      });
    }

    const status: string | undefined = d.status ?? d.state;
    if (status === "failed" || status === "error") {
      return NextResponse.json(
        { error: "Kie.ai render başarısız", detail: pollData },
        { status: 502 }
      );
    }
  }

  return NextResponse.json(
    { error: "Kie.ai zaman aşımı — 240 saniyede tamamlanamadı" },
    { status: 504 }
  );
}
