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
  name: "Visuimo",
  tagline: { tr: "Her mülk görülmeyi hak eder.", en: "Chaque bien mérite d'être vu." },
  description: {
    tr: "Visuimo, emlak ilanı fotoğraflarını pırıl pırıl görsellere, sanal mobilyalı odalara ve tanıtım videolarına dönüştürür — tek stüdyoda.",
    en: "Visuimo turns listing photos into polished images, virtually staged rooms and tour videos — in one studio.",
  },
  domain: "visuimo.fr",
  logoText: "Vi",
  accentName: "blue",

  marketing: {
    badge: { tr: "Emlak görsel stüdyosu", en: "Real-estate visual studio" },
    heroTitle: { tr: "İlanı çekmek 5 dakika.", en: "Shoot a listing in 5 minutes." },
    heroAccent: { tr: "Satması artık daha hızlı.", en: "Sell it far faster." },
    heroSubtitle: {
      tr: "Telefonla çekilmiş fotoğrafları yükle; Visuimo ışığı düzeltir, boş odayı sanal mobilyayla döşer ve ilana özel bir tanıtım videosu üretir. Stüdyo da drone da gerekmez.",
      en: "Upload phone photos; Visuimo fixes the light, stages empty rooms with virtual furniture, and produces a listing tour video. No studio, no drone required.",
    },
    heroCtaPrimary: { tr: "İlanı görselleştir", en: "Visualize a listing" },
    heroCtaSecondary: { tr: "Örnekleri gör", en: "See examples" },
    features: [
      { icon: "wand-sparkles", title: { tr: "Foto iyileştirme", en: "Photo enhancement" }, body: { tr: "Loş, eğri, dağınık fotoğraflar tek tıkla profesyonel ilan görseline dönüşür.", en: "Dim, crooked, cluttered photos become professional listing shots in one tap." } },
      { icon: "armchair", title: { tr: "Sanal staging", en: "Virtual staging" }, body: { tr: "Boş daireyi saniyeler içinde döşe — alıcı evi hayal etsin diye değil, görsün diye.", en: "Furnish an empty flat in seconds — so buyers don't imagine the home, they see it." } },
      { icon: "clapperboard", title: { tr: "Tanıtım videosu", en: "Tour video" }, body: { tr: "Fotoğraflardan akıcı, müzikli bir ilan videosu üretilir; Reels ve portföye hazır.", en: "A smooth, scored listing video is generated from the photos — ready for Reels and your listings." } },
      { icon: "panels-top-left", title: { tr: "Sanal tur", en: "Virtual tour" }, body: { tr: "Oda oda gezilebilen bir tur linki — paylaş, alıcı evden çıkmadan gezsin.", en: "A room-by-room tour link — share it, buyers walk through without leaving home." } },
      { icon: "images", title: { tr: "Çoklu ilan yönetimi", en: "Multi-listing manager" }, body: { tr: "Tüm portföyün tek panelde; hangi ilan hangi aşamada bir bakışta.", en: "Your whole portfolio in one panel — see which listing is at which stage at a glance." } },
      { icon: "stamp", title: { tr: "Marka filigranı", en: "Branded watermark" }, body: { tr: "Her görsel ve videoya ofis logon ve iletişimin otomatik işlenir.", en: "Your office logo and contact are auto-applied to every image and video." } },
    ],
    stats: [
      { value: "5 dk", label: { tr: "ilan başına görsel", en: "to visualize a listing" } },
      { value: "0", label: { tr: "stüdyo / drone", en: "studio / drone needed" } },
      { value: "€0", label: { tr: "ücretsiz başlangıç", en: "to get started" } },
    ],
    pricing: [
      { name: "Solo", price: "€0", period: "/ay", tagline: { tr: "Bireysel danışman için.", en: "For a solo agent." }, features: [{ tr: "20 kredi / ay", en: "20 credits / mo" }, { tr: "Foto iyileştirme", en: "Photo enhancement" }, { tr: "Sanal staging", en: "Virtual staging" }, { tr: "Portföy paneli", en: "Portfolio panel" }], cta: { tr: "Ücretsiz başla", en: "Get started free" } },
      { name: "Pro", price: "€29", period: "/ay", tagline: { tr: "Aktif emlakçı için.", en: "For an active agent." }, features: [{ tr: "180 kredi / ay", en: "180 credits / mo" }, { tr: "Foto iyileştirme", en: "Photo enhancement" }, { tr: "Sanal staging + video", en: "Virtual staging + video" }, { tr: "Öncelikli render", en: "Priority render" }], cta: { tr: "Pro'ya geç", en: "Switch to Pro" }, featured: true },
      { name: "Acente", price: "€69", period: "/ay", tagline: { tr: "Ofis ekibi için.", en: "For the brokerage." }, features: [{ tr: "450 kredi / ay", en: "450 credits / mo" }, { tr: "Pro'daki her şey", en: "Everything in Pro" }, { tr: "Ekip & roller (yakında)", en: "Team & roles (soon)" }, { tr: "API erişimi (yakında)", en: "API access (soon)" }], cta: { tr: "Acente'ye geç", en: "Switch to Agency" } },
    ],
    faq: [
      { q: { tr: "Ücretsiz deneme var mı?", en: "Is there a free trial?" }, a: { tr: "Evet. Solo plan tamamen ücretsiz, ayda 20 kredi içerir — kredi kartı gerekmez.", en: "Yes. The Solo plan is completely free with 20 credits a month — no credit card required." } },
      { q: { tr: "Sanal staging dürüst mü?", en: "Is virtual staging honest?" }, a: { tr: "Evet — boş odaya mobilya ekler, mekânın yapısını değiştirmez. Görsellere otomatik 'sanal olarak döşenmiştir' etiketi eklenebilir.", en: "Yes — it adds furniture to an empty room without altering the structure. Images can be auto-labelled 'virtually staged'." } },
      { q: { tr: "Hangi formatlar çıkıyor?", en: "What does it output?" }, a: { tr: "İyileştirilmiş JPG'ler ve tanıtım videosu (MP4) — doğrudan indir, istediğin portala kendin yükle.", en: "Enhanced JPGs and a tour video (MP4) — download directly and upload to whichever portal you prefer." } },
      { q: { tr: "Aboneliği iptal edebilir miyim?", en: "Can I cancel anytime?" }, a: { tr: "Evet. Aylık plan tek tıkla iptal edilir; üretilmiş tüm görsel ve videolar senin kalır.", en: "Yes. Monthly plans cancel in one click; every image and video you generated stays yours." } },
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
    { key: "fal", name: "Görsel İşleme", envVars: ["FAL_KEY"], required: false, docsUrl: "https://fal.ai/dashboard/keys", purpose: "Fotoğraf iyileştirme ve sanal staging (görsel üretim)." },
    { key: "kie", name: "Video Üretimi", envVars: ["KIE_API_KEY"], required: false, docsUrl: "https://kie.ai/api-key", purpose: "Tanıtım videosu oluşturma (görsel → video)." },
    { key: "supabase", name: "Supabase", envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"], required: false, docsUrl: "https://supabase.com/dashboard/project/_/settings/api", purpose: "İlan, görsel ve video verilerini depolar." },
  ],
};

export default appConfig;
