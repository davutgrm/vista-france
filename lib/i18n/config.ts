/**
 * Bilingual support. Every user-facing string in this kit is available in
 * French and English. The language toggle (top-right) switches live and the
 * choice is remembered in localStorage.
 *
 * `L` is the shape of a translatable string: { fr, en }. The guided setup keeps
 * both languages in app.config.ts; pick() reads the active one.
 */
export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** Default language shown on first load. Change to "en" to default to English. */
export const DEFAULT_LANG: Lang = "fr";

export const LANG_LABEL: Record<Lang, string> = { fr: "FR", en: "EN" };

/** A translatable string. */
export type L = { fr: string; en: string };

/** Pick the active language out of an L (falls back to the other if missing). */
export function pick(value: L, lang: Lang): string {
  return value[lang] ?? value[lang === "fr" ? "en" : "fr"];
}
