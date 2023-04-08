import { Translation } from "./types";
import { createContext, useContext } from "react";

export const locales = ["en", "ru"] as const;
export const defaultLocale = locales[0];
export type Locales = (typeof locales)[number];

const cache: Partial<Record<Locales, Translation>> = {};

export async function loadTranslation(locale: Locales): Promise<Translation> {
  if (cache[locale]) {
    return cache[locale];
  }

  const file = await import(`./locales/${locale}`);
  const translation = file[locale] as Translation;

  return (cache[locale] = translation);
}

export const TranslationContext = createContext<Translation | undefined>(
  undefined
);

export function useTranslation() {
  return useContext(TranslationContext);
}

export { type Translation };
