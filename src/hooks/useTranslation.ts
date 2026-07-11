'use client';

import { useI18n } from '@/components/providers/I18nProvider';
import { getTranslations, type SupportedLocale } from '@/locales';
import { useMemo } from 'react';

export function useTranslation() {
    const { locale, setLocale } = useI18n();

    const t = useMemo(() => {
        return getTranslations(locale as SupportedLocale);
    }, [locale]);

    return { t, locale, setLocale };
}
