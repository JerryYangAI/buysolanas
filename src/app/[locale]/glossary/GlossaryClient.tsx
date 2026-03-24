'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/i18n/navigation';
import { Search, BookMarked } from 'lucide-react';
import type { ContentMeta } from '@/lib/mdx';

type Props = {
  terms: ContentMeta[];
  categories: string[];
  letters: string[];
  translations: {
    searchPlaceholder: string;
    allCategories: string;
    noResults: string;
    solanaTag: string;
  };
};

const categoryColors: Record<string, string> = {
  solana: 'bg-sol-purple/10 text-sol-purple border-sol-purple/20',
  defi: 'bg-sol-green/10 text-sol-green border-sol-green/20',
  nft: 'bg-sol-blue/10 text-sol-blue border-sol-blue/20',
  trading: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  security: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  culture: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

export default function GlossaryClient({ terms, categories, letters, translations }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || t.category === activeCategory;
      const matchesLetter = !activeLetter || t.title[0].toUpperCase() === activeLetter;
      return matchesSearch && matchesCategory && matchesLetter;
    });
  }, [terms, search, activeCategory, activeLetter]);

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
          placeholder={translations.searchPlaceholder}
          className="w-full rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-glass)] py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-sol-purple/40 focus:outline-none focus:ring-1 focus:ring-sol-purple/20 transition-all"
        />
      </div>

      {/* A-Z letter nav */}
      <div className="mb-4 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveLetter(null)}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            !activeLetter ? 'bg-sol-purple/20 text-sol-purple' : 'text-foreground-tertiary hover:text-foreground-secondary'
          }`}
        >
          All
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => { setActiveLetter(activeLetter === letter ? null : letter); setSearch(''); }}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              activeLetter === letter ? 'bg-sol-purple/20 text-sol-purple' : 'text-foreground-tertiary hover:text-foreground-secondary'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            !activeCategory ? 'bg-sol-purple/20 text-sol-purple' : 'border border-[var(--color-glass-border)] text-foreground-tertiary hover:text-foreground-secondary'
          }`}
        >
          {translations.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
              activeCategory === cat
                ? categoryColors[cat] || 'bg-sol-purple/20 text-sol-purple border-sol-purple/20'
                : 'border-[var(--color-glass-border)] text-foreground-tertiary hover:text-foreground-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-foreground-tertiary">
        {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
      </p>

      {/* Terms grid */}
      {filtered.length === 0 ? (
        <div className="glass-card py-12 text-center">
          <p className="text-foreground-secondary">{translations.noResults}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((term) => (
            <Link
              key={term.slug}
              href={`/glossary/${term.slug}`}
              className="glass-card group block p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sol-purple/30"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold transition-colors group-hover:text-white">
                  {term.title}
                </h2>
                <BookMarked size={14} className="mt-0.5 shrink-0 text-foreground-tertiary transition-colors group-hover:text-sol-purple" />
              </div>
              <p className="mb-3 text-xs leading-relaxed text-foreground-secondary line-clamp-2">
                {term.description}
              </p>
              <div className="flex items-center gap-2">
                {term.category && (
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-medium capitalize ${categoryColors[term.category] || 'bg-sol-purple/10 text-sol-purple border-sol-purple/20'}`}>
                    {term.category}
                  </span>
                )}
                {term.category === 'solana' && (
                  <span className="rounded bg-sol-green/10 px-2 py-0.5 text-[10px] font-medium text-sol-green">
                    {translations.solanaTag}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
