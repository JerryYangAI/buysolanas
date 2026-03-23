import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export type ContentMeta = {
  slug: string;
  title: string;
  description: string;
  order?: number;
  next?: string;
  category?: string;
  related?: string[];
};

export type ContentItem = {
  meta: ContentMeta;
  content: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

function getContentPath(
  type: 'course' | 'glossary',
  locale: string,
  slug: string
): string {
  return path.join(contentDir, type, locale, `${slug}.mdx`);
}

function contentExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function getContentItem(
  type: 'course' | 'glossary',
  locale: string,
  slug: string
): ContentItem | null {
  let filePath = getContentPath(type, locale, slug);

  // Fallback to English if locale file doesn't exist
  if (!contentExists(filePath)) {
    filePath = getContentPath(type, 'en', slug);
    if (!contentExists(filePath)) {
      return null;
    }
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      order: data.order,
      next: data.next,
      category: data.category,
      related: data.related,
    },
    content,
  };
}

export function getAllSlugs(
  type: 'course' | 'glossary',
  locale: string
): string[] {
  const dir = path.join(contentDir, type, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllContentMeta(
  type: 'course' | 'glossary',
  locale: string
): ContentMeta[] {
  const slugs = getAllSlugs(type, locale);

  const items = slugs
    .map((slug) => {
      const item = getContentItem(type, locale, slug);
      return item?.meta ?? null;
    })
    .filter((m): m is ContentMeta => m !== null);

  // Sort by order for courses
  if (type === 'course') {
    items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  } else {
    items.sort((a, b) => a.title.localeCompare(b.title));
  }

  return items;
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-')
      .replace(/^-|-$/g, '');
    toc.push({ id, text, level });
  }

  return toc;
}
