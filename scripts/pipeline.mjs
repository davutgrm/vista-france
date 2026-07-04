/**
 * pipeline.mjs — Visuimo görsel işleme pipeline
 *
 * Bütçe kuralları:
 *   - $0.90'a ulaşınca görsel işlemeyi durdur
 *   - Sonunda en az $0.25 bütçe kaldıysa, video üret
 *   - Toplam $1.00'ı asla aşma
 */

import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { fal } from "@fal-ai/client";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// ── .env.local ───────────────────────────────────────────────────────
function readEnv() {
  const envPath = path.join(projectRoot, ".env.local");
  const raw = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    env[m[1]] = m[2].split("").filter(c => c.charCodeAt(0) !== 65279).join("").trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const ENV = readEnv();
const FAL_KEY = ENV.FAL_KEY;
const KIE_KEY = ENV.KIE_API_KEY;

if (!FAL_KEY) { console.error("FAL_KEY bulunamadı!"); process.exit(1); }
if (!KIE_KEY) { console.error("KIE_API_KEY bulunamadı!"); process.exit(1); }

fal.config({ credentials: FAL_KEY });

// ── Bütçe ─────────────────────────────────────────────────────────────
const BUDGET_HARD   = 1.00;
const BUDGET_STOP   = 0.90;
const BUDGET_VIDEO  = 0.25;
const COST_ENHANCE  = 0.03;
const COST_STAGE    = 0.04;
const COST_STAGE_SR = 0.03;
const COST_VIDEO    = 0.20;

// ── Klasörler ─────────────────────────────────────────────────────────
const srcDir     = path.join(projectRoot, "public/images/source");
const galleryDir = path.join(projectRoot, "public/images/gallery");
const videosDir  = path.join(projectRoot, "public/videos");
for (const d of [galleryDir, videosDir]) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// ── Sharp helpers ─────────────────────────────────────────────────────
/**
 * Resize image so longest side <= maxPx, save as JPEG 90%.
 * Returns Buffer.
 */
async function resizeToMax(inputPath, maxPx) {
  return sharp(inputPath)
    .resize({ width: maxPx, height: maxPx, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Resize image URL (downloads first) so longest side <= maxPx, save as JPEG 90%.
 * Returns Buffer.
 */
async function resizeUrlToMax(url, maxPx) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  return sharp(buf)
    .resize({ width: maxPx, height: maxPx, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/** Upload a Buffer to fal storage, returns CDN URL */
async function uploadBuffer(buf, filename) {
  const blob = new Blob([buf], { type: "image/jpeg" });
  const file = new File([blob], filename, { type: "image/jpeg" });
  return fal.storage.upload(file);
}

// ── fal.ai ────────────────────────────────────────────────────────────
const FAL_QUEUE = "https://queue.fal.run";

async function enhance(falUrl) {
  const result = await fal.subscribe("fal-ai/aura-sr", {
    input: { image_url: falUrl, upscaling_factor: 2, overlapping_tiles: true },
  });
  const data = result.data;
  const imgObj = data.image ?? data.images?.[0] ?? null;
  const url = imgObj?.url ?? null;
  if (!url) throw new Error("aura-sr URL dönmedi: " + JSON.stringify(data));
  return url;
}

const STYLE = "scandinavian";
const PROMPT =
  "Professional real estate virtual staging photograph. This is an EDITING task, not generation - you must preserve the EXACT original room. Add only furniture to the empty floor space while keeping 100% of the existing architecture untouched." +
  " FURNITURE TO ADD (Scandinavian style): a white linen sofa along the main wall, a light oak coffee table centered in front of the sofa, an accent armchair on the opposite side to balance the room, a framed wall art on an empty wall, a potted plant in a corner, a small rug under the coffee table. Arrange everything in a balanced, professional interior-designer composition that fills the room naturally - not cramped to one corner. Furniture must be perfectly proportional to room size, properly grounded on the floor with realistic shadows and correct perspective." +
  " PRESERVE EXACTLY (do not touch, do not remove, do not duplicate): all walls, all windows, all doors, ceiling, floor material, camera angle, room dimensions, perspective, lighting, radiators/heaters (keep the exact same number), air conditioning units, ceiling lamps, light switches, electrical outlets/sockets, smoke detectors, vents, and any wall-mounted fixtures. If there is no radiator/heater in the original photo, do NOT add one." +
  " CRITICAL CANVAS CONSTRAINT: the output image must have the EXACT same pixel dimensions, aspect ratio, framing and crop as the input image. Do NOT reframe, zoom, crop, pad, letterbox, or resize the scene. Do not shrink or enlarge the room - its walls must reach the exact same edges of the frame as in the original photo. The camera angle, focal length, and perspective must stay exactly the same as the input - as if only furniture was pasted into the existing photograph, not a new photograph of the room." +
  " REALISTIC SCALE (critical): furniture must be scaled relative to real-world reference points visible in the room - a standard door is approximately 2 meters (78 inches) tall, ceiling height is approximately 2.4-2.7 meters (8-9 feet), a standard window sill is about 0.9 meters (3 feet) from the floor. Use these as scale anchors when sizing every furniture piece. Do NOT oversize furniture to fill the frame. A sofa should occupy no more than about 1/3 of the visible floor width and must sit well below door-handle height at the backrest. A coffee table top should sit roughly knee-height, well below the seat height of the sofa. If furniture looks larger than these real-world proportions, the composition is wrong." +
  " Do NOT add any built-in furniture, wall-mounted shelving units, cabinetry, or fixtures attached to walls. Only add freestanding furniture pieces (sofas, chairs, tables, rugs, lamps, plants) that could physically be moved out of the room. Walls must remain bare/unchanged except for freestanding decor like framed art leaned or hung simply." +
  " Do NOT add wall decals, wall murals, wallpaper patterns, or any painted/printed wall graphics. Walls must stay a single neutral solid color as in the original photo, only plain framed artwork (simple abstract prints or photography) may be added, hung flat against the wall, nothing illustrative or whimsical.";

const roundTo16 = (n) => Math.max(16, Math.floor(n / 16) * 16);

async function stage(imageUrl, imgW, imgH) {
  const w = roundTo16(imgW);
  const h = roundTo16(imgH);
  const maskUrl = `https://vista-umber-mu.vercel.app/api/mask?w=${w}&h=${h}`;

  const submitted = await fetch(`${FAL_QUEUE}/openai/gpt-image-2/edit`, {
    method: "POST",
    headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      image_urls: [imageUrl],
      mask_url: maskUrl,
      prompt: PROMPT,
      num_images: 1,
      image_size: { width: w, height: h },
      quality: "high",
    }),
  });
  const subText = await submitted.text();
  let subJson; try { subJson = JSON.parse(subText); } catch { throw new Error("fal queue JSON parse hatası: " + subText.slice(0, 200)); }
  if (!submitted.ok) throw new Error(`fal queue ${submitted.status}: ${subText.slice(0, 300)}`);

  const { status_url, response_url } = subJson;
  if (!status_url || !response_url) throw new Error("fal.ai queue URL'leri yok: " + JSON.stringify(subJson));

  while (true) {
    await sleep(5000);
    const pollRes = await fetch(status_url, { headers: { Authorization: `Key ${FAL_KEY}` } });
    const pollJson = await pollRes.json();
    const st = (pollJson.status ?? "unknown").toUpperCase();
    if (st === "COMPLETED") {
      const resultRes = await fetch(response_url, { headers: { Authorization: `Key ${FAL_KEY}` } });
      const resultJson = await resultRes.json();
      const stagedUrl = resultJson.images?.[0]?.url ?? null;
      if (!stagedUrl) throw new Error("Staging URL yok: " + JSON.stringify(resultJson));
      return stagedUrl;
    }
    if (st === "FAILED" || st === "ERROR") throw new Error("Staging başarısız: " + JSON.stringify(pollJson));
    process.stdout.write(".");
  }
}

async function sharpenStaged(stagedUrl) {
  try {
    const result = await fal.subscribe("fal-ai/aura-sr", {
      input: { image_url: stagedUrl, upscaling_factor: 2, overlapping_tiles: true },
    });
    return result.data?.image?.url ?? stagedUrl;
  } catch {
    return stagedUrl;
  }
}

// ── kie.ai ────────────────────────────────────────────────────────────
async function createVideo(imageUrl) {
  const createRes = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
    method: "POST",
    headers: { Authorization: `Bearer ${KIE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "kling-2.6/image-to-video",
      input: {
        prompt: "Smooth, continuous camera movement panning slowly across the room from left to right, like a real estate walkthrough video. Natural depth and parallax between foreground and background. Room and furniture must stay structurally identical to the source image throughout - no morphing, no new objects appearing, no walls or windows changing shape.",
        negative_prompt: "blur, distort, low quality, morphing, changing structure, new objects appearing, flickering, warping walls",
        image_urls: [imageUrl],
        sound: false,
        duration: "5",
      },
    }),
  });
  const createData = await createRes.json();
  if (!createRes.ok || createData.code !== 200) throw new Error("Kie.ai görev oluşturulamadı: " + JSON.stringify(createData));
  const taskId = createData.data?.taskId;
  if (!taskId) throw new Error("Kie.ai taskId yok");

  process.stdout.write("  Video üretiliyor (~60-120s)");
  for (let i = 0; i < 72; i++) {  // max 6 minutes
    await sleep(5000);
    let pollData;
    try {
      const pollRes = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
        headers: { Authorization: `Bearer ${KIE_KEY}` },
      });
      pollData = await pollRes.json();
    } catch { process.stdout.write("."); continue; }

    const d = pollData.data ?? {};
    if (d.state === "success") {
      let resultUrls;
      try { resultUrls = JSON.parse(d.resultJson ?? "{}").resultUrls ?? []; } catch { resultUrls = []; }
      const videoUrl = resultUrls[0] ?? null;
      if (!videoUrl) throw new Error("Kie.ai video URL yok: " + JSON.stringify(d));
      process.stdout.write(" ✓\n");
      return videoUrl;
    }
    if (d.state === "fail") throw new Error("Kie.ai render başarısız: " + (d.failMsg ?? ""));
    process.stdout.write(".");
  }
  throw new Error("Kie.ai zaman aşımı (6 dakika)");
}

// ── util ──────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fmt(n) { return "$" + n.toFixed(3); }
function sep(c = "─", n = 60) { return c.repeat(n); }

async function downloadSave(url, outPath) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return buf;
}

// ── MAIN ──────────────────────────────────────────────────────────────
async function main() {
  const sources = fs.readdirSync(srcDir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  console.log(sep("═"));
  console.log(`Visuimo Pipeline — ${sources.length} kaynak görsel`);
  console.log(`Bütçe: toplam ${fmt(BUDGET_HARD)} · dur ${fmt(BUDGET_STOP)} · video eşiği ${fmt(BUDGET_VIDEO)} kalan`);
  console.log(`Görsel önişleme: max 1024px kaynak → aura-sr 2x → max 1280px staging girişi`);
  console.log(sep("═"));

  let cumulative = 0;
  const processed = [];
  let lastFinalUrl = null;

  for (let i = 0; i < sources.length; i++) {
    const file = sources[i];
    const base = path.parse(file).name;
    const srcPath = path.join(srcDir, file);

    console.log(`\n[${i + 1}/${sources.length}] ${file}`);
    console.log(sep());

    if (cumulative + COST_ENHANCE > BUDGET_STOP) {
      console.log(`⛔  Bütçe eşiği ${fmt(BUDGET_STOP)} dolmak üzere. İşlem durduruluyor.`);
      console.log(`    Kümülatif: ${fmt(cumulative)} | İşlenmemiş: ${sources.slice(i).join(", ")}`);
      break;
    }

    // ── 1. Önişleme: max 1024px ──────────────────────────────────────
    process.stdout.write("  [ön] Resize max 1024px… ");
    let preBuf;
    try {
      preBuf = await resizeToMax(srcPath, 1024);
      const meta = await sharp(preBuf).metadata();
      console.log(`✓ (${meta.width}×${meta.height}, ${(preBuf.length/1024).toFixed(0)}KB)`);
    } catch (e) {
      console.error("\n  HATA (resize):", e.message); continue;
    }

    // ── 2. Upload & Enhance ──────────────────────────────────────────
    process.stdout.write("  [1/3] Upload + aura-sr enhance… ");
    const t0 = Date.now();
    let enhUrl;
    try {
      const preUrl = await uploadBuffer(preBuf, base + "-pre.jpg");
      enhUrl = await enhance(preUrl);
    } catch (e) {
      console.error("\n  HATA (enhance):", e.message); continue;
    }
    cumulative += COST_ENHANCE;

    // Download & resize enhanced to max 1280px for staging
    let enhBuf, enhW, enhH;
    try {
      enhBuf = await resizeUrlToMax(enhUrl, 1280);
      const meta = await sharp(enhBuf).metadata();
      enhW = meta.width; enhH = meta.height;
    } catch (e) {
      console.error("\n  HATA (enhanced download/resize):", e.message); continue;
    }

    // Save enhanced locally
    const enhPath = path.join(galleryDir, `${base}-enhanced.jpg`);
    fs.writeFileSync(enhPath, enhBuf);
    console.log(`✓ (${((Date.now()-t0)/1000).toFixed(1)}s, ${enhW}×${enhH})`);
    console.log(`  → kayıt: public/images/gallery/${base}-enhanced.jpg (${(enhBuf.length/1024).toFixed(0)}KB)`);
    console.log(`  🔖 Kümülatif: ${fmt(cumulative)} (bu adım: ${fmt(COST_ENHANCE)})`);

    if (cumulative + COST_STAGE + COST_STAGE_SR > BUDGET_STOP) {
      console.log(`  ⚠️  Staging için yeterli bütçe yok. Staging atlanıyor.`);
      processed.push({ base, enhPath, stagedPath: null });
      lastFinalUrl = enhUrl;
      continue;
    }

    // ── 3. Staging ───────────────────────────────────────────────────
    process.stdout.write(`  [2/3] gpt-image-2/edit staging (${STYLE})… `);
    const t1 = Date.now();
    let stagedRawUrl;
    try {
      // Re-upload resized enhanced for staging
      const enhUpUrl = await uploadBuffer(enhBuf, base + "-enh.jpg");
      stagedRawUrl = await stage(enhUpUrl, enhW, enhH);
    } catch (e) {
      console.error("\n  HATA (stage):", e.message);
      processed.push({ base, enhPath, stagedPath: null });
      lastFinalUrl = enhUrl;
      continue;
    }
    cumulative += COST_STAGE;
    console.log(`\n  ✓ staging (${((Date.now()-t1)/1000).toFixed(1)}s)`);
    console.log(`  🔖 Kümülatif: ${fmt(cumulative)} (bu adım: ${fmt(COST_STAGE)})`);

    // ── 4. Background aura-sr on staged ─────────────────────────────
    let finalStagedUrl = stagedRawUrl;
    if (cumulative + COST_STAGE_SR <= BUDGET_STOP) {
      process.stdout.write("  [3/3] Staging keskinleştirme (aura-sr)… ");
      const t2 = Date.now();
      try {
        finalStagedUrl = await sharpenStaged(stagedRawUrl);
        cumulative += COST_STAGE_SR;
        console.log(`✓ (${((Date.now()-t2)/1000).toFixed(1)}s)`);
        console.log(`  🔖 Kümülatif: ${fmt(cumulative)} (bu adım: ${fmt(COST_STAGE_SR)})`);
      } catch (e) {
        console.warn("\n  UYARI (background SR):", e.message);
      }
    }

    // Download staged, resize to max 1280px, save
    const stagedPath = path.join(galleryDir, `${base}-staged.jpg`);
    try {
      const stagedBuf = await resizeUrlToMax(finalStagedUrl, 1280);
      fs.writeFileSync(stagedPath, stagedBuf);
      const meta = await sharp(stagedBuf).metadata();

      // Re-upload for video use
      lastFinalUrl = await uploadBuffer(stagedBuf, base + "-staged-final.jpg");

      console.log(`  → kayıt: public/images/gallery/${base}-staged.jpg (${meta.width}×${meta.height}, ${(stagedBuf.length/1024).toFixed(0)}KB)`);
      processed.push({ base, enhPath, stagedPath });
    } catch (e) {
      console.error("  HATA (staged save):", e.message);
      lastFinalUrl = finalStagedUrl;
      processed.push({ base, enhPath, stagedPath: null });
    }

    console.log(`  🔖 Kümülatif: ${fmt(cumulative)}`);

    if (cumulative >= BUDGET_STOP) {
      console.log(`\n⛔  ${fmt(BUDGET_STOP)} eşiğine ulaşıldı. Görsel işleme durduruluyor.`);
      const remaining = sources.slice(i + 1);
      if (remaining.length > 0) console.log(`    İşlenmemiş: ${remaining.join(", ")}`);
      break;
    }
  }

  // ── Özet ──────────────────────────────────────────────────────────
  console.log("\n" + sep("═"));
  console.log("GÖRSEL İŞLEME TAMAMLANDI");
  console.log(sep("═"));
  console.log(`İşlenen       : ${processed.length} / ${sources.length} görsel`);
  console.log(`Staged        : ${processed.filter(p => p.stagedPath).length} görsel`);
  console.log(`Harcama       : ${fmt(cumulative)} (tahmini)`);
  console.log(`Kalan bütçe   : ${fmt(BUDGET_HARD - cumulative)}`);

  // ── Video ─────────────────────────────────────────────────────────
  const remaining = BUDGET_HARD - cumulative;
  if (remaining < BUDGET_VIDEO) {
    console.log(`\n⚠️  Video atlandı — kalan ${fmt(remaining)} < ${fmt(BUDGET_VIDEO)} eşiği. Bütçe yetersiz.`);
  } else if (!lastFinalUrl) {
    console.log("\n⚠️  Video için kaynak görsel yok.");
  } else {
    console.log(`\nKalan ${fmt(remaining)} ≥ ${fmt(BUDGET_VIDEO)} → video üretiliyor…`);
    try {
      const videoUrl = await createVideo(lastFinalUrl);
      cumulative += COST_VIDEO;
      const videoPath = path.join(videosDir, "tanitim-videosu.mp4");
      await downloadSave(videoUrl, videoPath);
      const vSize = fs.statSync(videoPath).size;
      console.log(`  → kayıt: public/videos/tanitim-videosu.mp4 (${(vSize/1024/1024).toFixed(1)}MB)`);
    } catch (e) {
      console.error("  HATA (video):", e.message);
    }
  }

  console.log(`\n🔖 TOPLAM HARCAMA (tahmini): ${fmt(cumulative)}`);

  // ── Dosya listesi ─────────────────────────────────────────────────
  console.log("\n" + sep("─"));
  console.log("Oluşturulan dosyalar:");
  for (const f of fs.readdirSync(galleryDir).sort()) {
    const s = fs.statSync(path.join(galleryDir, f));
    console.log(`  gallery/${f}  (${(s.size/1024).toFixed(0)}KB)`);
  }
  const vp = path.join(videosDir, "tanitim-videosu.mp4");
  if (fs.existsSync(vp)) {
    const s = fs.statSync(vp);
    console.log(`  videos/tanitim-videosu.mp4  (${(s.size/1024/1024).toFixed(1)}MB)`);
  }
  console.log(sep("═"));
}

main().catch(e => { console.error("Pipeline hatası:", e); process.exit(1); });
