import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllSlugs } from '@/lib/mdx';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://buysolanas.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPaths = ['', '/course', '/glossary', '/prices', '/ask', '/community'];

  for (const pathname of staticPaths) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${pathname}`,
        lastModified: new Date(),
        changeFrequency: pathname === '/prices' ? 'hourly' : 'weekly',
        priority: pathname === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${pathname}`])
          ),
        },
      });
    }
  }

  // Dynamic course pages
  const courseSlugs = getAllSlugs('course', 'en');
  for (const slug of courseSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/course/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [`${l}`, `${BASE_URL}/${l}/course/${slug}`])
          ),
        },
      });
    }
  }

  // Dynamic glossary pages
  const glossarySlugs = getAllSlugs('glossary', 'en');
  for (const slug of glossarySlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/glossary/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [`${l}`, `${BASE_URL}/${l}/glossary/${slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
