import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Elysian Enterprise Platform',
        short_name: 'Elysian',
        description: 'Next-Gen Enterprise Dashboard with AI Integration',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/logo.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/logo.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
            },
        ],
    };
}
