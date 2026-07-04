"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight, ArrowRight, Wand2, Armchair, Clapperboard, PanelsTopLeft,
  Images, Stamp, Check, Play, Sparkles, ArrowLeftRight, Plus, Minus, X,
  Building2, Compass, Home, Briefcase, Upload, Cpu, Eye, Download, Menu,
} from "lucide-react";
import NextImage from "next/image";
import { LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

const moduleIcons = [Wand2, Armchair, Clapperboard, PanelsTopLeft, Images, Stamp];
const personaIcons = [Building2, Compass, Home, Briefcase];
const outputIcons = [Wand2, Armchair, Clapperboard, Images, Stamp, PanelsTopLeft];
const flowIcons = [Upload, Cpu, Eye, Download];

const tryScenes: Record<string, { before: string; after: string }> = {
  stage:   { before: "/images/gallery/living-1-enhanced.jpg",  after: "/images/gallery/living-1-staged.jpg" },
  enhance: { before: "/images/gallery/kitchen-1-original.jpg", after: "/images/gallery/kitchen-1-enhanced.jpg" },
};

const content = {
  fr: {
    nav: ["Ce que ça fait", "Tarifs"],
    signin: "Connexion", demo: "Essayer gratuitement",
    badge: "Studio visuel immobilier",
    h1a: "Photographier un bien", h1b: "en cinq minutes.", h1c: "Le vendre, bien plus vite.",
    sub: "Visuimo prend les photos d'annonce prises au téléphone ; corrige la lumière, meuble virtuellement les pièces vides et génère une vidéo de présentation. Pas de studio, pas de drone — juste des visuels qui vendent.",
    cta1: "Ouvrir le studio", cta2: "Voir à quoi ça ressemble", note: "· sans carte · commencez en 60 secondes",
    marqueeTitle: "Visuimo connaît tous les types de biens",
    marquee: ["Résidence", "Villa", "Maison individuelle", "Loft", "Appartement", "Maison de campagne", "Bord de mer", "Duplex", "Studio", "Penthouse", "Bureau", "Terrain"],
    problemKicker: "Le chaos",
    problemH: ["Les photos pro coûtent cher.", "Un logement vide ne se vend pas. Le drone demande une autorisation."],
    problemBody: "Photos de téléphone floues et basse résolution, pièces vides, tarif journalier d'un photographe... l'annonce se perd sur le portail et l'acheteur passe son chemin. Visuimo condense tout ce travail en un seul panneau et quelques minutes.",
    problemStats: [
      { n: "€500", l: "photographe + drone pour une annonce" },
      { n: "3 jours", l: "délai de prise de vue + montage" },
      { n: "60 %", l: "d'acheteurs n'arrivent pas à se projeter dans un logement vide" },
      { n: "11", l: "photos brutes en attente de retouche" },
    ],
    whatKicker: "Ce que ça fait",
    whatH: ["Le travail d'une équipe d'annonce,", "dans un seul panneau, en toute discrétion."],
    modules: [
      { t: "Amélioration photo", b: "Des photos floues et basse résolution deviennent des visuels d'annonce professionnels, nets et haute résolution, en un clic.", soon: false },
      { t: "Home staging virtuel", b: "Meublez un appartement vide en quelques secondes — pour que l'acheteur voie le logement, pas seulement l'imagine. Le mobilier dans le style de votre choix.", soon: false },
      { t: "Vidéo de présentation", b: "Une vidéo de présentation fluide et musicale est générée à partir des photos ; prête pour Reels et le portail.", soon: false },
      { t: "Visite virtuelle", b: "Un lien de visite pièce par pièce. Bientôt disponible.", soon: true },
      { t: "Tableau de bord portefeuille", b: "Toutes vos annonces au même endroit ; quelle annonce en est où, quel visuel est prêt — en un coup d'œil.", soon: false },
      { t: "Filigrane de marque", b: "Le logo et les coordonnées de votre agence sont appliqués automatiquement et élégamment à chaque visuel et vidéo.", soon: false },
    ],
    promiseKicker: "Promesse honnête",
    promiseH: ["Nous embellissons le bien.", "Jamais la vérité."],
    promiseBody: "Visuimo ajoute du mobilier à une pièce vide et équilibre la lumière — mais ne supprime pas un mur, ne cache pas une fissure, n'agrandit pas les m². Les visuels de home staging virtuel peuvent être étiquetés automatiquement. Nous ne trompons jamais un acheteur pour un plus beau visuel.",
    promiseBullets: [
      "Aucun changement structurel : murs, fenêtres et m² restent tels quels.",
      "Mention automatique « meublé virtuellement » sur les visuels de home staging virtuel.",
      "Les photos originales sont toujours conservées et téléchargeables.",
      "Le filigrane et les droits sont à vous ; tout ce qui est généré vous appartient.",
    ],
    pricingKicker: "Tarifs",
    pricingH: ["Un seul studio.", "Un prix honnête."],
    creditNote: "1 amélioration = 1 crédit · 1 home staging = 2 crédits · 1 vidéo = 9 crédits",
    plans: [
      {
        name: "Solo", price: "€0", cad: "pour commencer",
        body: "Pour un agent indépendant qui veut essayer.",
        credits: "20 crédits / mois",
        bullets: ["Amélioration photo", "Home staging virtuel", "Vidéo de présentation", "Tableau de bord portefeuille"],
        cta: "Commencer gratuitement", featured: false,
      },
      {
        name: "Pro", price: "€29", cad: "/mois",
        body: "L'expérience studio complète pour un agent actif.",
        credits: "180 crédits / mois",
        bullets: ["Amélioration photo", "Home staging virtuel", "Vidéo de présentation", "Tableau de bord portefeuille", "Rendu prioritaire"],
        cta: "Passer à Pro", featured: true,
      },
      {
        name: "Agence", price: "€69", cad: "/mois",
        body: "Équipe d'agence : portefeuille et marque partagés.",
        credits: "450 crédits / mois",
        bullets: ["Tout ce qui est dans Pro", "Équipe & rôles (bientôt)", "Bibliothèque de marque (bientôt)", "Accès API (bientôt)"],
        cta: "Passer à Agence", featured: false,
      },
    ],
    faqKicker: "Questions fréquentes",
    faqH: "Des réponses courtes.",
    faq: [
      { q: "Dois-je payer pour essayer ?", a: "Non. Le plan Solo est entièrement gratuit et inclut 20 crédits par mois. Une fois les crédits épuisés, vous pouvez passer au plan Pro ou Agence." },
      { q: "Les images générées sont-elles réalistes ?", a: "Oui. L'amélioration photo travaille sur la photo réelle ; le home staging virtuel ajoute du mobilier à une pièce vide. Il ne modifie pas la structure du bien." },
      { q: "Quels formats sont produits ?", a: "Des JPG améliorés et une vidéo de présentation (MP4). Vous pouvez les télécharger directement et les publier sur le portail de votre choix." },
      { q: "Comment mettre les visuels sur les portails ?", a: "Visuimo produit des fichiers téléchargeables. Vous les publiez ensuite vous-même sur votre portail (SeLoger, Leboncoin, PAP, etc.). L'intégration automatique aux portails n'est pas encore disponible." },
      { q: "Mes photos originales sont-elles conservées ?", a: "Oui. Les photos brutes de chaque annonce sont conservées telles quelles et téléchargeables à tout moment. Visuimo ne supprime jamais un original." },
      { q: "Peut-on l'utiliser en équipe ?", a: "Le plan Agence ajoutera portefeuille partagé, rôles et bibliothèque de marque commune — actuellement en développement." },
      { q: "La vidéo de présentation est-elle un vrai drone ?", a: "Non — un mouvement de caméra fluide et musical est synthétisé à partir de vos photos. Aucune autorisation nécessaire, aucune attente météo." },
      { q: "Puis-je annuler mon abonnement à tout moment ?", a: "Oui. Le plan mensuel s'annule en un clic ; toutes les images et vidéos générées vous appartiennent." },
    ],
    tryKicker: "Essayer en direct",
    tryH: ["Transformez un visuel.", "En un clic."],
    tryBody: "Choisissez un style — voyez comment Visuimo transforme le même espace. C'est un véritable aperçu : cliquez, la scène change instantanément.",
    tryStyles: [
      { id: "stage",   label: "Pièce vide → Home staging virtuel",  caption: "Le salon vide a été meublé en style scandinave en quelques secondes. Une mention « meublé virtuellement » a été ajoutée.", chip: "Home staging virtuel" },
      { id: "enhance", label: "Photo brute → Amélioration",     caption: "Une photo de téléphone floue et basse résolution est devenue un visuel d'annonce net et haute résolution.", chip: "Amélioration" },
    ],
    tryBefore: "Avant", tryAfter: "Après · Visuimo",
    usesKicker: "Qui l'utilise",
    usesH: ["Pour tous ceux qui", "vendent un bien."],
    uses: [
      { t: "Agent immobilier",   b: "Publiez chaque annonce le jour même avec des visuels prêts pour les portails ; prenez plus de mandats sans attendre un photographe.", stat: "" },
      { t: "Architecte & décorateur", b: "Transformez des pièces concept et des projets vides en visuels meublés et présentables en quelques secondes.", stat: "Prêt à présenter en quelques minutes" },
      { t: "Hôte Airbnb", b: "Transformez des photos de téléphone en désordre en visuels d'annonce lumineux et accueillants.", stat: "" },
      { t: "Gestionnaire de portefeuille", b: "Visualisez et suivez des dizaines d'annonces depuis un seul panneau — une marque cohérente, zéro chaos.", stat: "Tout le portefeuille dans un seul panneau" },
    ],
    compKicker: "Comparer",
    compH: ["Même résultat.", "En un dixième du temps."],
    compCols: ["Photographe professionnel", "Équipe Photoshop", "Visuimo"],
    compRows: [
      { f: "Coût par annonce", a: "€500+", b: "€200+", c: "Inclus dans l'abonnement" },
      { f: "Délai de livraison", a: "2–3 jours", b: "1–2 jours", c: "~5 minutes" },
      { f: "Home staging virtuel", a: false, b: true, c: true },
      { f: "Vidéo de présentation", a: "Équipe séparée + autorisation", b: false, c: true },
      { f: "Format prêt à télécharger", a: false, b: true, c: true },
      { f: "Filigrane de marque (auto)", a: false, b: true, c: true },
      { f: "Révisions illimitées", a: false, b: "Facturé à l'heure", c: true },
    ],
    outKicker: "Ce que produit Visuimo",
    outH: ["Tous les livrables", "d'une équipe d'annonce."],
    outputs: [
      { t: "Amélioration photo",  b: "Net et haute résolution",    img: "/images/gallery/bedroom-4-enhanced.jpg", soon: false },
      { t: "Home staging virtuel",     b: "Pièce vide → meublée",           img: "/images/gallery/bedroom-2-staged.jpg",   soon: false },
      { t: "Vidéo de présentation",   b: "Visite fluide et musicale",         img: "/images/gallery/living-2-staged.jpg",    soon: false },
      { t: "Tableau de bord portefeuille",    b: "Toutes les annonces au même endroit",      img: "/images/gallery/bedroom-3-staged.jpg",   soon: false },
      { t: "Filigrane de marque",   b: "Appliqué automatiquement à chaque visuel",       img: "/images/gallery/kitchen-2-staged.jpg",   soon: false },
      { t: "Visite virtuelle",         b: "Bientôt disponible",            img: "/images/gallery/kitchen-1-staged.jpg",   soon: true  },
    ],
    flowKicker: "Le déroulement",
    flowH: ["Téléversez. Patientez.", "Téléchargez."],
    flow: [
      { t: "Téléverser",           b: "Glissez-déposez les photos brutes prises au téléphone. 1 ou 40 — peu importe." },
      { t: "Visuimo travaille", b: "La lumière, la perspective et les couleurs sont corrigées ; les pièces vides sont meublées, la vidéo est générée." },
      { t: "Vérifier",          b: "Validez chaque visuel, changez de style, conservez l'original. Vous gardez le contrôle total." },
      { t: "Télécharger",           b: "Téléchargez les visuels et la vidéo dans le bon format, puis publiez-les sur le portail de votre choix." },
    ],
    finaleKicker: "Essayez · 60 secondes",
    finaleH: ["Visualisez votre prochaine annonce", "en cinq minutes."],
    finaleBody: "Ouvrez le studio, téléversez votre annonce — chaque étape est interactive. Aucune carte requise, l'inscription est gratuite.",
    footTagline: "Le studio visuel immobilier qui rend chaque annonce prête à vendre.",
    footProduct: "Produit", footCompany: "Entreprise", footResources: "Ressources", footLegal: "Mentions légales",
    footMadeIn: "Conçu à Toulouse",
  },
  en: {
    nav: ["What it does", "Pricing"],
    signin: "Sign in", demo: "Try it free",
    badge: "Real-estate visual studio",
    h1a: "Shoot a listing", h1b: "in five minutes.", h1c: "Sell it far faster.",
    sub: "Visuimo takes the photos you shot on your phone — fixes the light, stages empty rooms with virtual furniture, and renders a tour video. No studio, no drone — just visuals that sell.",
    cta1: "Open the studio", cta2: "See what it looks like", note: "· no card · start in 60 seconds",
    marqueeTitle: "Visuimo knows every kind of space",
    marquee: ["Residence", "Villa", "Detached", "Loft", "Flat", "Vineyard", "Waterfront", "Duplex", "Studio", "Penthouse", "Office", "Land"],
    problemKicker: "The chaos",
    problemH: ["Pro photos are expensive.", "Empty flats don't sell. Drones need permits."],
    problemBody: "Blurry, low-res phone shots, empty rooms, a day-rate photographer... the listing gets lost on the portal and buyers scroll past. Visuimo collapses all of it into one panel and a few minutes.",
    problemStats: [
      { n: "€500", l: "photographer + drone, per listing" },
      { n: "3 days", l: "shoot + edit turnaround" },
      { n: "60%", l: "of buyers can't picture an empty flat" },
      { n: "11", l: "raw photos waiting to be edited" },
    ],
    whatKicker: "What it does",
    whatH: ["A whole listing team's work,", "in one panel, quietly."],
    modules: [
      { t: "Photo enhancement", b: "Blurry, low-res, cluttered photos become sharp, professional listing shots — high resolution, clean detail — in one tap.", soon: false },
      { t: "Virtual staging", b: "Furnish an empty flat in seconds — so buyers don't imagine the home, they see it. Any style you like.", soon: false },
      { t: "Tour video", b: "A smooth, scored tour video is rendered from the photos — ready for Reels and the portal.", soon: false },
      { t: "Virtual tour", b: "A room-by-room walkable tour link. Coming soon.", soon: true },
      { t: "Portfolio panel", b: "Every listing in one place — which is at which stage, which visual is ready, at a glance.", soon: false },
      { t: "Branded watermark", b: "Your office logo and contact, applied to every image and video — automatically, elegantly.", soon: false },
    ],
    promiseKicker: "The honest promise",
    promiseH: ["We beautify the space.", "Never the truth."],
    promiseBody: "Visuimo adds furniture to empty rooms and balances light — but it doesn't remove walls, hide cracks, or grow the square meters. Staged images can be auto-labelled. We won't mislead a buyer for a prettier photo.",
    promiseBullets: [
      "No structural changes: walls, windows and area stay as they are.",
      "Auto 'virtually staged' label on staged images.",
      "Original photos always kept and downloadable.",
      "Watermark and rights are yours; everything generated belongs to you.",
    ],
    pricingKicker: "Pricing",
    pricingH: ["One studio.", "Honest pricing."],
    creditNote: "1 enhancement = 1 credit · 1 staging = 2 credits · 1 video = 9 credits",
    plans: [
      {
        name: "Solo", price: "€0", cad: "to start",
        body: "For solo agents who want to try it out.",
        credits: "20 credits / mo",
        bullets: ["Photo enhancement", "Virtual staging", "Tour video", "Portfolio panel"],
        cta: "Start free", featured: false,
      },
      {
        name: "Pro", price: "€29", cad: "/ mo",
        body: "The full studio for an active agent.",
        credits: "180 credits / mo",
        bullets: ["Photo enhancement", "Virtual staging", "Tour video", "Portfolio panel", "Priority render"],
        cta: "Switch to Pro", featured: true,
      },
      {
        name: "Agency", price: "€69", cad: "/ mo",
        body: "A brokerage: shared portfolio, roles, brand.",
        credits: "450 credits / mo",
        bullets: ["Everything in Pro", "Team & roles (soon)", "Brand library (soon)", "API access (soon)"],
        cta: "Switch to Agency", featured: false,
      },
    ],
    faqKicker: "Good to know",
    faqH: "The short answers.",
    faq: [
      { q: "Do I need to pay to try it?", a: "No. The Solo plan is completely free and includes 20 credits a month. When credits run out, you can upgrade to Pro or Agency." },
      { q: "Are the generated images realistic?", a: "Yes. Enhancement works on top of the real photo; virtual staging adds furniture to an empty room. It doesn't alter the structure." },
      { q: "What does it output?", a: "Enhanced JPGs and a tour video (MP4). Download them and upload to whichever portal you prefer." },
      { q: "How do I get images onto portals?", a: "Visuimo produces downloadable files. You then upload them to your portal (SeLoger, Leboncoin, PAP, etc.) yourself. Automatic portal integration is not currently available." },
      { q: "Are my original photos kept?", a: "Yes. Each listing's raw photos are kept as-is and downloadable anytime. Visuimo never deletes an original." },
      { q: "Can a team use it?", a: "The Agency plan adds shared portfolio, roles and a common brand library — in development now." },
      { q: "Is the tour video a real drone?", a: "No — a smooth, scored camera move is synthesized from your photos. No permit, no waiting on the weather." },
      { q: "Can I cancel anytime?", a: "Yes. The monthly plan cancels in one click; every image and video you generated stays yours." },
    ],
    tryKicker: "Try it live",
    tryH: ["Transform a photo.", "In one click."],
    tryBody: "Pick a style — see how Visuimo changes the same space. This is a real preview: tap and the scene swaps instantly.",
    tryStyles: [
      { id: "stage",   label: "Empty room → Virtual staging", caption: "The empty living room was furnished, Scandinavian, in seconds. A 'virtually staged' label was added.", chip: "Virtual staging" },
      { id: "enhance", label: "Raw photo → Enhancement",      caption: "A blurry, low-res phone shot became a sharp, high-resolution listing image.", chip: "Enhanced" },
    ],
    tryBefore: "Before", tryAfter: "After · Visuimo",
    usesKicker: "Who uses it",
    usesH: ["For everyone who", "sells a listing."],
    uses: [
      { t: "Real-estate agent",    b: "Publish every listing the same day with portal-ready visuals; shoot more without waiting on a photographer.", stat: "" },
      { t: "Architect & designer", b: "Turn concept rooms and empty projects into furnished, presentable visuals in seconds.", stat: "Pitch-ready in minutes" },
      { t: "Airbnb host",          b: "Turn cluttered phone photos into bright, inviting listing images.", stat: "" },
      { t: "Portfolio manager",    b: "Visualize and track dozens of listings from one panel — one brand, zero chaos.", stat: "Full portfolio in one panel" },
    ],
    compKicker: "Compare",
    compH: ["Same result.", "A tenth of the time."],
    compCols: ["Pro photographer", "Photoshop team", "Visuimo"],
    compRows: [
      { f: "Cost per listing", a: "€500+", b: "€200+", c: "Included in plan" },
      { f: "Turnaround", a: "2–3 days", b: "1–2 days", c: "~5 minutes" },
      { f: "Virtual staging", a: false, b: true, c: true },
      { f: "Tour video", a: "Separate crew + permit", b: false, c: true },
      { f: "Downloadable ready format", a: false, b: true, c: true },
      { f: "Brand watermark (auto)", a: false, b: true, c: true },
      { f: "Unlimited revisions", a: false, b: "Billed hourly", c: true },
    ],
    outKicker: "What Visuimo produces",
    outH: ["A whole listing team's", "output."],
    outputs: [
      { t: "Photo enhancement",  b: "Sharp, high resolution",  img: "/images/gallery/bedroom-4-enhanced.jpg", soon: false },
      { t: "Virtual staging",    b: "Empty room → furnished",          img: "/images/gallery/bedroom-2-staged.jpg",   soon: false },
      { t: "Tour video",         b: "Smooth, scored tour",             img: "/images/gallery/living-2-staged.jpg",    soon: false },
      { t: "Portfolio panel",    b: "All listings in one place",       img: "/images/gallery/bedroom-3-staged.jpg",   soon: false },
      { t: "Branded watermark",  b: "Applied to every image",          img: "/images/gallery/kitchen-2-staged.jpg",   soon: false },
      { t: "Virtual tour",       b: "Coming soon",                     img: "/images/gallery/kitchen-1-staged.jpg",   soon: true  },
    ],
    flowKicker: "The flow",
    flowH: ["Upload. Wait.", "Download."],
    flow: [
      { t: "Upload",        b: "Drag and drop the raw photos you shot on your phone. 1 or 40 — it doesn't matter." },
      { t: "Visuimo works", b: "Light, perspective and color are fixed; empty rooms get staged, the video renders." },
      { t: "Review",        b: "Approve each image, change the style, keep the original. You're fully in control." },
      { t: "Download",      b: "Download images and video in the right format, then upload to whichever portal you prefer." },
    ],
    finaleKicker: "Try it · 60 seconds",
    finaleH: ["Visualize your next listing", "in five minutes."],
    finaleBody: "Open the studio, upload a listing — every step is interactive. No card required, signup is free.",
    footTagline: "The real-estate visual studio that makes every listing ready to sell.",
    footProduct: "Product", footCompany: "Company", footResources: "Resources", footLegal: "Legal",
    footMadeIn: "Designed in Toulouse",
  },
};

/* ── Hero illustration ───────────────────────────────────────────────────── */
function ListingStack({ lang }: { lang: "fr" | "en" }) {
  const [after, setAfter] = useState(true);
  const t = {
    fr: { staging: "Home staging virtuel", before: "Avant", after: "Après", tour: "Visite prête", rendering: "Rendu vidéo", enhanced: "Amélioré" },
    en: { staging: "Virtual staging", before: "Before", after: "After", tour: "Tour ready", rendering: "Rendering video", enhanced: "Enhanced" },
  }[lang];
  return (
    <div className="relative h-[460px] sm:h-[520px]">
      {/* back card */}
      <div className="absolute right-0 top-6 w-[260px] rotate-6 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty" style={{ animationDelay: "1.2s" }}>
        <NextImage src="/images/gallery/bedroom-3-staged.jpg" alt="Staged bedroom" width={520} height={293} className="aspect-video w-full object-cover" priority />
        <div className="flex items-center justify-between p-3">
          <p className="text-xs font-medium">Villa Biarritz</p>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">{t.tour}</span>
        </div>
      </div>
      {/* mid card */}
      <div className="absolute left-0 top-28 w-[250px] -rotate-3 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty">
        <div className="relative">
          <NextImage src={after ? "/images/gallery/bedroom-1-staged.jpg" : "/images/gallery/bedroom-1-enhanced.jpg"} alt={after ? t.after : t.before} width={500} height={281} className="aspect-video w-full object-cover" priority />
          <button onClick={() => setAfter((v) => !v)} className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-foreground shadow transition hover:scale-105">
            <ArrowLeftRight className="h-2.5 w-2.5" /> {after ? t.after : t.before}
          </button>
        </div>
        <div className="p-3">
          <p className="text-xs font-medium">{t.staging}</p>
          <p className="text-[10px] text-muted-foreground">Lyon 6e · Scandinave</p>
        </div>
      </div>
      {/* front card */}
      <div className="absolute bottom-0 right-4 w-[280px] rotate-2 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty" style={{ animationDelay: "0.6s" }}>
        <div className="relative">
          <NextImage src="/images/gallery/living-2-staged.jpg" alt="Tour preview" width={560} height={315} className="aspect-video w-full object-cover" priority />
          <button className="absolute inset-0 grid place-items-center" aria-label="play">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-foreground shadow-pop"><Play className="h-5 w-5 translate-x-0.5 fill-current" /></span>
          </button>
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">0:42</span>
        </div>
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Appartement Foch</p>
            <p className="font-display text-sm font-semibold tabular-nums text-primary">€450k</p>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clapperboard className="h-2.5 w-2.5" /> {t.rendering}</span><span className="tabular-nums">72%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: "72%", backgroundImage: "linear-gradient(90deg, var(--color-primary), var(--color-serif))" }} /></div>
          </div>
        </div>
      </div>
      {/* float chip */}
      <div className="absolute -left-2 top-2 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-pop sm:block floaty" style={{ animationDelay: "0.3s" }}>
        <p className="flex items-center gap-1.5 text-xs font-medium"><span className="grid h-4 w-4 place-items-center rounded-full bg-success text-success-foreground"><Check className="h-3 w-3" /></span> {t.enhanced}</p>
      </div>
    </div>
  );
}

/* ── Interactive demo ────────────────────────────────────────────────────── */
function TransformDemo({ c }: { c: (typeof content)["fr"] }) {
  const [styleIdx, setStyleIdx] = useState(0);
  const [after, setAfter] = useState(true);
  const active = c.tryStyles[styleIdx];
  const sc = tryScenes[active.id] ?? tryScenes.stage;
  const shown: string = after ? sc.after : sc.before;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.tryKicker}</p>
        <h2 className="mt-4 font-display text-[clamp(28px,4.2vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.tryH[0]} <span className="display-accent font-normal">{c.tryH[1]}</span></h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">{c.tryBody}</p>
        <div className="mt-7 space-y-2.5">
          {c.tryStyles.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setStyleIdx(i); setAfter(true); }}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-medium ring-1 transition",
                i === styleIdx ? "bg-primary/10 text-foreground ring-primary/40" : "bg-card text-muted-foreground ring-border hover:bg-muted",
              )}
            >
              <span className="inline-flex items-center gap-2.5">
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold", i === styleIdx ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>{i + 1}</span>
                {s.label}
              </span>
              {i === styleIdx && <Sparkles className="h-4 w-4 shrink-0 text-primary" />}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] bg-card p-3 shadow-pop ring-1 ring-border">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] ring-1 ring-border">
          <NextImage src={shown} alt={after ? c.tryAfter : c.tryBefore} fill className="object-cover transition-all duration-500" sizes="(max-width: 768px) 90vw, 750px" />
          <button
            onClick={() => setAfter((v) => !v)}
            className="absolute left-3 top-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2.5 text-[12px] font-medium text-foreground shadow-pop backdrop-blur transition hover:scale-105"
          >
            <ArrowLeftRight className="h-3 w-3" /> {after ? c.tryAfter : c.tryBefore}
          </button>
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-medium text-primary-foreground backdrop-blur">{active.chip}</span>
          {after && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-success text-success-foreground"><Check className="h-2.5 w-2.5" /></span>
              Visuimo
            </span>
          )}
        </div>
        <div className="flex items-start gap-3 px-4 py-4">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Wand2 className="h-4 w-4" /></span>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">{active.caption}</p>
        </div>
      </div>
    </div>
  );
}

export default function VisuimoLanding() {
  const { lang } = useLang();
  const c = content[lang];
  const [open, setOpen] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showcase = [
    "/images/gallery/living-1-staged.jpg",
    "/images/gallery/bedroom-1-staged.jpg",
    "/images/gallery/kitchen-1-staged.jpg",
    "/images/gallery/bedroom-3-staged.jpg",
    "/images/gallery/living-2-staged.jpg",
    "/images/gallery/kitchen-2-staged.jpg",
  ];

  return (
    <div className="min-h-dvh">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-8 w-8" /><span className="font-display text-lg font-semibold tracking-tight">Visuimo</span></Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#what" className="hover:text-foreground transition-colors">{c.nav[0]}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{c.nav[1]}</a>
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:ml-7">
            <LanguageToggle className="mr-1 hidden sm:inline-flex" />
            <Link href="/login" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{c.signin}</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-[13px] font-medium text-background transition hover:opacity-90 sm:px-4">{c.demo} <ArrowUpRight className="hidden h-3.5 w-3.5 sm:inline" /></Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-foreground sm:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-border bg-background px-5 py-3 sm:hidden">
            <a href="#what" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-2 py-3 text-sm font-medium text-foreground hover:bg-muted">{c.nav[0]}</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-2 py-3 text-sm font-medium text-foreground hover:bg-muted">{c.nav[1]}</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-2 py-3 text-sm font-medium text-foreground hover:bg-muted">{c.signin}</Link>
            <div className="mt-2 border-t border-border pt-3">
              <LanguageToggle />
            </div>
          </nav>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)", opacity: 0.6 }} />
        <span className="blob -left-24 -top-20 -z-10 h-96 w-96 bg-primary/25 drift" aria-hidden />
        <span className="blob right-1/4 top-32 -z-10 h-72 w-72 drift" aria-hidden style={{ background: "color-mix(in oklch, var(--color-serif) 28%, transparent)", animationDelay: "2s" }} />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-24">
          <div>
            <p className="rise label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.badge}</p>
            <h1 className="rise mt-6 font-display text-[clamp(40px,6.5vw,76px)] font-semibold leading-[0.96] tracking-tight" style={{ animationDelay: "0.08s" }}>
              {c.h1a} <span className="hl-primary">{c.h1b}</span><br />
              <span className="display-accent font-normal">{c.h1c}</span>
            </h1>
            <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.18s" }}>{c.sub}</p>
            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.28s" }}>
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground shadow-sm shadow-primary/25 transition hover:opacity-90">{c.cta1} <ArrowRight className="h-4 w-4" /></Link>
              <a href="#what" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium text-foreground ring-1 ring-border transition hover:bg-muted">{c.cta2}</a>
              <span className="hidden self-center label-mono text-muted-foreground sm:inline">{c.note}</span>
            </div>
          </div>
          <div className="rise" style={{ animationDelay: "0.3s" }}><ListingStack lang={lang} /></div>
        </div>
      </section>

      {/* ── Marquee ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden border-y border-border py-7">
        <p className="label-mono mb-4 text-center text-muted-foreground">{c.marqueeTitle}</p>
        <div className="marquee gap-10">
          {[...c.marquee, ...c.marquee].map((it, i) => (
            <span key={i} className="display-accent whitespace-nowrap px-2 text-2xl text-muted-foreground/70">{it}<span className="ml-10 text-primary">·</span></span>
          ))}
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.05fr] lg:px-8">
          <div>
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.problemKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.problemH[0]} <span className="display-accent font-normal">{c.problemH[1]}</span></h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{c.problemBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {c.problemStats.map((s, i) => (
              <div key={s.l} className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border" style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}>
                <p className="font-display text-[40px] font-semibold leading-none tabular-nums text-primary">{s.n}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ─────────────────────────────────────────────────── */}
      <section id="what" className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.whatKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(30px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.whatH[0]} <span className="display-accent font-normal">{c.whatH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {c.modules.map((mod, i) => {
              const Icon = moduleIcons[i];
              return (
                <article key={mod.t} className="group rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:scale-110"><Icon className="h-5 w-5" /></span>
                    {mod.soon && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground ring-1 ring-border">
                        {lang === "fr" ? "Bientôt" : "Soon"}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{mod.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mod.b}</p>
                </article>
              );
            })}
          </div>
          {/* showcase strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {showcase.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-soft ring-1 ring-border transition hover:-translate-y-1">
                <NextImage src={src} alt="Staged property" fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive demo ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <TransformDemo c={c} />
        </div>
      </section>

      {/* ── Use-cases / personas ────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.usesKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.usesH[0]} <span className="display-accent font-normal">{c.usesH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.uses.map((u, i) => {
              const Icon = personaIcons[i];
              return (
                <article key={u.t} className="flex flex-col rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{u.t}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{u.b}</p>
                  {u.stat && (
                    <p className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-[13px] font-semibold text-primary">
                      <Check className="h-3.5 w-3.5" /> {u.stat}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Output showcase ─────────────────────────────────────────── */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.outKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,52px)] font-semibold leading-[1.02] tracking-tight">{c.outH[0]} <span className="display-accent font-normal">{c.outH[1]}</span></h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.outputs.map((o, i) => {
              const Icon = outputIcons[i];
              return (
                <article key={o.t} className="group overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop">
                  <div className={cn("relative aspect-[16/10]", o.soon && "opacity-50")}>
                    <NextImage src={o.img} alt={o.t} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px" />
                    {i === 2 && !o.soon && (
                      <button className="absolute inset-0 grid place-items-center" aria-label="play">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-foreground shadow-pop"><Play className="h-5 w-5 translate-x-0.5 fill-current" /></span>
                      </button>
                    )}
                    {o.soon && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-foreground/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-background backdrop-blur">
                          {lang === "fr" ? "Bientôt" : "Soon"}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-primary shadow backdrop-blur"><Icon className="h-4 w-4" /></span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold tracking-tight">{o.t}</p>
                      <p className="text-xs text-muted-foreground">{o.b}</p>
                    </div>
                    {!o.soon && <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison table ────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.compKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.compH[0]} <span className="display-accent font-normal">{c.compH[1]}</span></h2>
          </div>
          <div className="overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-4 font-medium text-muted-foreground sm:px-6" />
                  <th className="px-3 py-4 text-center text-[12px] font-medium text-muted-foreground sm:px-5">{c.compCols[0]}</th>
                  <th className="px-3 py-4 text-center text-[12px] font-medium text-muted-foreground sm:px-5">{c.compCols[1]}</th>
                  <th className="bg-primary/5 px-3 py-4 text-center sm:px-5">
                    <span className="inline-flex items-center gap-1.5 font-display text-base font-semibold tracking-tight text-primary"><LogoMark className="h-5 w-5" /> {c.compCols[2]}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.compRows.map((r, ri) => (
                  <tr key={r.f} className={ri % 2 ? "bg-muted/30" : ""}>
                    <td className="px-4 py-3.5 font-medium sm:px-6">{r.f}</td>
                    {([r.a, r.b, r.c] as (string | boolean)[]).map((cell, ci) => (
                      <td key={ci} className={cn("px-3 py-3.5 text-center sm:px-5", ci === 2 && "bg-primary/5")}>
                        {typeof cell === "boolean" ? (
                          cell
                            ? <Check className={cn("mx-auto h-4 w-4", ci === 2 ? "text-primary" : "text-success")} />
                            : <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                        ) : (
                          <span className={cn("text-[12.5px]", ci === 2 ? "font-medium text-primary" : "text-muted-foreground")}>{cell}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Workflow ─────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.flowKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.flowH[0]} <span className="display-accent font-normal">{c.flowH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.flow.map((f, i) => {
              const Icon = flowIcons[i];
              return (
                <div key={f.t} className="relative rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border">
                  <span className="absolute right-5 top-5 font-display text-3xl font-semibold tabular-nums text-primary/15">0{i + 1}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight">{f.t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{f.b}</p>
                  {i < c.flow.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border lg:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Promise ─────────────────────────────────────────────────── */}
      <section className="px-5 pb-8 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-sidebar p-10 text-sidebar-foreground lg:p-16">
          <span className="blob -right-20 -top-20 h-72 w-72 bg-primary/40 drift" aria-hidden />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="label-mono inline-flex items-center gap-2 text-sidebar-muted"><span className="h-px w-7 bg-primary" /> {c.promiseKicker}</p>
              <h2 className="mt-4 font-display text-[clamp(28px,4vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.promiseH[0]} <span className="display-accent font-normal" style={{ color: "var(--color-serif)" }}>{c.promiseH[1]}</span></h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-sidebar-muted">{c.promiseBody}</p>
            </div>
            <ul className="space-y-3">
              {c.promiseBullets.map((b) => (
                <li key={b} className="flex gap-3 rounded-2xl bg-white/[0.05] px-4 py-3.5 ring-1 ring-white/10"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><p className="text-[13.5px] leading-relaxed text-sidebar-foreground/85">{b}</p></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto mb-4 max-w-xl text-center">
            <p className="label-mono text-primary">{c.pricingKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.pricingH[0]} <span className="display-accent font-normal">{c.pricingH[1]}</span></h2>
          </div>
          <p className="mb-10 text-center label-mono text-muted-foreground">{c.creditNote}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {c.plans.map((p) => (
              <article key={p.name} className={cn("relative rounded-3xl p-7 lg:p-8", p.featured ? "bg-sidebar text-sidebar-foreground shadow-pop" : "bg-card ring-1 ring-border shadow-soft")}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">{lang === "fr" ? "Recommandé" : "Recommended"}</span>}
                <p className={cn("label-mono", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.name}</p>
                <p className="mt-3 flex items-end gap-1"><span className="font-display text-5xl font-semibold leading-none tracking-tight">{p.price}</span><span className={cn("pb-1.5 text-[13px]", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.cad}</span></p>
                <p className="mt-2 text-[12px] font-semibold text-primary">{p.credits}</p>
                <p className={cn("mt-2 text-[13px] leading-relaxed", p.featured ? "text-sidebar-foreground/75" : "text-muted-foreground")}>{p.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.bullets.map((b) => <li key={b} className="flex items-start gap-2 text-[13px]"><Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.featured ? "text-primary" : "text-success")} />{b}</li>)}
                </ul>
                <Link href="/signup" className={cn("mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-medium transition", p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "ring-1 ring-border hover:bg-muted")}>{p.cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mb-10 text-center">
            <p className="label-mono text-primary">{c.faqKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(26px,4vw,42px)] font-semibold tracking-tight">{c.faqH}</h2>
          </div>
          <ul className="space-y-2.5">
            {c.faq.map((item, i) => (
              <li key={item.q} className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[15px] font-semibold tracking-tight">{item.q}</span>
                  {open === i ? <Minus className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />}
                </button>
                {open === i && <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-muted-foreground">{item.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Finale ──────────────────────────────────────────────────── */}
      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] p-10 text-center text-white lg:p-16" style={{ background: "var(--grad-brand)" }}>
          <span className="blob left-1/4 -top-12 h-64 w-64 bg-white/20 drift" aria-hidden />
          <div className="relative">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-white/70"><Sparkles className="h-3 w-3" /> {c.finaleKicker}</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(32px,5.5vw,68px)] font-semibold leading-[1] tracking-tight">{c.finaleH[0]} <span className="italic" style={{ fontFamily: "var(--font-display)" }}>{c.finaleH[1]}</span></h2>
            <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/85">{c.finaleBody}</p>
            <div className="mt-9"><Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-foreground transition hover:bg-white/90">{c.cta1} <ArrowRight className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 text-sm text-muted-foreground md:grid-cols-6 lg:px-8">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-7 w-7" /><span className="font-display text-base font-semibold tracking-tight text-foreground">Visuimo</span></Link>
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">{c.footTagline}</p>
            <p className="mt-4 text-[12px] text-muted-foreground">Visuimo · © 2026 · {c.footMadeIn}</p>
            <LanguageToggle className="mt-4" />
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footProduct}</p>
            <ul className="space-y-1.5">
              <li><a href="#what" className="hover:text-foreground">{c.nav[0]}</a></li>
              <li><a href="#pricing" className="hover:text-foreground">{c.nav[1]}</a></li>
              <li><Link href="/signup" className="hover:text-foreground">{c.demo}</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footLegal}</p>
            <ul className="space-y-1.5">
              <li><Link href="/gizlilik" className="hover:text-foreground">{lang === "fr" ? "Confidentialité" : "Privacy"}</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-foreground">{lang === "fr" ? "Conditions d'utilisation" : "Terms"}</Link></li>
              <li><Link href="/sanal-staging-etigi" className="hover:text-foreground">{lang === "fr" ? "Éthique du home staging virtuel" : "Virtual-staging ethics"}</Link></li>
              <li><Link href="/rgpd" className="hover:text-foreground">RGPD</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footCompany}</p>
            <ul className="space-y-1.5">
              <li><a href="mailto:davutsenol.fr@gmail.com" className="hover:text-foreground">davutsenol.fr@gmail.com</a></li>
              <li>{lang === "fr" ? "Toulouse, France" : "Toulouse, France"}</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
