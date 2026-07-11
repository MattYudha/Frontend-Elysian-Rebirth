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
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self' http://localhost:7777 http://127.0.0.1:7777 ws://localhost:7777 ws://127.0.0.1:7777 https://backend-elysian-production.up.railway.app ws://localhost:3000 wss://localhost:3000 ws://127.0.0.1:3000;
                            script-src 'self' 'unsafe-eval' 'unsafe-inline';
                            style-src 'self' 'unsafe-inline' https://api.fontshare.com;
                            img-src 'self' blob: data: https:;
                            font-src 'self' https://api.fontshare.com https://cdn.fontshare.com;
                            media-src 'self' https://d8j0ntlcm91z4.cloudfront.net;
                            object-src 'none';
                            base-uri 'self';
                            form-action 'self';
                            frame-ancestors 'none';
                            connect-src 'self' http://localhost:7777 http://127.0.0.1:7777 ws://localhost:7777 ws://127.0.0.1:7777 https://backend-elysian-production.up.railway.app https://i.pravatar.cc https://api.fontshare.com https://cdn.fontshare.com https://vitals.vercel-insights.com ws://localhost:3000 wss://localhost:3000 ws://127.0.0.1:3000 https://*.ingest.sentry.io https://unpkg.com https://cdn.jsdelivr.net;
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
    images: {
        unoptimized: true,
    },
    optimizeFonts: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default withPWA(nextConfig);
