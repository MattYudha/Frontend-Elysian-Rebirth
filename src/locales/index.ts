import { translationsEN } from './en';
import { translationsID } from './id';
import { translationsZH } from './zh';

export const translations = {
    en: translationsEN,
    id: translationsID,
    zh: translationsZH,
};

export type SupportedLocale = keyof typeof translations;

export function getTranslations(locale: SupportedLocale) {
    return translations[locale] || translations.en;
}
