'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { routing } from '@/i18n/routing';

const navItems = [
  { key: 'prices', href: '/prices' },
  { key: 'start', href: '/start' },
  { key: 'course', href: '/course' },
  { key: 'glossary', href: '/glossary' },
  { key: 'community', href: '/community' },
  { key: 'domains', href: '/domains' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-glass-border)] bg-[rgba(10,10,15,0.85)] shadow-[0_1px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-[60px] items-center justify-between">
          {/* Logo — Solana gradient */}
          <Link href="/" className="gradient-text text-lg font-bold tracking-tight" style={{ letterSpacing: '-0.5px' }}>
            BuySolanas
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`relative py-1 text-sm transition-colors ${
                  pathname === item.href
                    ? 'font-medium text-foreground'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                {t(item.key)}
                {pathname === item.href && (
                  <span className="absolute -bottom-[1.1rem] left-0 right-0 h-[2px] bg-gradient-to-r from-sol-purple to-sol-green" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA Button */}
            <Link
              href="/start"
              className="hidden rounded-lg bg-sol-purple px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-85 sm:inline-block"
            >
              {t('start')}
            </Link>

            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {routing.locales.map((locale) => (
                <Link
                  key={locale}
                  href={pathname || '/'}
                  locale={locale}
                  className={`rounded px-2.5 py-1 text-xs transition-all duration-200 ${
                    locale === currentLocale
                      ? 'border border-sol-purple/40 text-sol-purple'
                      : 'border border-transparent text-foreground-tertiary hover:text-foreground-secondary'
                  }`}
                >
                  {locale === 'en' ? 'EN' : '中文'}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-foreground-secondary transition-colors hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <nav className="animate-fade-in-up border-t border-[var(--color-glass-border)] pb-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-sol-purple'
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
