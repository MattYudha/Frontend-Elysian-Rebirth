export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Elysian ';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? 'AI-Powered Business Automation Platform';

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const config = {
    api: {
        baseURL: API_BASE_URL,
        timeout: 30000,
    },
    app: {
        name: APP_NAME,
        version: APP_VERSION,
    },
    features: {
        enableTelemetry: IS_PRODUCTION,
        enableAnalytics: IS_PRODUCTION,
    },
} as const;
