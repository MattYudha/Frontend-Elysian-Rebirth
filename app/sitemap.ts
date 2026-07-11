import { MetadataRoute } from 'next';
import usecasesData from '@/data/usecases.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://elysianlabs.web.id';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/pricing',
    '/blog',
    '/usecases',
    '/docs',
    '/documentations',
    '/help',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic use case detail pages
  const useCaseRoutes = usecasesData.map((uc: any) => ({
    url: `${baseUrl}/use-cases/${uc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...useCaseRoutes];
}
