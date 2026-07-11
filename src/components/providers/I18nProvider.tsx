'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export type Locale = 'en' | 'id' | 'zh' | 'ja' | 'ar' | 'he' | string;

export type Direction = 'ltr' | 'rtl';

export interface I18nContextValue {
    /**
     * Current locale
     */
    locale: Locale;

    /**
     * Text direction (for RTL support)
     */
    direction: Direction;

    /**
     * Translation function
     */
    t: (key: string, defaults?: string) => string;

    /**
     * Format date according to locale
     */
    formatDate: (date: Date, format?: string) => string;

    /**
     * Format number according to locale
     */
    formatNumber: (num: number) => string;

    /**
     * Change locale
     */
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export interface I18nProviderProps {
    /**
     * Current locale
     */
    locale: Locale;

    /**
     * Translation messages
     */
    messages?: Record<string, string>;

    /**
     * Callback when locale changes
     */
    onLocaleChange?: (locale: Locale) => void;

    /**
     * Children components
     */
    children: ReactNode;
}

/**
 * I18nProvider - Internationalization provider
 * 
 * Provides locale, translations, and RTL support.
 * 
 * @example
 * ```tsx
 * <I18nProvider
 *   locale="en"
 *   messages={{
 *     'chat.send': 'Send',
 *     'chat.placeholder': 'Type a message...'
 *   }}
 * >
 *   <App />
 * </I18nProvider>
 * ```
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({
    locale,
    messages = {},
    onLocaleChange,
    children,
}) => {
    const direction: Direction = ['ar', 'he'].includes(locale) ? 'rtl' : 'ltr';

    const t = (key: string, defaultValue?: string): string => {
        return messages[key] || defaultValue || key;
    };

    const formatDate = (date: Date, format?: string): string => {
        try {
            return new Intl.DateTimeFormat(locale, {
                dateStyle: format === 'long' ? 'long' : 'medium',
            }).format(date);
        } catch {
            return date.toLocaleDateString();
        }
    };

    const formatNumber = (num: number): string => {
        try {
            return new Intl.NumberFormat(locale).format(num);
        } catch {
            return num.toString();
        }
    };

    const setLocale = (newLocale: Locale) => {
        onLocaleChange?.(newLocale);
    };

    const value: I18nContextValue = {
        locale,
        direction,
        t,
        formatDate,
        formatNumber,
        setLocale,
    };

    return (
        <I18nContext.Provider value={value}>
            <div dir={direction}>{children}</div>
        </I18nContext.Provider>
    );
};

/**
 * useI18n - Hook to access i18n context
 * 
 * @example
 * ```tsx
 * const { t, locale, formatDate } = useI18n();
 * 
 * <Button>{t('chat.send', 'Send')}</Button>
 * ```
 */
export const useI18n = (): I18nContextValue => {
    const context = useContext(I18nContext);

    if (!context) {
        // Fallback to Indonesian defaults
        return {
            locale: 'id',
            direction: 'ltr',
            t: (key, defaultValue) => defaultValue || key,
            formatDate: (date) => date.toLocaleDateString(),
            formatNumber: (num) => num.toString(),
            setLocale: () => { },
        };
    }

    return context;
};

I18nProvider.displayName = 'I18nProvider';
