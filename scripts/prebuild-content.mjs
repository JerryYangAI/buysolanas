/**
 * Pre-build script: Compiles all MDX content into a single JSON manifest.
 * This runs at build time (Node.js) so we can use fs.
 * The output JSON is imported at runtime (Edge/Cloudflare) without needing fs.
 *
 * Output: src/lib/content-manifest.json
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const outputPath = path.join(rootDir, 'src', 'lib', 'content-manifest.json');

const contentTypes = ['course', 'glossary'];
const locales = ['en', 'zh-CN'];

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
        content,
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
console.log(`\n✅ Content manifest written to src/lib/content-manifest.json`);
console.log(`   Total: ${totalFiles} content items`);
