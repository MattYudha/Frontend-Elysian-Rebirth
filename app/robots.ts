import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about',
        '/pricing',
        '/blog',
        '/usecases',
        '/use-cases/',
        '/help',
        '/docs',
        '/documentations',
        '/swagger.json',
        '/swagger.yaml',
      ],
      disallow: [
        '/dashboard/',
        '/admin/',
        '/api/',
        '/settings/',
        '/chat/',
        '/workflow/',
        '/swarm/',
        '/rag/',
        '/observability/',
      ],
    },
    sitemap: 'https://elysianlabs.web.id/sitemap.xml',
  };
}
