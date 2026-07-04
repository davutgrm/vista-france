import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, deductCredits } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 120;

const CREDIT_COST = 2;

const MODEL_PATH = "openai/gpt-image-2/edit";
const FAL_QUEUE_BASE = "https://queue.fal.run";

const PRESERVE =
  " PRESERVE EXACTLY (do not touch, do not remove, do not duplicate): all walls, all windows, all doors, ceiling, floor material, camera angle, room dimensions, perspective, lighting, radiators/heaters (keep the exact same number), air conditioning units, ceiling lamps, light switches, electrical outlets/sockets (keep the exact same number, do not add extra ones), smoke detectors, vents, and any wall-mounted fixtures - these must remain pixel-identical to the original. CRITICAL: the radiator/heater must remain visible and unchanged, exactly in its original position - never remove it. If there is no radiator/heater in the original photo, do NOT add one. Only preserve what already exists - do not add heating fixtures, electrical outlets, or any wall-mounted objects that were not in the original image." +
  " CRITICAL CANVAS CONSTRAINT: the output image must have the EXACT same pixel dimensions, aspect ratio, framing and crop as the input image. Do NOT reframe, zoom, crop, pad, letterbox, or resize the scene. Do not shrink or enlarge the room - its walls must reach the exact same edges of the frame as in the original photo. The camera angle, focal length, and perspective must stay exactly the same as the input - as if only furniture was pasted into the existing photograph, not a new photograph of the room.";

const PROMPT_BASE =
  "Professional real estate virtual staging photograph. This is an EDITING task, not generation - you must preserve the EXACT original room. Add only furniture to the empty floor space while keeping 100% of the existing architecture untouched.";

const SCALE_ANCHOR =
  " REALISTIC SCALE (critical): furniture must be scaled relative to real-world reference points visible in the room - a standard door is approximately 2 meters (78 inches) tall, ceiling height is approximately 2.4-2.7 meters (8-9 feet), a standard window sill is about 0.9 meters (3 feet) from the floor. Use these as scale anchors when sizing every furniture piece. Do NOT oversize furniture to fill the frame. A sofa should occupy no more than about 1/3 of the visible floor width and must sit well below door-handle height at the backrest. A coffee table top should sit roughly knee-height, well below the seat height of the sofa. If furniture looks larger than these real-world proportions, the composition is wrong.";

const FREESTANDING_ONLY =
  " Do NOT add any built-in furniture, wall-mounted shelving units, cabinetry, or fixtures attached to walls. Only add freestanding furniture pieces (sofas, chairs, tables, rugs, lamps, plants) that could physically be moved out of the room. Walls must remain bare/unchanged except for freestanding decor like framed art leaned or hung simply.";

const NO_WALL_GRAPHICS =
  " Do NOT add wall decals, wall murals, wallpaper patterns, or any painted/printed wall graphics. Walls must stay a single neutral solid color as in the original photo, only plain framed artwork (simple abstract prints or photography) may be added, hung flat against the wall, nothing illustrative or whimsical.";

const STYLE_FURNITURE: Record<string, string> = {
  scandinavian:
    " FURNITURE TO ADD (Scandinavian style): a white linen sofa along the main wall, a light oak coffee table centered in front of the sofa, an accent armchair on the opposite side to balance the room, a framed wall art on an empty wall, a potted plant in a corner, a small rug under the coffee table. Arrange everything in a balanced, professional interior-designer composition that fills the room naturally - not cramped to one corner. Furniture must be perfectly proportional to room size, properly grounded on the floor with realistic shadows and correct perspective.",
  modern:
    " FURNITURE TO ADD (Modern minimalist style): a gray modular sofa along the main wall, a marble coffee table centered in front, a minimal accent chair, abstract framed wall art, an indoor plant, a geometric rug. Balanced composition, proportional to room, realistic shadows.",
  warmwood:
    " FURNITURE TO ADD (Warm wood style): a walnut-toned sofa along the main wall, a round oak coffee table centered in front, a cozy armchair, a woven rug, warm-toned wall art, a potted plant. Balanced composition, proportional to room, realistic shadows.",
  industrial:
    " FURNITURE TO ADD (Industrial style): a dark leather sofa along the main wall, a steel-frame coffee table centered in front, a metal accent chair, Edison-bulb floor lamp, a distressed rug, black-framed wall art. Balanced composition, proportional to room, realistic shadows.",
};

function err(msg: string, detail?: unknown, status = 500) {
  console.error("[stage]", msg, detail ?? "");
  return NextResponse.json({ error: msg, detail: detail ?? null }, { status });
}

function getKey() {
  return (process.env.FAL_KEY ?? "")
    .split("").filter((c) => c.charCodeAt(0) !== 65279).join("").trim();
}

async function detectImageDimensions(url: string): Promise<{ w: number; h: number } | null> {
  try {
    const res = await fetch(url, { headers: { Range: "bytes=0-65535" } });
    const buf = Buffer.from(await res.arrayBuffer());

    // PNG
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf.length >= 24) {
      return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    }

    // WebP
    if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
      const chunk = buf.slice(12, 16).toString("ascii");
      if (chunk === "VP8X" && buf.length >= 30) {
        const w = (buf[24] | (buf[25] << 8) | (buf[26] << 16)) + 1;
        const h = (buf[27] | (buf[28] << 8) | (buf[29] << 16)) + 1;
        return { w, h };
      }
      if (chunk === "VP8 " && buf.length >= 34) {
        if (buf[20] === 0x9d && buf[21] === 0x01 && buf[22] === 0x2a) {
          const w = (buf[23] | (buf[24] << 8)) & 0x3fff;
          const h = (buf[25] | (buf[26] << 8)) & 0x3fff;
          return { w, h };
        }
      }
      if (chunk === "VP8L" && buf.length >= 25) {
        const bits = (buf[21] | (buf[22] << 8) | (buf[23] << 16) | (buf[24] << 24)) >>> 0;
        const w = (bits & 0x3fff) + 1;
        const h = ((bits >>> 14) & 0x3fff) + 1;
        return { w, h };
      }
    }

    // JPEG — scan for SOF markers
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i + 4 < buf.length) {
        while (i < buf.length && buf[i] === 0xff) i++;
        if (i >= buf.length) break;
        const marker = buf[i++];
        if (marker === 0xd9 || marker === 0xda) break; // EOI or SOS
        if (marker === 0x00) continue;
        if (i + 2 > buf.length) break;
        const segLen = buf.readUInt16BE(i);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          if (i + 7 < buf.length) {
            return { h: buf.readUInt16BE(i + 3), w: buf.readUInt16BE(i + 5) };
          }
        }
        i += segLen;
      }
    }

    return null;
  } catch (e) {
    console.warn("[stage] detectImageDimensions failed:", String(e));
    return null;
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Vous devez être connecté" }, { status: 401 });

  const credit = await deductCredits(user.id, CREDIT_COST);
  if (!credit.ok) return NextResponse.json({ error: "Crédits insuffisants, veuillez mettre à niveau votre forfait" }, { status: 402 });

  const key = getKey();
  if (!key) return err("FAL_KEY non configurée", undefined, 500);

  let body: { image_url?: string; style?: string; img_w?: number; img_h?: number };
  try { body = await req.json(); } catch (e) { return err("JSON invalide", String(e), 400); }

  const { image_url, style = "scandinavian", img_w, img_h } = body;
  if (!image_url) return err("image_url requis", undefined, 400);

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://vista-umber-mu.vercel.app")
    .split("").filter((c) => c.charCodeAt(0) !== 65279).join("").trim().replace(/\/$/, "");

  // Prefer the caller-reported dimensions (straight from the enhance step's own upstream
  // response) over re-detecting from image bytes — they're guaranteed to match the exact
  // image being sent to image_urls, whereas byte-range detection can be wrong or fall back.
  let rawW: number, rawH: number, dimsSource: string;
  if (img_w && img_h && img_w > 0 && img_h > 0) {
    rawW = Math.round(img_w);
    rawH = Math.round(img_h);
    dimsSource = "caller";
  } else {
    const dims = await detectImageDimensions(image_url);
    rawW = dims?.w ?? 896;
    rawH = dims?.h ?? 592; // 896×592 = observed gpt-image-2 fallback size
    dimsSource = dims ? "detected" : "fallback";
  }

  // gpt-image-2 requires custom image_size to be multiples of 16 — passing raw (unaligned)
  // dimensions gets silently rounded/resized by the model itself, which reintroduces the
  // exact canvas-mismatch/shrink bug even when we send the "correct" size. The API floors
  // the input image to the nearest lower multiple of 16 internally (confirmed via its own
  // "mask must match first image dimensions" error), so we must floor here too — rounding
  // up produces a mask larger than what the model actually uses and the request is rejected.
  const roundTo16 = (n: number) => Math.max(16, Math.floor(n / 16) * 16);
  const w = roundTo16(rawW);
  const h = roundTo16(rawH);

  const mask_url = `${appUrl}/api/mask?w=${w}&h=${h}`;
  const prompt = PROMPT_BASE + (STYLE_FURNITURE[style] ?? STYLE_FURNITURE.scandinavian) + PRESERVE + SCALE_ANCHOR + FREESTANDING_ONLY + NO_WALL_GRAPHICS;

  console.log("[stage POST] dims:", rawW, "×", rawH, "→ aligned:", w, "×", h, "source:", dimsSource, "mask:", mask_url);

  try {
    const submitRes = await fetch(`${FAL_QUEUE_BASE}/${MODEL_PATH}`, {
      method: "POST",
      headers: { "Authorization": `Key ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        image_urls: [image_url],
        mask_url,
        prompt,
        num_images: 1,
        image_size: { width: w, height: h },
        quality: "high",
      }),
    });

    const text = await submitRes.text();
    console.log("[stage POST] submit status:", submitRes.status, "body:", text.slice(0, 500));

    let submitJson: Record<string, unknown>;
    try { submitJson = JSON.parse(text); }
    catch { return err("Erreur de parsing JSON lors de l'envoi à fal.ai", { status: submitRes.status, body: text.slice(0, 300) }); }

    if (!submitRes.ok) return err("Échec de l'envoi à fal.ai", { httpStatus: submitRes.status, body: submitJson });

    const status_url = submitJson.status_url as string | undefined;
    const response_url = submitJson.response_url as string | undefined;
    const request_id = (submitJson.request_id ?? submitJson.requestId) as string | undefined;

    if (!status_url || !response_url) {
      return err("fal.ai n'a pas renvoyé les URLs", { request_id, status_url, response_url, keys: Object.keys(submitJson) });
    }

    return NextResponse.json({ request_id, status_url, response_url, status: "queued", style });
  } catch (e) { return err("Impossible d'envoyer à la file fal.ai", String(e)); }
}

const SHARPEN_MODEL_PATH = "fal-ai/aura-sr";

export async function GET(req: NextRequest) {
  const key = getKey();
  if (!key) return err("FAL_KEY non configurée", undefined, 500);

  const params = new URL(req.url).searchParams;
  const phase = params.get("phase") === "sharpen" ? "sharpen" : "stage";
  const status_url = params.get("status_url");
  const response_url = params.get("response_url");
  const fallback_url = params.get("fallback_url");

  if (!status_url || !response_url) return err("status_url / response_url requis", undefined, 400);

  try {
    const statusRes = await fetch(status_url, { headers: { "Authorization": `Key ${key}` } });
    const text = await statusRes.text();

    let statusJson: Record<string, unknown>;
    try { statusJson = JSON.parse(text); }
    catch { return err("Erreur de parsing JSON du statut fal.ai", { httpStatus: statusRes.status, body: text.slice(0, 300) }); }

    if (!statusRes.ok) return err("Échec de la requête de statut fal.ai", { httpStatus: statusRes.status, body: statusJson });

    const st = ((statusJson.status ?? "unknown") as string).toUpperCase();

    if (st === "FAILED") {
      // Sharpening is a cosmetic bonus step — fall back to the unsharpened staged image instead of failing the whole flow
      if (phase === "sharpen" && fallback_url) {
        return NextResponse.json({ status: "completed", staged_url: fallback_url, cost_usd: 0.04, model: MODEL_PATH });
      }
      return err("Échec du traitement fal.ai", statusJson, 502);
    }

    if (st !== "COMPLETED") return NextResponse.json({ status: st.toLowerCase(), phase });

    const resultRes = await fetch(response_url, { headers: { "Authorization": `Key ${key}` } });
    const resultText = await resultRes.text();

    let resultJson: Record<string, unknown>;
    try { resultJson = JSON.parse(resultText); }
    catch { return err("Erreur de parsing JSON du résultat fal.ai", resultText.slice(0, 300), 502); }

    if (phase === "stage") {
      const images = resultJson.images as Array<{ url: string }> | undefined;
      const stagedUrl = images?.[0]?.url ?? null;
      if (!stagedUrl) return err("URL d'image manquante", resultJson, 502);

      // Submit background sharpening as its own queued job instead of blocking this request on it
      try {
        const srSubmitRes = await fetch(`${FAL_QUEUE_BASE}/${SHARPEN_MODEL_PATH}`, {
          method: "POST",
          headers: { "Authorization": `Key ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: stagedUrl, upscaling_factor: 2, overlapping_tiles: true }),
        });
        const srText = await srSubmitRes.text();
        const srJson = JSON.parse(srText) as { status_url?: string; response_url?: string };

        if (srSubmitRes.ok && srJson.status_url && srJson.response_url) {
          return NextResponse.json({
            status: "processing",
            phase: "sharpen",
            status_url: srJson.status_url,
            response_url: srJson.response_url,
            fallback_url: stagedUrl,
          });
        }
        console.warn("[stage] aura-sr submit non-ok:", srSubmitRes.status, srText.slice(0, 200));
      } catch (e) {
        console.warn("[stage] aura-sr submit failed, using unsharpened staged_url:", String(e));
      }

      return NextResponse.json({ status: "completed", staged_url: stagedUrl, cost_usd: 0.04, model: MODEL_PATH });
    }

    // phase === "sharpen"
    const imgObj = (resultJson.image ?? (resultJson.images as Array<{ url: string }> | undefined)?.[0]) as
      { url?: string } | undefined;
    const finalUrl = imgObj?.url ?? fallback_url;
    if (!finalUrl) return err("URL d'image affinée manquante", resultJson, 502);

    return NextResponse.json({ status: "completed", staged_url: finalUrl, cost_usd: 0.04, model: MODEL_PATH });
  } catch (e) { return err("Impossible d'interroger le statut", String(e)); }
}
