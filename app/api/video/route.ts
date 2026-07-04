import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, deductCredits } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

const KIE_BASE = "https://api.kie.ai";
const CREDIT_COST = 9;

function err(msg: string, detail?: unknown, status = 500) {
  console.error("[video]", msg, detail ?? "");
  return NextResponse.json({ error: msg, detail: detail ?? null }, { status });
}

function getKieKey(): string | null {
  if (!process.env.KIE_API_KEY) return null;
  return process.env.KIE_API_KEY
    .split("").filter(c => c.charCodeAt(0) !== 65279).join("").trim();
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Vous devez être connecté" }, { status: 401 });

  const credit = await deductCredits(user.id, CREDIT_COST);
  if (!credit.ok) return NextResponse.json({ error: "Crédits insuffisants, veuillez mettre à niveau votre forfait" }, { status: 402 });

  const kieKey = getKieKey();
  if (!kieKey) return err("KIE_API_KEY non configurée", undefined, 500);

  let image_url: string | undefined;
  let prompt: string | undefined;
  try {
    const body = await req.json() as { image_url?: string; prompt?: string };
    image_url = body.image_url;
    prompt = body.prompt;
  } catch (e) {
    return err("Le corps de la requête n'est pas du JSON", String(e), 400);
  }

  if (!image_url) return err("image_url requis", undefined, 400);

  try {
    const createRes = await fetch(`${KIE_BASE}/api/v1/jobs/createTask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kieKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "kling-2.6/image-to-video",
        input: {
          prompt: prompt ?? "Smooth, continuous camera movement panning slowly across the room from left to right, like a real estate walkthrough video. Natural depth and parallax between foreground and background. Room and furniture must stay structurally identical to the source image throughout - no morphing, no new objects appearing, no walls or windows changing shape.",
          negative_prompt: "blur, distort, low quality, morphing, changing structure, new objects appearing, flickering, warping walls",
          image_urls: [image_url],
          sound: false,
          duration: "5",
        },
      }),
    });

    const text = await createRes.text();
    let createData: Record<string, any>;
    try {
      createData = JSON.parse(text);
    } catch {
      return err(`Réponse invalide de Kie.ai (${createRes.status})`, text.slice(0, 300), 502);
    }

    if (!createRes.ok || createData.code !== 200) {
      return err("Impossible de créer la tâche Kie.ai", createData, 502);
    }

    const taskId = createData.data?.taskId;
    if (!taskId) return err("Kie.ai n'a pas renvoyé de taskId", createData, 502);

    return NextResponse.json({ task_id: taskId, status: "queued" });
  } catch (e) {
    return err("Erreur de connexion à Kie.ai", String(e), 502);
  }
}

export async function GET(req: NextRequest) {
  const kieKey = getKieKey();
  if (!kieKey) return err("KIE_API_KEY non configurée", undefined, 500);

  const taskId = new URL(req.url).searchParams.get("task_id");
  if (!taskId) return err("task_id requis", undefined, 400);

  try {
    const pollRes = await fetch(`${KIE_BASE}/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${kieKey}` },
    });
    const text = await pollRes.text();

    let pollData: Record<string, any>;
    try {
      pollData = JSON.parse(text);
    } catch {
      return err("Réponse de statut invalide de Kie.ai", { httpStatus: pollRes.status, body: text.slice(0, 300) }, 502);
    }

    if (!pollRes.ok) return err("Échec de la requête de statut Kie.ai", pollData, 502);

    const d = pollData.data ?? {};
    const state: string | undefined = d.state;

    if (state === "success") {
      let videoUrl: string | undefined;
      try {
        const resultUrls = JSON.parse(d.resultJson ?? "{}").resultUrls as string[];
        videoUrl = resultUrls?.[0];
      } catch { /* erreur de parsing resultJson */ }

      if (!videoUrl) return err("Kie.ai n'a pas renvoyé d'URL vidéo", d, 502);

      return NextResponse.json({
        status: "completed",
        video_url: videoUrl,
        task_id: taskId,
        cost_usd: 0.20,
        model: "kie.ai/kling-2.6/image-to-video",
      });
    }

    if (state === "fail") {
      return err("Échec du rendu Kie.ai", { failMsg: d.failMsg, detail: d }, 502);
    }

    // state: waiting | queuing | generating → en cours
    return NextResponse.json({ status: "processing", state: state ?? "unknown" });
  } catch (e) {
    return err("Impossible d'interroger le statut", String(e), 502);
  }
}
