/**
 * app.config.ts — single source of truth (bilingual { fr, en }).
 * Run `/setup` to rebrand + wire your keys.
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
  tagline: { fr: "Chaque bien mérite d'être vu.", en: "Every property deserves to be seen." },
  description: {
    fr: "Visuimo transforme les photos d'annonces immobilières en visuels impeccables, pièces meublées virtuellement et vidéos de présentation — dans un seul studio.",
    en: "Visuimo turns listing photos into polished images, virtually staged rooms and tour videos — in one studio.",
  },
  domain: "visuimo.fr",
  logoText: "Vi",
  accentName: "blue",

  marketing: {
    badge: { fr: "Studio visuel immobilier", en: "Real-estate visual studio" },
    heroTitle: { fr: "Photographier un bien : 5 minutes.", en: "Shoot a listing in 5 minutes." },
    heroAccent: { fr: "Le vendre : bien plus vite.", en: "Sell it far faster." },
    heroSubtitle: {
      fr: "Téléchargez des photos prises au téléphone ; Visuimo corrige la lumière, meuble virtuellement les pièces vides et génère une vidéo de présentation pour l'annonce. Ni studio, ni drone nécessaire.",
      en: "Upload phone photos; Visuimo fixes the light, stages empty rooms with virtual furniture, and produces a listing tour video. No studio, no drone required.",
    },
    heroCtaPrimary: { fr: "Visualiser un bien", en: "Visualize a listing" },
    heroCtaSecondary: { fr: "Voir des exemples", en: "See examples" },
    features: [
      { icon: "wand-sparkles", title: { fr: "Amélioration photo", en: "Photo enhancement" }, body: { fr: "Des photos sombres, de travers ou en désordre deviennent des visuels d'annonce professionnels en un clic.", en: "Dim, crooked, cluttered photos become professional listing shots in one tap." } },
      { icon: "armchair", title: { fr: "Home staging virtuel", en: "Virtual staging" }, body: { fr: "Meublez un appartement vide en quelques secondes — pour que l'acheteur voie le logement, pas seulement l'imagine.", en: "Furnish an empty flat in seconds — so buyers don't imagine the home, they see it." } },
      { icon: "clapperboard", title: { fr: "Vidéo de présentation", en: "Tour video" }, body: { fr: "Une vidéo d'annonce fluide et musicale est générée à partir des photos ; prête pour Reels et votre portefeuille.", en: "A smooth, scored listing video is generated from the photos — ready for Reels and your listings." } },
      { icon: "panels-top-left", title: { fr: "Visite virtuelle", en: "Virtual tour" }, body: { fr: "Un lien de visite pièce par pièce — partagez-le, l'acheteur visite sans quitter son canapé.", en: "A room-by-room tour link — share it, buyers walk through without leaving home." } },
      { icon: "images", title: { fr: "Gestion multi-annonces", en: "Multi-listing manager" }, body: { fr: "Tout votre portefeuille dans un seul tableau de bord ; voyez en un coup d'œil où en est chaque annonce.", en: "Your whole portfolio in one panel — see which listing is at which stage at a glance." } },
      { icon: "stamp", title: { fr: "Filigrane de marque", en: "Branded watermark" }, body: { fr: "Le logo et les coordonnées de votre agence sont appliqués automatiquement à chaque visuel et vidéo.", en: "Your office logo and contact are auto-applied to every image and video." } },
    ],
    stats: [
      { value: "5 min", label: { fr: "pour visualiser une annonce", en: "to visualize a listing" } },
      { value: "0", label: { fr: "studio / drone nécessaire", en: "studio / drone needed" } },
      { value: "€0", label: { fr: "pour commencer", en: "to get started" } },
    ],
    pricing: [
      { name: "Solo", price: "€0", period: "/mois", tagline: { fr: "Pour un agent indépendant.", en: "For a solo agent." }, features: [{ fr: "20 crédits / mois", en: "20 credits / mo" }, { fr: "Amélioration photo", en: "Photo enhancement" }, { fr: "Home staging virtuel", en: "Virtual staging" }, { fr: "Tableau de bord portefeuille", en: "Portfolio panel" }], cta: { fr: "Commencer gratuitement", en: "Get started free" } },
      { name: "Pro", price: "€29", period: "/mois", tagline: { fr: "Pour un agent actif.", en: "For an active agent." }, features: [{ fr: "180 crédits / mois", en: "180 credits / mo" }, { fr: "Amélioration photo", en: "Photo enhancement" }, { fr: "Home staging virtuel + vidéo", en: "Virtual staging + video" }, { fr: "Rendu prioritaire", en: "Priority render" }], cta: { fr: "Passer à Pro", en: "Switch to Pro" }, featured: true },
      { name: "Agence", price: "€69", period: "/mois", tagline: { fr: "Pour une équipe d'agence.", en: "For the brokerage." }, features: [{ fr: "450 crédits / mois", en: "450 credits / mo" }, { fr: "Tout ce qui est dans Pro", en: "Everything in Pro" }, { fr: "Équipe & rôles (bientôt)", en: "Team & roles (soon)" }, { fr: "Accès API (bientôt)", en: "API access (soon)" }], cta: { fr: "Passer à Agence", en: "Switch to Agency" } },
    ],
    faq: [
      { q: { fr: "Y a-t-il un essai gratuit ?", en: "Is there a free trial?" }, a: { fr: "Oui. Le plan Solo est entièrement gratuit, avec 20 crédits par mois — sans carte bancaire.", en: "Yes. The Solo plan is completely free with 20 credits a month — no credit card required." } },
      { q: { fr: "Le home staging virtuel est-il honnête ?", en: "Is virtual staging honest?" }, a: { fr: "Oui — il ajoute du mobilier à une pièce vide sans modifier la structure du lieu. Une mention « meublé virtuellement » peut être ajoutée automatiquement aux visuels.", en: "Yes — it adds furniture to an empty room without altering the structure. Images can be auto-labelled 'virtually staged'." } },
      { q: { fr: "Quels formats sont produits ?", en: "What does it output?" }, a: { fr: "Des JPG améliorés et une vidéo de présentation (MP4) — téléchargez-les directement et publiez-les sur le portail de votre choix.", en: "Enhanced JPGs and a tour video (MP4) — download directly and upload to whichever portal you prefer." } },
      { q: { fr: "Puis-je annuler à tout moment ?", en: "Can I cancel anytime?" }, a: { fr: "Oui. L'abonnement mensuel s'annule en un clic ; toutes les images et vidéos générées vous appartiennent.", en: "Yes. Monthly plans cancel in one click; every image and video you generated stays yours." } },
    ],
  },

  nav: [
    { label: { fr: "Studio", en: "Studio" }, href: "/dashboard", icon: "layout-dashboard" },
    { label: { fr: "Annonces", en: "Listings" }, href: "/listings", icon: "building-2" },
    { label: { fr: "Vidéos", en: "Videos" }, href: "/videos", icon: "clapperboard" },
    { label: { fr: "Home Staging", en: "Staging" }, href: "/staging", icon: "armchair" },
    { label: { fr: "Paramètres", en: "Settings" }, href: "/settings", icon: "settings" },
  ],

  integrations: [
    { key: "fal", name: "Traitement d'image", envVars: ["FAL_KEY"], required: false, docsUrl: "https://fal.ai/dashboard/keys", purpose: "Amélioration photo et home staging virtuel (génération d'images)." },
    { key: "kie", name: "Génération vidéo", envVars: ["KIE_API_KEY"], required: false, docsUrl: "https://kie.ai/api-key", purpose: "Création de vidéo de présentation (image → vidéo)." },
    { key: "supabase", name: "Supabase", envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"], required: false, docsUrl: "https://supabase.com/dashboard/project/_/settings/api", purpose: "Stocke les données des annonces, images et vidéos." },
  ],
};

export default appConfig;
