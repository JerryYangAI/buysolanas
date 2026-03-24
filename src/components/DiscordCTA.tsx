import { useTranslations } from 'next-intl';

const DISCORD_INVITE = 'https://discord.gg/buysolanas'; // Replace with actual invite link

export default function DiscordCTA() {
  const t = useTranslations('discord');

  return (
    <section className="relative overflow-hidden border-y border-[var(--color-glass-border)] bg-background-secondary py-16">
      {/* Glow background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(88,101,242,0.15) 0%, transparent 70%)' }} />

      <div className="container-custom relative mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5865F2]/20">
          <svg width="28" height="22" viewBox="0 0 28 22" fill="#5865F2">
            <path d="M23.7 1.84A23.25 23.25 0 0 0 17.9.01a.09.09 0 0 0-.09.04c-.25.44-.52.96-.72 1.39a21.5 21.5 0 0 0-6.18 0 14 14 0 0 0-.73-1.4.09.09 0 0 0-.1-.03 23.2 23.2 0 0 0-5.8 1.83.08.08 0 0 0-.04.03C.66 8.07-.4 14.1.12 20.06a.1.1 0 0 0 .04.07 23.3 23.3 0 0 0 7.07 3.6.09.09 0 0 0 .1-.03 16.7 16.7 0 0 0 1.44-2.36.09.09 0 0 0-.05-.12 15.4 15.4 0 0 1-2.2-1.06.09.09 0 0 1-.01-.15c.15-.11.3-.23.43-.35a.09.09 0 0 1 .09-.01c4.61 2.12 9.61 2.12 14.17 0a.09.09 0 0 1 .1.01c.14.12.29.24.44.35a.09.09 0 0 1 0 .15c-.7.42-1.43.77-2.2 1.06a.09.09 0 0 0-.05.13c.42.82.9 1.61 1.44 2.35a.09.09 0 0 0 .1.04 23.24 23.24 0 0 0 7.08-3.6.1.1 0 0 0 .04-.07c.62-6.5-.98-12.48-4.23-17.6a.08.08 0 0 0-.04-.04ZM9.35 16.45c-1.52 0-2.76-1.4-2.76-3.13 0-1.72 1.22-3.13 2.76-3.13 1.55 0 2.78 1.42 2.76 3.13 0 1.73-1.22 3.13-2.76 3.13Zm10.2 0c-1.52 0-2.76-1.4-2.76-3.13 0-1.72 1.22-3.13 2.76-3.13 1.55 0 2.78 1.42 2.76 3.13 0 1.73-1.21 3.13-2.76 3.13Z" />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-bold">{t('title')}</h2>
        <p className="mb-6 text-foreground-secondary">{t('description')}</p>

        <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm">
          <div className="glass-card px-4 py-2">💬 {t('feat1')}</div>
          <div className="glass-card px-4 py-2">📢 {t('feat2')}</div>
          <div className="glass-card px-4 py-2">🎯 {t('feat3')}</div>
          <div className="glass-card px-4 py-2">📈 {t('feat4')}</div>
        </div>

        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 font-medium text-white shadow-lg shadow-[#5865F2]/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#5865F2]/40"
        >
          <svg width="20" height="16" viewBox="0 0 28 22" fill="currentColor">
            <path d="M23.7 1.84A23.25 23.25 0 0 0 17.9.01a.09.09 0 0 0-.09.04c-.25.44-.52.96-.72 1.39a21.5 21.5 0 0 0-6.18 0 14 14 0 0 0-.73-1.4.09.09 0 0 0-.1-.03 23.2 23.2 0 0 0-5.8 1.83.08.08 0 0 0-.04.03C.66 8.07-.4 14.1.12 20.06a.1.1 0 0 0 .04.07 23.3 23.3 0 0 0 7.07 3.6.09.09 0 0 0 .1-.03 16.7 16.7 0 0 0 1.44-2.36.09.09 0 0 0-.05-.12 15.4 15.4 0 0 1-2.2-1.06.09.09 0 0 1-.01-.15c.15-.11.3-.23.43-.35a.09.09 0 0 1 .09-.01c4.61 2.12 9.61 2.12 14.17 0a.09.09 0 0 1 .1.01c.14.12.29.24.44.35a.09.09 0 0 1 0 .15c-.7.42-1.43.77-2.2 1.06a.09.09 0 0 0-.05.13c.42.82.9 1.61 1.44 2.35a.09.09 0 0 0 .1.04 23.24 23.24 0 0 0 7.08-3.6.1.1 0 0 0 .04-.07c.62-6.5-.98-12.48-4.23-17.6a.08.08 0 0 0-.04-.04ZM9.35 16.45c-1.52 0-2.76-1.4-2.76-3.13 0-1.72 1.22-3.13 2.76-3.13 1.55 0 2.78 1.42 2.76 3.13 0 1.73-1.22 3.13-2.76 3.13Zm10.2 0c-1.52 0-2.76-1.4-2.76-3.13 0-1.72 1.22-3.13 2.76-3.13 1.55 0 2.78 1.42 2.76 3.13 0 1.73-1.21 3.13-2.76 3.13Z" />
          </svg>
          {t('joinButton')}
        </a>

        <p className="mt-4 text-xs text-foreground-tertiary">{t('memberCount')}</p>
      </div>
    </section>
  );
}
