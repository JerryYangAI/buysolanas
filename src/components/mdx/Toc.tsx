'use client';

import type { TocItem } from '@/lib/mdx';

type TocProps = {
  items: TocItem[];
  label: string;
};

export default function Toc({ items, label }: TocProps) {
  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground-tertiary">
        {label}
      </p>
      <ul className="flex flex-col gap-1.5 border-l border-foreground-tertiary/20 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 border-transparent py-0.5 text-foreground-secondary transition-colors hover:border-foreground hover:text-foreground ${
                item.level === 3 ? 'pl-6' : 'pl-4'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
