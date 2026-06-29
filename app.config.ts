/**
 * app.config.ts — single source of truth (bilingual { tr, en }).
 * Run `/setup` (or "bu projeyi kur") to rebrand + wire your keys.
 */
import type { L } from "@/lib/i18n/config";

export type IconName = string;
export interface NavItem { label: L; href: string; icon: IconName; }
export interface Feature { icon: IconName; title: L; body: L; }
export interface Stat { value: string; label: L; }
export interface PricingTier { name: string; price: string; period?: string; tagline: L; features: L[]; cta: L; featured?: boolean; }
export interface FaqItem { q: L; a: L; }
export interface Integration { key: string; name: string; envVars: string[]; required: boolean; docsUrl: string; purpose: string; }
export interface AppConfig {
  name: string; tagline: L; description: L; domain: string; logoText: string; accentName: string;
  marketing: { badge: L; heroTitle: L; heroAccent: L; heroSubtitle: L; heroCtaPrimary: L; heroCtaSecondary: L; features: Feature[]; stats: Stat[]; pricing: PricingTier[]; faq: FaqItem[]; };
  nav: NavItem[]; integrations: Integration[];
}

export const appConfig: AppConfig = {
  name: "Vista",
  tagline: { tr: "Her ilanı satışa hazır hale getir.", en: "Make every listing ready to sell." },
  description: {
    tr: "Vista, emlak ilanı fotoğraflarını pırıl pırıl görsellere, sanal mobilyalı odalara ve otomatik drone-tarzı tanıtım videolarına dönüştürür — tek stüdyoda.",
    en: "Vista turns listing photos into polished images, virtually staged rooms and automatic drone-style tour videos — in one studio.",
  },
  domain: "vista.studio",
  logoText: "Vi",
  accentName: "blue",

  marketing: {
    badge: { tr: "Emlak görsel stüdyosu", en: "Real-estate visual studio" },
    heroTitle: { tr: "İlanı çekmek 5 dakika.", en: "Shoot a listing in 5 minutes." },
    heroAccent: { tr: "Satması artık daha hızlı.", en: "Sell it far faster." },
    heroSubtitle: {
      tr: "Telefonla çekilmiş fotoğrafları yükle; Vista ışığı düzeltir, boş odayı sanal mobilyayla döşer ve ilana özel bir tanıtım videosu üretir. Stüdyo da drone da gerekmez.",
      en: "Upload phone photos; Vista fixes the light, stages empty rooms with virtual furniture, and produces a listing tour video. No studio, no drone required.",
    },
    heroCtaPrimary: { tr: "İlanı görselleştir", en: "Visualize a listing" },
    heroCtaSecondary: { tr: "Örnekleri gör", en: "See examples" },
    features: [
      { icon: "wand-sparkles", title: { tr: "Foto iyileştirme", en: "Photo enhancement" }, body: { tr: "Loş, eğri, dağınık fotoğraflar tek tıkla profesyonel ilan görseline dönüşür.", en: "Dim, crooked, cluttered photos become professional listing shots in one tap." } },
      { icon: "armchair", title: { tr: "Sanal staging", en: "Virtual staging" }, body: { tr: "Boş daireyi saniyeler içinde döşe — alıcı evi hayal etsin diye değil, görsün diye.", en: "Furnish an empty flat in seconds — so buyers don't imagine the home, they see it." } },
      { icon: "clapperboard", title: { tr: "Drone-tarzı tanıtım videosu", en: "Drone-style tour video" }, body: { tr: "Fotoğraflardan akıcı, müzikli bir ilan videosu üretilir; Reels ve portföye hazır.", en: "A smooth, scored listing video is generated from the photos — ready for Reels and portals." } },
      { icon: "panels-top-left", title: { tr: "Sanal tur", en: "Virtual tour" }, body: { tr: "Oda oda gezilebilen bir tur linki — paylaş, alıcı evden çıkmadan gezsin.", en: "A room-by-room tour link — share it, buyers walk through without leaving home." } },
      { icon: "images", title: { tr: "Çoklu ilan yönetimi", en: "Multi-listing manager" }, body: { tr: "Tüm portföyün tek panelde; hangi ilan hangi aşamada bir bakışta.", en: "Your whole portfolio in one panel — see which listing is at which stage at a glance." } },
      { icon: "stamp", title: { tr: "Marka filigranı", en: "Branded watermark" }, body: { tr: "Her görsel ve videoya ofis logon ve iletişimin otomatik işlenir.", en: "Your office logo and contact are auto-applied to every image and video." } },
    ],
    stats: [
      { value: "5 dk", label: { tr: "ilan başına görsel", en: "to visualize a listing" } },
      { value: "3×", label: { tr: "daha hızlı ilgi", en: "more inquiries" } },
      { value: "0", label: { tr: "stüdyo / drone", en: "studio / drone needed" } },
      { value: "0", label: { tr: "anahtarla dene", en: "keys to try it" } },
    ],
    pricing: [
      { name: "Solo", price: "€0", period: "/ay", tagline: { tr: "Tek danışman için.", en: "For a solo agent." }, features: [{ tr: "Ayda 3 ilan", en: "3 listings / mo" }, { tr: "Foto iyileştirme", en: "Photo enhancement" }, { tr: "Filigran", en: "Watermark" }], cta: { tr: "Başla", en: "Get started" } },
      { name: "Ofis", price: "€49", period: "/ay", tagline: { tr: "Çalışan emlakçı için.", en: "For a working agent." }, features: [{ tr: "Sınırsız ilan", en: "Unlimited listings" }, { tr: "Sanal staging + video", en: "Virtual staging + video" }, { tr: "Sanal tur", en: "Virtual tours" }, { tr: "Portföy paneli", en: "Portfolio panel" }], cta: { tr: "Ücretsiz dene", en: "Start free trial" }, featured: true },
      { name: "Acente", price: "€129", period: "/ay", tagline: { tr: "Ofis ekibi için.", en: "For the brokerage." }, features: [{ tr: "Ofis'teki her şey", en: "Everything in Ofis" }, { tr: "Ekip & roller", en: "Team & roles" }, { tr: "Portal dağıtımı", en: "Portal distribution" }, { tr: "Öncelikli render", en: "Priority render" }], cta: { tr: "Bize ulaş", en: "Contact sales" } },
    ],
    faq: [
      { q: { tr: "Denemek için anahtar gerekli mi?", en: "Do I need API keys to try it?" }, a: { tr: "Hayır. Vista örnek ilanlar ve üretilmiş görsel/videolarla demo modda açılır. Canlı üretim için fal.ai / Kie.ai anahtarını /setup ile bağla.", en: "No. Vista boots in demo mode with sample listings and generated visuals. Wire your fal.ai / Kie.ai key via /setup for live generation." } },
      { q: { tr: "Sanal staging dürüst mü?", en: "Is virtual staging honest?" }, a: { tr: "Evet — boş odaya mobilya ekler, mekânın yapısını değiştirmez. Görsellere otomatik 'sanal olarak döşenmiştir' etiketi eklenebilir.", en: "Yes — it adds furniture to an empty room without altering the structure. Images can be auto-labelled 'virtually staged'." } },
      { q: { tr: "Hangi formatlar çıkıyor?", en: "What does it output?" }, a: { tr: "İyileştirilmiş JPG'ler, dikey + yatay ilan videosu (MP4) ve paylaşılabilir bir sanal tur linki.", en: "Enhanced JPGs, a vertical + landscape listing video (MP4), and a shareable virtual-tour link." } },
      { q: { tr: "Teknoloji nedir?", en: "What's the stack?" }, a: { tr: "Next.js 16, React 19, Tailwind v4. Her yere dağıtılabilir standart bir uygulama.", en: "Next.js 16, React 19, Tailwind v4 — a standard app you can deploy anywhere." } },
    ],
  },

  nav: [
    { label: { tr: "Stüdyo", en: "Studio" }, href: "/dashboard", icon: "layout-dashboard" },
    { label: { tr: "İlanlar", en: "Listings" }, href: "/listings", icon: "building-2" },
    { label: { tr: "Videolar", en: "Videos" }, href: "/videos", icon: "clapperboard" },
    { label: { tr: "Sanal Staging", en: "Staging" }, href: "/staging", icon: "armchair" },
    { label: { tr: "Ayarlar", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  integrations: [
    { key: "fal", name: "fal.ai", envVars: ["FAL_KEY"], required: false, docsUrl: "https://fal.ai/dashboard/keys", purpose: "Photo enhancement & virtual staging (image generation)." },
    { key: "kie", name: "Kie.ai", envVars: ["KIE_API_KEY"], required: false, docsUrl: "https://kie.ai/api-key", purpose: "Image-to-video for the drone-style listing tour." },
    { key: "supabase", name: "Supabase", envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"], required: false, docsUrl: "https://supabase.com/dashboard/project/_/settings/api", purpose: "Stores listings, assets and renders. Without it, runs in demo mode." },
  ],
};

export default appConfig;
