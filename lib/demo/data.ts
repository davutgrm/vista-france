/**
 * Vista demo data — a real-estate agent's listing studio. With no API keys,
 * the studio renders from this file; gradient/SVG scenes stand in for the
 * generated images/videos. Wire fal.ai + Kie.ai (run /setup) for real renders.
 */
import type { L } from "@/lib/i18n/config";
import type { Scene } from "@/components/property-image";

export type ListingStatus = "queued" | "enhancing" | "staged" | "ready";

export interface Listing {
  id: string;
  address: string;
  district: string;
  price: string;
  beds: number;
  area: number; // m²
  status: ListingStatus;
  photos: number;
  video: boolean;
  tour: boolean;
  hue: string;
  scene: Scene;
}

export const listings: Listing[] = [
  { id: "l1", address: "Appartement Avenue Foch, 12e kat", district: "16e Arrondissement, Paris", price: "€450.000", beds: 3, area: 165, status: "ready", photos: 24, video: true, tour: true, hue: "255", scene: "city" },
  { id: "l2", address: "Villa Vue Mer", district: "Biarritz, Côte Basque", price: "€1.200.000", beds: 5, area: 320, status: "ready", photos: 38, video: true, tour: true, hue: "210", scene: "coast" },
  { id: "l3", address: "Maison avec Jardin", district: "Lyon 6e", price: "€320.000", beds: 4, area: 210, status: "staged", photos: 19, video: false, tour: true, hue: "150", scene: "house" },
  { id: "l4", address: "Loft, Immeuble Haussmannien", district: "Le Marais, Paris", price: "€280.000", beds: 2, area: 95, status: "enhancing", photos: 16, video: false, tour: false, hue: "30", scene: "loft" },
  { id: "l5", address: "Studio Investissement en Résidence", district: "Nice Centre", price: "€195.000", beds: 2, area: 88, status: "queued", photos: 12, video: false, tour: false, hue: "200", scene: "coast" },
  { id: "l6", address: "Mas & Terrain", district: "Luberon, Provence", price: "€680.000", beds: 3, area: 180, status: "ready", photos: 28, video: true, tour: false, hue: "110", scene: "vineyard" },
];

export interface StudioVideo {
  id: string;
  listing: string;
  style: L;
  duration: string;
  format: L;
  hue: string;
  scene: Scene;
}

export const videos: StudioVideo[] = [
  { id: "v1", listing: "Appartement Foch", style: { tr: "Sinematik drone", en: "Cinematic drone" }, duration: "0:42", format: { tr: "Yatay · Portal", en: "Landscape · Portal" }, hue: "255", scene: "city" },
  { id: "v2", listing: "Villa Biarritz", style: { tr: "Gün batımı turu", en: "Sunset tour" }, duration: "0:55", format: { tr: "Yatay · YouTube", en: "Landscape · YouTube" }, hue: "210", scene: "coast" },
  { id: "v3", listing: "Appartement Foch", style: { tr: "Hızlı Reels", en: "Snappy Reels" }, duration: "0:18", format: { tr: "Dikey · Instagram", en: "Vertical · Instagram" }, hue: "300", scene: "city" },
  { id: "v4", listing: "Mas Luberon", style: { tr: "Sakin gezinti", en: "Calm walkthrough" }, duration: "0:38", format: { tr: "Yatay · Portal", en: "Landscape · Portal" }, hue: "110", scene: "vineyard" },
];

export interface Staging {
  id: string;
  room: L;
  listing: string;
  style: L;
  beforeHue: string;
  afterHue: string;
}

export const staging: Staging[] = [
  { id: "s1", room: { tr: "Oturma odası", en: "Living room" }, listing: "Loft Marais", style: { tr: "İskandinav", en: "Scandinavian" }, beforeHue: "60", afterHue: "255" },
  { id: "s2", room: { tr: "Yatak odası", en: "Bedroom" }, listing: "Maison Lyon", style: { tr: "Modern minimal", en: "Modern minimal" }, beforeHue: "60", afterHue: "150" },
  { id: "s3", room: { tr: "Mutfak", en: "Kitchen" }, listing: "Studio Nice", style: { tr: "Sıcak ahşap", en: "Warm wood" }, beforeHue: "60", afterHue: "75" },
  { id: "s4", room: { tr: "Çalışma odası", en: "Home office" }, listing: "Appartement Foch", style: { tr: "Endüstriyel", en: "Industrial" }, beforeHue: "60", afterHue: "210" },
];

/* ── Render queue (with live progress) ───────────────────────────────────── */
export interface RenderJob {
  id: string;
  listing: string;
  stage: L;
  kind: "enhance" | "stage" | "video" | "tour";
  progress: number; // 0-100
  eta: string;
}
export const renderQueue: RenderJob[] = [
  { id: "r1", listing: "Loft Marais", stage: { tr: "Işık & perspektif düzeltme", en: "Light & perspective fix" }, kind: "enhance", progress: 72, eta: "~2 dk" },
  { id: "r2", listing: "Studio Nice", stage: { tr: "Sıraya alındı", en: "Queued" }, kind: "stage", progress: 0, eta: "~6 dk" },
  { id: "r3", listing: "Maison Lyon", stage: { tr: "Drone videosu render", en: "Rendering drone video" }, kind: "video", progress: 38, eta: "~4 dk" },
];

/* ── Portal distribution ─────────────────────────────────────────────────── */
export const portals: { name: string; live: number; tone: "success" | "warning" | "neutral" }[] = [
  { name: "SeLoger", live: 14, tone: "success" },
  { name: "Leboncoin", live: 12, tone: "success" },
  { name: "PAP", live: 9, tone: "warning" },
  { name: "Instagram", live: 18, tone: "success" },
];

/* ── Performance (views per day, last 14d) ───────────────────────────────── */
export const views14d = [120, 180, 150, 240, 320, 280, 410, 380, 520, 600, 540, 720, 880, 940];

/* ── Inquiries (incoming leads on visualized listings) ───────────────────── */
export interface Inquiry { id: string; name: string; listing: string; via: "WhatsApp" | "Telefon" | "Portal"; at: string; hot: boolean; }
export const inquiries: Inquiry[] = [
  { id: "q1", name: "Sophie M.", listing: "Villa Biarritz", via: "WhatsApp", at: "12 dk", hot: true },
  { id: "q2", name: "Marc D.", listing: "Appartement Foch", via: "Portal", at: "40 dk", hot: true },
  { id: "q3", name: "Diane R.", listing: "Mas Luberon", via: "Telefon", at: "1 sa", hot: false },
  { id: "q4", name: "Amélie T.", listing: "Appartement Foch", via: "WhatsApp", at: "2 sa", hot: false },
];

export interface DActivity { id: string; who: string; action: L; target: string; at: string; tone: "neutral" | "success" | "warning" | "info"; }
export const activity: DActivity[] = [
  { id: "a1", who: "Vista", action: { tr: "tanıtım videosunu render etti:", en: "rendered the tour video for" }, target: "Villa Biarritz", at: "2026-06-13T09:05:00Z", tone: "success" },
  { id: "a2", who: "Sen", action: { tr: "12 fotoğraf yükledi:", en: "uploaded 12 photos to" }, target: "Studio Nice", at: "2026-06-13T08:30:00Z", tone: "info" },
  { id: "a3", who: "Vista", action: { tr: "oturma odasını sanal döşedi:", en: "virtually staged the living room of" }, target: "Loft Marais", at: "2026-06-12T18:40:00Z", tone: "neutral" },
  { id: "a4", who: "Sistem", action: { tr: "3 fotoğrafta düşük ışık uyardı:", en: "flagged low light on 3 photos of" }, target: "Maison Lyon", at: "2026-06-12T16:10:00Z", tone: "warning" },
  { id: "a5", who: "Vista", action: { tr: "sanal turu yayınladı:", en: "published the virtual tour for" }, target: "Appartement Foch", at: "2026-06-12T11:25:00Z", tone: "success" },
];

/** Studio month-to-date numbers for the hero. */
export const studio = {
  visualized: "31",
  videos: "18",
  inquiriesDelta: "+214%",
  queue: renderQueue.length,
  staged: "94",
  avgTime: "4dk",
};

/* ── Drone-video render jobs (separate panel) ────────────────────────────── */
export interface DroneJob {
  id: string;
  listing: string;
  style: L;
  format: L;
  progress: number; // 0-100, 100 = done
  duration: string;
  hue: string;
  scene: Scene;
}
export const droneJobs: DroneJob[] = [
  { id: "d1", listing: "Villa Biarritz", style: { tr: "Gün batımı turu", en: "Sunset tour" }, format: { tr: "Yatay · 4K", en: "Landscape · 4K" }, progress: 100, duration: "0:55", hue: "210", scene: "coast" },
  { id: "d2", listing: "Appartement Foch", style: { tr: "Sinematik drone", en: "Cinematic drone" }, format: { tr: "Dikey · Reels", en: "Vertical · Reels" }, progress: 64, duration: "0:18", hue: "255", scene: "city" },
  { id: "d3", listing: "Maison Lyon", style: { tr: "Sakin gezinti", en: "Calm walkthrough" }, format: { tr: "Yatay · Portal", en: "Landscape · Portal" }, progress: 28, duration: "0:38", hue: "150", scene: "house" },
];

/* ── Before/after staging gallery (paired PropertyImage scenes) ──────────── */
export interface BeforeAfter {
  id: string;
  listing: string;
  style: L;
  before: { hue: string; scene: Scene };
  after: { hue: string; scene: Scene };
}
export const beforeAfter: BeforeAfter[] = [
  { id: "b1", listing: "Loft Marais", style: { tr: "İskandinav", en: "Scandinavian" }, before: { hue: "60", scene: "loft" }, after: { hue: "210", scene: "house" } },
  { id: "b2", listing: "Villa Biarritz", style: { tr: "Gün batımı", en: "Twilight" }, before: { hue: "210", scene: "coast" }, after: { hue: "40", scene: "coast" } },
  { id: "b3", listing: "Mas Luberon", style: { tr: "Sıcak ahşap", en: "Warm wood" }, before: { hue: "60", scene: "vineyard" }, after: { hue: "110", scene: "vineyard" } },
];

/* ── Inquiries over time, last 14d (pairs with views14d) ─────────────────── */
export const inquiries14d = [3, 5, 4, 7, 9, 8, 12, 11, 15, 18, 16, 22, 27, 31];

/* ── Per-listing performance table ───────────────────────────────────────── */
export interface ListingPerf {
  id: string;
  address: string;
  district: string;
  views: number;
  inquiries: number;
  ctr: number; // %
  trend: number; // % change
  hue: string;
  scene: Scene;
}
export const listingPerf: ListingPerf[] = [
  { id: "p1", address: "Appartement Foch", district: "Paris 16e", views: 2840, inquiries: 38, ctr: 6.2, trend: 41, hue: "255", scene: "city" },
  { id: "p2", address: "Villa Vue Mer", district: "Biarritz", views: 2210, inquiries: 29, ctr: 5.4, trend: 33, hue: "210", scene: "coast" },
  { id: "p3", address: "Maison avec Jardin", district: "Lyon 6e", views: 1480, inquiries: 19, ctr: 4.8, trend: 18, hue: "150", scene: "house" },
  { id: "p4", address: "Mas & Terrain", district: "Luberon", views: 1120, inquiries: 14, ctr: 4.1, trend: 12, hue: "110", scene: "vineyard" },
  { id: "p5", address: "Loft Haussmannien", district: "Le Marais", views: 760, inquiries: 8, ctr: 3.2, trend: -4, hue: "30", scene: "loft" },
];
