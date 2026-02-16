'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { routing } from '@/i18n/routing';

const navItems = [
  { key: 'start', href: '/start' },
  { key: 'course', href: '/course' },
  { key: 'glossary', href: '/glossary' },
  { key: 'prices', href: '/prices' },
  { key: 'community', href: '/community' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground-tertiary/20 bg-background/80 backdrop-blur-md">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight">
            Buysolanas
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {routing.locales.map((locale) => (
                <Link
                  key={locale}
                  href={pathname || '/'}
                  locale={locale}
                  className={`rounded px-2 py-1 text-xs transition-colors ${
                    locale === currentLocale
                      ? 'bg-foreground text-background'
                      : 'text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  {locale === 'en' ? 'EN' : '中文'}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-foreground-secondary hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <nav className="border-t border-foreground-tertiary/20 pb-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm transition-colors ${
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
