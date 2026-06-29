"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight, ArrowRight, Wand2, Armchair, Clapperboard, PanelsTopLeft,
  Images, Stamp, Check, Play, Sparkles, ArrowLeftRight, Plus, Minus, X,
  Building2, Compass, Home, Briefcase, Quote, Star, Sun, Map, Upload,
  Cpu, Eye, Send, TrendingUp,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { PropertyImage, type Scene } from "@/components/property-image";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

const moduleIcons = [Wand2, Armchair, Clapperboard, PanelsTopLeft, Images, Stamp];
const personaIcons = [Building2, Compass, Home, Briefcase];
const outputIcons = [Wand2, Armchair, Sun, Map, Clapperboard, PanelsTopLeft];
const flowIcons = [Upload, Cpu, Eye, Send];
/** Each interactive-demo style maps to a before/after PropertyImage scene+hue. */
const tryScenes: Record<string, { before: { s: Scene; h: string }; after: { s: Scene; h: string } }> = {
  stage: { before: { s: "loft", h: "60" }, after: { s: "house", h: "150" } },
  twilight: { before: { s: "coast", h: "210" }, after: { s: "coast", h: "40" } },
  enhance: { before: { s: "city", h: "240" }, after: { s: "city", h: "255" } },
};

const content = {
  tr: {
    nav: ["Ne yapar", "Bir ilanın günü", "Fiyatlar"], signin: "Giriş yap", demo: "Demoyu dene",
    badge: "Emlak görsel stüdyosu",
    h1a: "İlanı çekmek", h1b: "beş dakika.", h1c: "Satması artık daha hızlı.",
    sub: "Vista, telefonla çekilmiş ilan fotoğraflarını sessizce alır; ışığı düzeltir, boş odaları sanal mobilyayla döşer, drone-tarzı bir tanıtım videosu ve gezilebilir bir sanal tur üretir. Stüdyo yok, drone yok — sadece satan görseller.",
    cta1: "Stüdyoyu aç", cta2: "Nasıl göründüğüne bak", note: "· kart yok · 60 saniyelik demo",
    proofAvatars: "200+ emlak danışmanı ilanlarını Vista'ya çektiriyor.",
    marqueeTitle: "Vista her mekânı tanır",
    marquee: ["Rezidans", "Villa", "Müstakil", "Loft", "Daire", "Bağ Evi", "Yalı", "Dubleks", "Stüdyo", "Penthouse", "Ofis", "Arsa"],
    problemKicker: "Kaos",
    problemH: ["Profesyonel foto pahalı.", "Boş daire satmıyor. Drone izin istiyor."],
    problemBody: "Loş telefon fotoğrafları, eğri açılar, boş odalar, bir günlük fotoğrafçı ücreti, video için ayrı ekip... İlan portalda kaybolur, alıcı kaydırıp geçer. Vista bütün bu işi tek panele ve birkaç dakikaya indirir.",
    problemStats: [
      { n: "€500", l: "tek ilan için fotoğrafçı + drone" },
      { n: "3 gün", l: "çekim + kurgu bekleme süresi" },
      { n: "%60", l: "boş daireyi hayal edemeyen alıcı" },
      { n: "11", l: "düzenlenmeyi bekleyen ham fotoğraf" },
    ],
    whatKicker: "Ne yapar",
    whatH: ["Bir ilan ekibi kadar iş,", "tek panelde, sessizce."],
    modules: [
      { t: "Foto iyileştirme", b: "Loş, eğri, dağınık fotoğraflar tek tıkta dengeli ışık ve düz çizgilerle profesyonel ilan görseline döner." },
      { t: "Sanal staging", b: "Boş daireyi saniyeler içinde döşe — alıcı evi hayal etmesin, görsün. İstediğin stilde mobilya." },
      { t: "Drone-tarzı video", b: "Fotoğraflardan akıcı, müzikli bir tanıtım videosu render edilir; Reels ve portala hazır iner." },
      { t: "Sanal tur", b: "Oda oda gezilebilen bir tur linki. Paylaş, alıcı evden çıkmadan dolaşsın." },
      { t: "Portföy paneli", b: "Tüm ilanların tek yerde; hangisi hangi aşamada, hangi portalda yayında — bir bakışta." },
      { t: "Marka filigranı", b: "Her görsele ve videoya ofis logon ve iletişimin otomatik, zarif şekilde işlenir." },
    ],
    proof: [
      { big: "3×", l: "daha fazla ilan tıklaması", c: "Görselleştirilen ilanlarda portal etkileşimi" },
      { big: "5 dk", l: "ham fotoğraftan yayına", c: "Yükle, iyileştir, döşe, render et" },
      { big: "%62", l: "daha hızlı satış/kiralama", c: "Görselleştirilmiş ilanlarda ortalama" },
    ],
    journeyKicker: "Salı, 13 Haziran",
    journeyH: ["Bir ilanın bir günü,", "dakika dakika."],
    ticks: [
      { time: "08:10", who: "Sen", b: "Foch dairesinin 24 ham fotoğrafını yükledin — telefonla, loş ışıkta." },
      { time: "08:11", who: "Vista", b: "Işık, perspektif ve renk düzeltildi. 24 görsel ilan kalitesinde." },
      { time: "08:14", who: "Vista", b: "Boş oturma odası İskandinav stilde sanal döşendi. 'Sanal olarak döşenmiştir' etiketi eklendi." },
      { time: "08:19", who: "Vista", b: "Drone-tarzı tanıtım videosu render edildi — 42 sn, dikey + yatay." },
      { time: "08:21", who: "Vista", b: "İlan SeLoger, Leboncoin ve Instagram'a tek tıkla gönderildi." },
      { time: "10:46", who: "Sophie M.", b: "İlk talep WhatsApp'tan geldi: 'Tur linkini gönderebilir misiniz?'" },
    ],
    promiseKicker: "Dürüst söz",
    promiseH: ["Mekânı güzelleştiririz.", "Gerçeği değil."],
    promiseBody: "Vista boş odaya mobilya ekler, ışığı dengeler — ama duvarı kaldırmaz, çatlağı kapatmaz, m²'yi büyütmez. Sanal staging görselleri otomatik etiketlenebilir. Görsel güzel olsun diye alıcıyı yanıltmıyoruz.",
    promiseBullets: [
      "Yapısal değişiklik yok: duvar, pencere, m² olduğu gibi kalır.",
      "Sanal staging görsellerine otomatik 'sanal olarak döşenmiştir' etiketi.",
      "Orijinal fotoğraflar her zaman saklanır, indirilebilir.",
      "Filigran ve telif senin; üretilen her şey sana ait.",
    ],
    pricingKicker: "Fiyatlar",
    pricingH: ["Tek stüdyo.", "Dürüst fiyat."],
    plans: [
      { name: "Solo", price: "€0", cad: "başlangıç", body: "Tek danışman, ayda birkaç ilan denemek için.", bullets: ["Ayda 3 ilan", "Foto iyileştirme", "Filigran", "Portföy paneli"], cta: "Ücretsiz başla", featured: false },
      { name: "Ofis", price: "€49", cad: "/ay", body: "Aktif çalışan emlakçı için tam stüdyo deneyimi.", bullets: ["Sınırsız ilan", "Sanal staging + video", "Sanal tur linkleri", "Portal dağıtımı", "Öncelikli render"], cta: "30 gün ücretsiz dene", featured: true },
      { name: "Acente", price: "€129", cad: "/ay", body: "Ofis ekibi: paylaşılan portföy, roller, marka.", bullets: ["Ofis'teki her şey", "Ekip & roller", "Marka kütüphanesi", "API & toplu işlem"], cta: "Ekip kur", featured: false },
    ],
    faqKicker: "Merak edilenler",
    faqH: "Kısa cevaplar.",
    faq: [
      { q: "Denemek için API anahtarı gerekir mi?", a: "Hayır. Vista örnek ilanlar ve üretilmiş görsel/videolarla demo modda açılır — hemen tıklayabilirsin. Canlı üretim için fal.ai / Kie.ai anahtarını /setup ile bağlarsın." },
      { q: "Üretilen görseller gerçekçi mi?", a: "Evet. Foto iyileştirme gerçek fotoğrafın üstünde çalışır; sanal staging boş odaya mobilya ekler. Mekânın yapısını değiştirmez." },
      { q: "Hangi formatlar çıkıyor?", a: "İyileştirilmiş JPG'ler, dikey + yatay tanıtım videosu (MP4) ve paylaşılabilir bir sanal tur linki — hepsi marka filigranlı." },
      { q: "Portallara nasıl gönderiyor?", a: "SeLoger, Leboncoin, PAP ve Instagram için hazır boyut/oran setleri üretir; tek panelden dağıtırsın." },
      { q: "Orijinal fotoğraflarım saklanıyor mu?", a: "Evet. Her ilanın ham fotoğrafları olduğu gibi tutulur ve her an indirilebilir. Vista hiçbir orijinali silmez." },
      { q: "Ekip olarak kullanabilir miyiz?", a: "Acente planında paylaşılan portföy, roller ve ortak marka kütüphanesi gelir; sekiz danışmanlı ofis tek panelden çalışır." },
      { q: "Drone-tarzı video gerçek drone mu?", a: "Hayır — fotoğraflarından akıcı, müzikli bir kamera hareketi sentezlenir. İzin gerekmez, hava şartı beklenmez." },
      { q: "Aboneliği istediğimde iptal edebilir miyim?", a: "Evet. Aylık plan, tek tıkla iptal; üretilmiş tüm görsel ve videolar senin kalır." },
    ],
    // ── Interactive demo ──
    tryKicker: "Canlı dene",
    tryH: ["Görseli dönüştür.", "Tek tıkla."],
    tryBody: "Bir stil seç — Vista'nın aynı mekânı nasıl değiştirdiğini gör. Bu gerçek bir önizleme: tıkla, sahne anında değişsin.",
    tryStyles: [
      { id: "stage", label: "Boş oda → Sanal sahneleme", caption: "Boş oturma odası saniyeler içinde İskandinav mobilyayla döşendi. 'Sanal olarak döşenmiştir' etiketi eklendi.", chip: "Sanal staging" },
      { id: "twilight", label: "Gündüz → Gün batımı", caption: "Düz öğlen ışığı sıcak gün batımına çevrildi; pencereler içeriden ısındı, gökyüzü altın oldu.", chip: "Gün batımı" },
      { id: "enhance", label: "Ham foto → Geliştirme", caption: "Loş, eğri telefon fotoğrafı dengeli ışık ve düz çizgilerle profesyonel ilan görseline döndü.", chip: "İyileştirme" },
    ],
    tryBefore: "Önce", tryAfter: "Sonra · Vista",
    // ── Personas / use-cases ──
    usesKicker: "Kimler kullanıyor",
    usesH: ["Bir ilanı satan", "herkes için."],
    uses: [
      { t: "Emlak danışmanı", b: "Her ilanı aynı gün portala hazır görsellerle yayınla; fotoğrafçı beklemeden daha fazla ilan çek.", stat: "3× daha fazla ilan tıklaması" },
      { t: "Mimar & iç mimar", b: "Konsept odaları ve boş projeleri saniyeler içinde döşenmiş, sunulabilir görsellere çevir.", stat: "Sunuma 5 dk'da hazır" },
      { t: "Airbnb ev sahibi", b: "Dağınık telefon fotoğrafları parlak, davetkar ilan görsellerine dönsün; rezervasyon artsın.", stat: "%40 daha çok görüntülenme" },
      { t: "Portföy yöneticisi", b: "Onlarca ilanı tek panelden görselleştir, dağıt ve takip et — tutarlı marka, sıfır kaos.", stat: "Tek panelde 100+ ilan" },
    ],
    // ── Testimonials ──
    testKicker: "Sahadan sesler",
    testH: ["Satışı hızlandıran", "görseller."],
    testimonials: [
      { q: "Foch'taki daireyi sabah çektim, öğlen tur linkini gönderdim. Üç gün sonra sattı. Eskiden fotoğrafçı sırası bile o kadar sürmüyordu.", name: "Sophie Martin", role: "Emlak Danışmanı · Paris 16e", initials: "SM", metric: "9 günde satış" },
      { q: "Boş daireleri döşemek her şeyi değiştirdi. Alıcı artık 'burayı hayal edemiyorum' demiyor; görüyor.", name: "Marc Dubois", role: "Ofis Sahibi · RE/Lyon", initials: "MD", metric: "%62 daha hızlı kiralama" },
      { q: "Bir proje sunumu için 12 oda render'ını bir öğleden sonra hazırladım. Stüdyo ekibi bir hafta isterdi.", name: "Diane Renard", role: "İç Mimar", initials: "DR", metric: "1 günde 12 oda" },
      { q: "Airbnb ilanımın görüntülenmesi iki katına çıktı. Aynı ev, aynı fiyat — sadece görseller parladı.", name: "Emma Thomas", role: "Airbnb Süper Host · Marseille", initials: "ET", metric: "2× görüntülenme" },
      { q: "Drone-tarzı videoları portala ve Reels'e koyduğumuzdan beri etkileşim uçtu. Gerçek drone için izin bile beklemiyorum.", name: "Antoine Sauvé", role: "Acente Direktörü", initials: "AS", metric: "3× portal etkileşimi" },
      { q: "Sekiz danışmanlık ofiste herkes aynı marka filigranıyla üretiyor. Tutarlılık ilk kez bu kadar kolay.", name: "Léa Durant", role: "Pazarlama Müdürü · Acente", initials: "LD", metric: "8 danışman, tek marka" },
    ],
    // ── Comparison ──
    compKicker: "Karşılaştır",
    compH: ["Aynı sonuç.", "Onda biri zamanda."],
    compCols: ["Profesyonel fotoğrafçı", "Photoshop ekibi", "Vista"],
    compRows: [
      { f: "İlan başına maliyet", a: "€500+", b: "€200+", c: "€0 — abonelikte dahil" },
      { f: "Teslim süresi", a: "2–3 gün", b: "1–2 gün", c: "~5 dakika" },
      { f: "Sanal sahneleme", a: false, b: true, c: true },
      { f: "Drone-tarzı video", a: "Ayrı ekip + izin", b: false, c: true },
      { f: "Sanal tur linki", a: false, b: false, c: true },
      { f: "Portallara tek tık dağıtım", a: false, b: false, c: true },
      { f: "Marka filigranı (otomatik)", a: false, b: true, c: true },
      { f: "Sınırsız revizyon", a: false, b: "Saat ücretli", c: true },
    ],
    // ── Output showcase ──
    outKicker: "Vista ne üretir",
    outH: ["Bir ilan ekibinin", "tüm çıktıları."],
    outputs: [
      { t: "Foto iyileştirme", b: "Dengeli ışık, düz çizgi", s: "loft", hue: "210" },
      { t: "Sanal sahneleme", b: "Boş oda → döşeli", s: "house", hue: "150" },
      { t: "Gün batımı render", b: "Sıcak, davetkar saat", s: "coast", hue: "40" },
      { t: "Kat planı görseli", b: "Net, etiketli plan", s: "loft", hue: "255" },
      { t: "Drone-tarzı video", b: "Akıcı, müzikli tur", s: "city", hue: "270" },
      { t: "Sanal tur", b: "Gezilebilir oda oda", s: "vineyard", hue: "110" },
    ],
    // ── Workflow + portals ──
    flowKicker: "Akış",
    flowH: ["Yükle. Bekle.", "Yayınla."],
    flow: [
      { t: "Yükle", b: "Telefonla çektiğin ham fotoğrafları sürükle bırak. 1 ya da 40 — fark etmez." },
      { t: "Vista çalışır", b: "Işık, perspektif ve renk düzelir; boş odalar döşenir, video render edilir." },
      { t: "İncele", b: "Her görseli onayla, stili değiştir, orijinali sakla. Kontrol tamamen sende." },
      { t: "Portala gönder", b: "Tek tıkla doğru boyut/oranlarda SeLoger, Leboncoin ve Instagram'a dağıt." },
    ],
    portalsStripTitle: "Tek panelden dağıt",
    portalsStrip: ["SeLoger", "Leboncoin", "PAP", "Logic-Immo", "Airbnb", "MLS", "Instagram"],
    finaleKicker: "Dene · 60 saniye",
    finaleH: ["Bir sonraki ilanı", "beş dakikada görselleştir."],
    finaleBody: "Önceden doldurulmuş canlı bir stüdyo demosunu gez — her ekran tıklanabilir. Kart yok, kayıt yok.",
    footTagline: "Her ilanı satışa hazır hale getiren emlak görsel stüdyosu.",
    footProduct: "Ürün", footCompany: "Şirket", footResources: "Kaynaklar", footLegal: "Yasal",
    footResourceLinks: ["Rehber & ipuçları", "Stil galerisi", "Portal kılavuzu", "Yardım merkezi"],
    footLegalLinks: ["Gizlilik", "Kullanım koşulları", "Sanal staging etiği", "KVKK"],
    footMadeIn: "Paris'te tasarlandı",
  },
  en: {
    nav: ["What it does", "A listing's day", "Pricing"], signin: "Sign in", demo: "Try the demo",
    badge: "Real-estate visual studio",
    h1a: "Shoot a listing", h1b: "in five minutes.", h1c: "Sell it far faster.",
    sub: "Vista quietly takes the photos you shot on your phone — fixes the light, stages empty rooms with virtual furniture, renders a drone-style tour video and a walkable virtual tour. No studio, no drone — just visuals that sell.",
    cta1: "Open the studio", cta2: "See what it looks like", note: "· no card · 60-second demo",
    proofAvatars: "200+ agents let Vista visualize their listings.",
    marqueeTitle: "Vista knows every kind of space",
    marquee: ["Residence", "Villa", "Detached", "Loft", "Flat", "Vineyard", "Waterfront", "Duplex", "Studio", "Penthouse", "Office", "Land"],
    problemKicker: "The chaos",
    problemH: ["Pro photos are expensive.", "Empty flats don't sell. Drones need permits."],
    problemBody: "Dim phone shots, crooked angles, empty rooms, a day-rate photographer, a separate crew for video... the listing gets lost on the portal and buyers scroll past. Vista collapses all of it into one panel and a few minutes.",
    problemStats: [
      { n: "€280", l: "photographer + drone, per listing" },
      { n: "3 days", l: "shoot + edit turnaround" },
      { n: "60%", l: "of buyers can't picture an empty flat" },
      { n: "11", l: "raw photos waiting to be edited" },
    ],
    whatKicker: "What it does",
    whatH: ["A whole listing team's work,", "in one panel, quietly."],
    modules: [
      { t: "Photo enhancement", b: "Dim, crooked, cluttered photos become professional listing shots — balanced light, straight lines — in one tap." },
      { t: "Virtual staging", b: "Furnish an empty flat in seconds — so buyers don't imagine the home, they see it. Any style you like." },
      { t: "Drone-style video", b: "A smooth, scored tour video is rendered from the photos — ready for Reels and the portal." },
      { t: "Virtual tour", b: "A room-by-room walkable tour link. Share it; buyers explore without leaving home." },
      { t: "Portfolio panel", b: "Every listing in one place — which is at which stage, live on which portal, at a glance." },
      { t: "Branded watermark", b: "Your office logo and contact, applied to every image and video — automatically, elegantly." },
    ],
    proof: [
      { big: "3×", l: "more listing clicks", c: "Portal engagement on visualized listings" },
      { big: "5 min", l: "from raw photo to live", c: "Upload, enhance, stage, render" },
      { big: "62%", l: "faster sale / let", c: "Average across visualized listings" },
    ],
    journeyKicker: "Tuesday, 13 June",
    journeyH: ["A listing's day,", "minute by minute."],
    ticks: [
      { time: "08:10", who: "You", b: "Uploaded 24 raw photos of the Foch flat — shot on a phone, in dim light." },
      { time: "08:11", who: "Vista", b: "Light, perspective and color corrected. 24 images at listing quality." },
      { time: "08:14", who: "Vista", b: "The empty living room was virtually staged, Scandinavian. Labelled 'virtually staged'." },
      { time: "08:19", who: "Vista", b: "Drone-style tour video rendered — 42s, vertical + landscape." },
      { time: "08:21", who: "Vista", b: "Listing pushed to the portals and Instagram in one click." },
      { time: "10:46", who: "Sophie M.", b: "First inquiry came in on WhatsApp: 'Could you send the tour link?'" },
    ],
    promiseKicker: "The honest promise",
    promiseH: ["We beautify the space.", "Never the truth."],
    promiseBody: "Vista adds furniture to empty rooms and balances light — but it doesn't remove walls, hide cracks, or grow the square meters. Staged images can be auto-labelled. We won't mislead a buyer for a prettier photo.",
    promiseBullets: [
      "No structural changes: walls, windows and area stay as they are.",
      "Auto 'virtually staged' label on staged images.",
      "Original photos always kept and downloadable.",
      "Watermark and rights are yours; everything generated belongs to you.",
    ],
    pricingKicker: "Pricing",
    pricingH: ["One studio.", "Honest pricing."],
    plans: [
      { name: "Solo", price: "€0", cad: "to start", body: "A solo agent, trying a few listings a month.", bullets: ["3 listings / mo", "Photo enhancement", "Watermark", "Portfolio panel"], cta: "Start free", featured: false },
      { name: "Office", price: "€49", cad: "/ mo", body: "The full studio for a working agent.", bullets: ["Unlimited listings", "Virtual staging + video", "Virtual tour links", "Portal distribution", "Priority render"], cta: "Try free for 30 days", featured: true },
      { name: "Agency", price: "€129", cad: "/ mo", body: "A brokerage: shared portfolio, roles, brand.", bullets: ["Everything in Office", "Team & roles", "Brand library", "API & batch"], cta: "Set up a team", featured: false },
    ],
    faqKicker: "Good to know",
    faqH: "The short answers.",
    faq: [
      { q: "Do I need API keys to try it?", a: "No. Vista boots in demo mode with sample listings and generated visuals — click around immediately. Wire your fal.ai / Kie.ai key via /setup for live generation." },
      { q: "Are the generated images realistic?", a: "Yes. Enhancement works on top of the real photo; virtual staging adds furniture to an empty room. It doesn't alter the structure." },
      { q: "What does it output?", a: "Enhanced JPGs, a vertical + landscape tour video (MP4) and a shareable virtual-tour link — all watermarked." },
      { q: "How does it push to portals?", a: "It produces ready size/ratio sets for the major portals and Instagram; you distribute from one panel." },
      { q: "Are my original photos kept?", a: "Yes. Each listing's raw photos are kept as-is and downloadable anytime. Vista never deletes an original." },
      { q: "Can a team use it?", a: "The Agency plan adds shared portfolio, roles and a common brand library; an eight-agent office works from one panel." },
      { q: "Is the drone-style video a real drone?", a: "No — a smooth, scored camera move is synthesized from your photos. No permit, no waiting on the weather." },
      { q: "Can I cancel anytime?", a: "Yes. The monthly plan cancels in one click; every image and video you generated stays yours." },
    ],
    // ── Interactive demo ──
    tryKicker: "Try it live",
    tryH: ["Transform a photo.", "In one click."],
    tryBody: "Pick a style — see how Vista changes the same space. This is a real preview: tap and the scene swaps instantly.",
    tryStyles: [
      { id: "stage", label: "Empty room → Virtual staging", caption: "The empty living room was furnished, Scandinavian, in seconds. A 'virtually staged' label was added.", chip: "Virtual staging" },
      { id: "twilight", label: "Daylight → Twilight", caption: "Flat midday light became a warm twilight; windows glow from inside and the sky turns gold.", chip: "Twilight" },
      { id: "enhance", label: "Raw photo → Enhancement", caption: "A dim, crooked phone shot became a professional listing image — balanced light, straight lines.", chip: "Enhanced" },
    ],
    tryBefore: "Before", tryAfter: "After · Vista",
    // ── Personas / use-cases ──
    usesKicker: "Who uses it",
    usesH: ["For everyone who", "sells a listing."],
    uses: [
      { t: "Real-estate agent", b: "Publish every listing the same day with portal-ready visuals; shoot more without waiting on a photographer.", stat: "3× more listing clicks" },
      { t: "Architect & designer", b: "Turn concept rooms and empty projects into furnished, presentable visuals in seconds.", stat: "Pitch-ready in 5 min" },
      { t: "Airbnb host", b: "Turn cluttered phone photos into bright, inviting listing images and lift your bookings.", stat: "40% more views" },
      { t: "Portfolio manager", b: "Visualize, distribute and track dozens of listings from one panel — one brand, zero chaos.", stat: "100+ listings, one panel" },
    ],
    // ── Testimonials ──
    testKicker: "Voices from the field",
    testH: ["Visuals that", "speed up the sale."],
    testimonials: [
      { q: "I shot the Foch flat in the morning, sent the tour link by noon. It sold three days later. The photographer's queue alone used to take longer.", name: "Sophie Martin", role: "Agent · Paris 16e", initials: "SM", metric: "Sold in 9 days" },
      { q: "Staging empty flats changed everything. Buyers no longer say 'I can't picture this' — they see it.", name: "Marc Dubois", role: "Office Owner · RE/Lyon", initials: "MD", metric: "62% faster let" },
      { q: "I prepared 12 room renders for a project pitch in one afternoon. A studio crew would've wanted a week.", name: "Diane Renard", role: "Interior Architect", initials: "DR", metric: "12 rooms in a day" },
      { q: "My Airbnb listing's views doubled. Same home, same price — only the visuals shone.", name: "Emma Thomas", role: "Airbnb Superhost · Marseille", initials: "ET", metric: "2× views" },
      { q: "Since we put drone-style videos on the portal and Reels, engagement took off. I don't even wait for a drone permit.", name: "Antoine Sauvé", role: "Agency Director", initials: "AS", metric: "3× portal engagement" },
      { q: "Across an eight-agent office everyone produces with the same brand watermark. Consistency has never been this easy.", name: "Léa Durant", role: "Marketing Lead · Agency", initials: "LD", metric: "8 agents, one brand" },
    ],
    // ── Comparison ──
    compKicker: "Compare",
    compH: ["Same result.", "A tenth of the time."],
    compCols: ["Pro photographer", "Photoshop team", "Vista"],
    compRows: [
      { f: "Cost per listing", a: "€280+", b: "€120+", c: "€0 — included in plan" },
      { f: "Turnaround", a: "2–3 days", b: "1–2 days", c: "~5 minutes" },
      { f: "Virtual staging", a: false, b: true, c: true },
      { f: "Drone-style video", a: "Separate crew + permit", b: false, c: true },
      { f: "Virtual tour link", a: false, b: false, c: true },
      { f: "One-click portal distribution", a: false, b: false, c: true },
      { f: "Brand watermark (auto)", a: false, b: true, c: true },
      { f: "Unlimited revisions", a: false, b: "Billed hourly", c: true },
    ],
    // ── Output showcase ──
    outKicker: "What Vista produces",
    outH: ["A whole listing team's", "output."],
    outputs: [
      { t: "Photo enhancement", b: "Balanced light, straight lines", s: "loft", hue: "210" },
      { t: "Virtual staging", b: "Empty room → furnished", s: "house", hue: "150" },
      { t: "Twilight render", b: "Warm, inviting hour", s: "coast", hue: "40" },
      { t: "Floor-plan visual", b: "Clean, labelled plan", s: "loft", hue: "255" },
      { t: "Drone-style video", b: "Smooth, scored tour", s: "city", hue: "270" },
      { t: "Virtual tour", b: "Walkable, room by room", s: "vineyard", hue: "110" },
    ],
    // ── Workflow + portals ──
    flowKicker: "The flow",
    flowH: ["Upload. Wait.", "Publish."],
    flow: [
      { t: "Upload", b: "Drag and drop the raw photos you shot on your phone. 1 or 40 — it doesn't matter." },
      { t: "Vista works", b: "Light, perspective and color are fixed; empty rooms get staged, the video renders." },
      { t: "Review", b: "Approve each image, change the style, keep the original. You're fully in control." },
      { t: "Push to portals", b: "Distribute to SeLoger, Leboncoin and Instagram at the right sizes in one click." },
    ],
    portalsStripTitle: "Distribute from one panel",
    portalsStrip: ["SeLoger", "Leboncoin", "PAP", "Logic-Immo", "Airbnb", "MLS", "Instagram"],
    finaleKicker: "Try it · 60 seconds",
    finaleH: ["Visualize your next listing", "in five minutes."],
    finaleBody: "Take a live studio demo for a spin — pre-loaded, every screen interactive. No card, no signup.",
    footTagline: "The real-estate visual studio that makes every listing ready to sell.",
    footProduct: "Product", footCompany: "Company", footResources: "Resources", footLegal: "Legal",
    footResourceLinks: ["Guides & tips", "Style gallery", "Portal handbook", "Help center"],
    footLegalLinks: ["Privacy", "Terms", "Virtual-staging ethics", "Data (KVKK)"],
    footMadeIn: "Designed in Paris",
  },
};

/* ── Hero illustration: a stack of listing cards mid-render ──────────────── */
function ListingStack({ lang }: { lang: "tr" | "en" }) {
  const [after, setAfter] = useState(true);
  const t = {
    tr: { staging: "Sanal staging", before: "Önce", after: "Sonra", tour: "Tur hazır", rendering: "Drone videosu render", enhanced: "İyileştirildi", staged: "Döşendi" },
    en: { staging: "Virtual staging", before: "Before", after: "After", tour: "Tour ready", rendering: "Rendering drone video", enhanced: "Enhanced", staged: "Staged" },
  }[lang];
  return (
    <div className="relative h-[460px] sm:h-[520px]">
      {/* back card */}
      <div className="absolute right-0 top-6 w-[260px] rotate-6 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty" style={{ animationDelay: "1.2s" }}>
        <PropertyImage scene="coast" hue="210" className="aspect-video w-full" />
        <div className="flex items-center justify-between p-3">
          <p className="text-xs font-medium">Villa Biarritz</p>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">{t.tour}</span>
        </div>
      </div>
      {/* mid card — staging before/after */}
      <div className="absolute left-0 top-28 w-[250px] -rotate-3 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty">
        <div className="relative">
          <PropertyImage scene={after ? "house" : "loft"} hue={after ? "150" : "60"} className="aspect-video w-full" />
          <button onClick={() => setAfter((v) => !v)} className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-foreground shadow transition hover:scale-105">
            <ArrowLeftRight className="h-2.5 w-2.5" /> {after ? t.after : t.before}
          </button>
        </div>
        <div className="p-3">
          <p className="text-xs font-medium">{t.staging}</p>
          <p className="text-[10px] text-muted-foreground">Lyon 6e · Scandinave</p>
        </div>
      </div>
      {/* front card — live render */}
      <div className="absolute bottom-0 right-4 w-[280px] rotate-2 overflow-hidden rounded-2xl bg-card shadow-pop ring-1 ring-border floaty" style={{ animationDelay: "0.6s" }}>
        <div className="relative">
          <PropertyImage scene="city" hue="255" className="aspect-video w-full" />
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
      {/* float chips */}
      <div className="absolute -left-2 top-2 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-pop sm:block floaty" style={{ animationDelay: "0.3s" }}>
        <p className="flex items-center gap-1.5 text-xs font-medium"><span className="grid h-4 w-4 place-items-center rounded-full bg-success text-success-foreground"><Check className="h-3 w-3" /></span> {t.enhanced}</p>
      </div>
    </div>
  );
}

/* ── Interactive inline demo: pick a style → scene swaps before/after ─────── */
function TransformDemo({ c }: { c: (typeof content)["tr"] }) {
  const [styleIdx, setStyleIdx] = useState(0);
  const [after, setAfter] = useState(true);
  const active = c.tryStyles[styleIdx];
  const sc = tryScenes[active.id] ?? tryScenes.stage;
  const shown = after ? sc.after : sc.before;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      {/* controls */}
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
      {/* preview */}
      <div className="rounded-[2rem] bg-card p-3 shadow-pop ring-1 ring-border">
        <div className="relative overflow-hidden rounded-[1.5rem] ring-1 ring-border">
          <PropertyImage scene={shown.s} hue={shown.h} className="aspect-[16/10] w-full transition-all duration-500" />
          {/* before/after pill */}
          <button
            onClick={() => setAfter((v) => !v)}
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-pop backdrop-blur transition hover:scale-105"
          >
            <ArrowLeftRight className="h-3 w-3" /> {after ? c.tryAfter : c.tryBefore}
          </button>
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-medium text-primary-foreground backdrop-blur">{active.chip}</span>
          {after && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-success text-success-foreground"><Check className="h-2.5 w-2.5" /></span>
              Vista
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

export default function VistaLanding() {
  const { lang } = useLang();
  const c = content[lang];
  const [open, setOpen] = useState<number | null>(0);
  const showcase: { s: Scene; h: string }[] = [
    { s: "city", h: "255" }, { s: "coast", h: "210" }, { s: "house", h: "150" },
    { s: "loft", h: "30" }, { s: "vineyard", h: "110" }, { s: "city", h: "270" },
  ];

  return (
    <div className="min-h-dvh">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-8 w-8" /><span className="font-display text-lg font-semibold tracking-tight">Vista</span></Link>
          <nav className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#what" className="hover:text-foreground transition-colors">{c.nav[0]}</a>
            <a href="#journey" className="hover:text-foreground transition-colors">{c.nav[1]}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{c.nav[2]}</a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-7">
            <LanguageToggle className="mr-1" />
            <Link href="/login" className="hidden px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">{c.signin}</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background transition hover:opacity-90">{c.demo} <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
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
            <div className="rise mt-9 flex items-center gap-3 text-sm text-muted-foreground" style={{ animationDelay: "0.38s" }}>
              <div className="flex -space-x-2">
                {["SM", "MD", "DR", "AS", "ET"].map((i, k) => (
                  <span key={i} className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-semibold text-foreground/70 ring-2 ring-background" style={{ background: `oklch(${82 - k * 5}% 0.06 ${255 - k * 30})` }}>{i}</span>
                ))}
              </div>
              <span>{c.proofAvatars}</span>
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
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary transition group-hover:scale-110"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{mod.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mod.b}</p>
                </article>
              );
            })}
          </div>
          {/* showcase strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {showcase.map((x, i) => (
              <div key={i} className="overflow-hidden rounded-xl shadow-soft ring-1 ring-border transition hover:-translate-y-1"><PropertyImage scene={x.s} hue={x.h} className="aspect-[4/3] w-full" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive transform demo ──────────────────────────────── */}
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
                  <p className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-[13px] font-semibold text-primary">
                    <TrendingUp className="h-3.5 w-3.5" /> {u.stat}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Proof ───────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3 lg:px-8">
          {c.proof.map((p) => (
            <div key={p.l}>
              <p className="font-display text-[64px] font-semibold leading-none tracking-tight text-primary">{p.big}</p>
              <p className="mt-2 text-sm font-medium">{p.l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.c}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey timeline ────────────────────────────────────────── */}
      <section id="journey" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.journeyKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.journeyH[0]} <span className="display-accent font-normal">{c.journeyH[1]}</span></h2>
          </div>
          <ol className="relative ml-3 space-y-5 border-l border-border pl-8">
            {c.ticks.map((tk) => (
              <li key={tk.time} className="relative">
                <span className="absolute -left-[42px] grid h-7 w-7 place-items-center rounded-full bg-card text-[10px] font-mono text-primary ring-1 ring-border">●</span>
                <div className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">{tk.time}</span>
                    <span className="text-[11px] text-muted-foreground">{tk.who}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{tk.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Output showcase: what Vista produces ────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
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
                  <div className="relative">
                    <PropertyImage scene={o.s as Scene} hue={o.hue} className="aspect-[16/10] w-full" />
                    {i === 4 && (
                      <button className="absolute inset-0 grid place-items-center" aria-label="play">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-foreground shadow-pop"><Play className="h-5 w-5 translate-x-0.5 fill-current" /></span>
                      </button>
                    )}
                    <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-primary shadow backdrop-blur"><Icon className="h-4 w-4" /></span>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-semibold tracking-tight">{o.t}</p>
                      <p className="text-xs text-muted-foreground">{o.b}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Workflow deep-dive + portals strip ──────────────────────── */}
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
          {/* portals strip */}
          <div className="mt-12 rounded-3xl bg-card p-7 shadow-soft ring-1 ring-border">
            <p className="label-mono text-center text-muted-foreground">{c.portalsStripTitle}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {c.portalsStrip.map((p) => (
                <span key={p} className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground/80 ring-1 ring-border">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.testKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.testH[0]} <span className="display-accent font-normal">{c.testH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {c.testimonials.map((tm, i) => (
              <figure key={tm.name} className="flex flex-col rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border" style={{ transform: `rotate(${i % 2 ? 0.5 : -0.5}deg)` }}>
                <Quote className="h-6 w-6 text-primary/30" />
                <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-foreground/90">{tm.q}</blockquote>
                <div className="mt-5 flex items-center gap-1 text-serif" style={{ color: "var(--color-serif)" }}>
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold text-foreground/70" style={{ background: `oklch(${84 - i * 3}% 0.06 ${255 - i * 26})` }}>{tm.initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{tm.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{tm.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">{tm.metric}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono inline-flex items-center justify-center gap-2 text-primary"><span className="h-px w-7 bg-primary" /> {c.compKicker}</p>
            <h2 className="mt-4 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.compH[0]} <span className="display-accent font-normal">{c.compH[1]}</span></h2>
          </div>
          <div className="overflow-hidden rounded-3xl bg-card shadow-soft ring-1 ring-border">
            <table className="w-full text-left text-sm">
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
      </section>

      {/* ── Promise (inverted) ──────────────────────────────────────── */}
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
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="label-mono text-primary">{c.pricingKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.04] tracking-tight">{c.pricingH[0]} <span className="display-accent font-normal">{c.pricingH[1]}</span></h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {c.plans.map((p) => (
              <article key={p.name} className={cn("relative rounded-3xl p-7 lg:p-8", p.featured ? "bg-sidebar text-sidebar-foreground shadow-pop" : "bg-card ring-1 ring-border shadow-soft")}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">{lang === "tr" ? "Önerilen" : "Recommended"}</span>}
                <p className={cn("label-mono", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.name}</p>
                <p className="mt-3 flex items-end gap-1"><span className="font-display text-5xl font-semibold leading-none tracking-tight">{p.price}</span><span className={cn("pb-1.5 text-[13px]", p.featured ? "text-sidebar-muted" : "text-muted-foreground")}>{p.cad}</span></p>
                <p className={cn("mt-3 text-[13px] leading-relaxed", p.featured ? "text-sidebar-foreground/75" : "text-muted-foreground")}>{p.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.bullets.map((b) => <li key={b} className="flex items-start gap-2 text-[13px]"><Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.featured ? "text-primary" : "text-success")} />{b}</li>)}
                </ul>
                <Link href="/signup" className={cn("mt-7 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-medium transition", p.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "ring-1 ring-border hover:bg-muted")}>{p.cta}</Link>
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
            <Link href="/" className="inline-flex items-center gap-2.5"><LogoMark className="h-7 w-7" /><span className="font-display text-base font-semibold tracking-tight text-foreground">Vista</span></Link>
            <p className="mt-3 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">{c.footTagline}</p>
            <p className="mt-4 text-[12px] text-muted-foreground">vista.studio · © 2026 · {c.footMadeIn}</p>
            <LanguageToggle className="mt-4" />
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footProduct}</p>
            <ul className="space-y-1.5">
              <li><a href="#what" className="hover:text-foreground">{c.nav[0]}</a></li>
              <li><a href="#journey" className="hover:text-foreground">{c.nav[1]}</a></li>
              <li><a href="#pricing" className="hover:text-foreground">{c.nav[2]}</a></li>
              <li><Link href="/login" className="hover:text-foreground">{c.demo}</Link></li>
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footResources}</p>
            <ul className="space-y-1.5">
              {c.footResourceLinks.map((r) => <li key={r}><a href="#" className="hover:text-foreground">{r}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footLegal}</p>
            <ul className="space-y-1.5">
              {c.footLegalLinks.map((r) => <li key={r}><a href="#" className="hover:text-foreground">{r}</a></li>)}
            </ul>
          </div>
          <div>
            <p className="label-mono mb-3 text-muted-foreground">{c.footCompany}</p>
            <ul className="space-y-1.5"><li>hello@vista.studio</li><li>{lang === "tr" ? "Hakkında" : "About"}</li><li>{lang === "tr" ? "Kariyer" : "Careers"}</li></ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
