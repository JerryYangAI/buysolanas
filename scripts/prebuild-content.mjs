/**
 * Pre-build script: Compiles all MDX content into a single JSON manifest.
 * - Parses frontmatter with gray-matter
 * - Converts Markdown body to HTML with remark (no runtime MDX compilation needed)
 * - Output: src/lib/content-manifest.json
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const outputPath = path.join(rootDir, 'src', 'lib', 'content-manifest.json');

const contentTypes = ['course', 'glossary'];
const locales = ['en', 'zh-CN'];

// Create remark processor
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHtml, { sanitize: false });

const manifest = {};

for (const type of contentTypes) {
  manifest[type] = {};

  for (const locale of locales) {
    manifest[type][locale] = {};

    const dir = path.join(contentDir, type, locale);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data, content } = matter(raw);

      // Strip JSX components (e.g. <Quiz .../>) — they can't be rendered as HTML
      // Keep the component name as a placeholder
      const cleanContent = content
        .replace(/<Quiz\s+[^>]*\/>/g, '') // Remove self-closing Quiz tags
        .replace(/<Quiz[^>]*>[\s\S]*?<\/Quiz>/g, ''); // Remove Quiz blocks

      // Convert markdown to HTML at build time
      let html = '';
      try {
        const result = await processor.process(cleanContent);
        html = String(result);
      } catch (e) {
        console.warn(`  ⚠ Failed to compile ${type}/${locale}/${slug}: ${e.message}`);
        html = `<p>${cleanContent.replace(/</g, '&lt;')}</p>`;
      }

      manifest[type][locale][slug] = {
        meta: {
          slug,
          title: data.title ?? slug,
          description: data.description ?? '',
          order: data.order ?? undefined,
          next: data.next ?? undefined,
          category: data.category ?? undefined,
          related: data.related ?? undefined,
        },
        content: cleanContent, // raw markdown (for TOC extraction)
        html, // pre-rendered HTML (for display)
      };
    }
  }
}

// Count stats
let totalFiles = 0;
for (const type of contentTypes) {
  for (const locale of locales) {
    const count = Object.keys(manifest[type][locale]).length;
    totalFiles += count;
    console.log(`  ${type}/${locale}: ${count} files`);
  }
}

fs.writeFileSync(outputPath, JSON.stringify(manifest));
const sizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
console.log(`\n✅ Content manifest written (${sizeMB} MB)`);
console.log(`   Total: ${totalFiles} content items`);
