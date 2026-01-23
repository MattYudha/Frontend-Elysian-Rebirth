import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        runtimeCaching: [
            // API Routes & Auth Pages -> NetworkFirst (Critical Data)
            {
                urlPattern: /^https?.+?(\/api\/|\/dashboard|\/workflow|\/chat).*/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "api-auth-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 24 * 60 * 60, // 24 hours
                    },
                    networkTimeoutSeconds: 10,
                },
            },
            // Static Assets (Images, Fonts, JS) -> CacheFirst
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|woff2|woff|ttf|eot)$/i,
                handler: "CacheFirst",
                options: {
                    cacheName: "static-assets-cache",
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                    },
                },
            },
            // Public/Marketing Pages -> StaleWhileRevalidate
            {
                urlPattern: /^https?.+?(\/|\/about|\/pricing|\/docs)$/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "public-pages-cache",
                    expiration: {
                        maxEntries: 20,
                        maxAgeSeconds: 24 * 60 * 60,
                    },
                },
            },
            // Default Fallback
            {
                urlPattern: /^https?.*/,
                handler: "NetworkFirst",
                options: {
                    cacheName: "others-cache",
                    expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 24 * 60 * 60,
                    },
                    networkTimeoutSeconds: 10,
                },
            },
        ],
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), payment=()',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-eval' 'unsafe-inline';
                            style-src 'self' 'unsafe-inline';
                            img-src 'self' blob: data: https:;
                            font-src 'self';
                            object-src 'none';
                            base-uri 'self';
                            form-action 'self';
                            frame-ancestors 'none';
                            connect-src 'self' https://*.ingest.sentry.io https://unpkg.com https://cdn.jsdelivr.net;
                        `.replace(/\s{2,}/g, ' ').trim(),
                    }
                ],
            },
        ];
    },
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        optimizePackageImports: ['antd', '@ant-design/icons'],
    },
};

export default withPWA(nextConfig);
