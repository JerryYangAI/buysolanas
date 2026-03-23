'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  AlertTriangle,
  BookOpen,
  BookMarked,
} from 'lucide-react';

type ChatLink = {
  type: 'course' | 'glossary';
  slug: string;
  title: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
  blocked?: boolean;
  links?: ChatLink[];
};

export default function ChatWidget() {
  const t = useTranslations('chat');
  const params = useParams();
  const locale = params.locale as string;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, locale }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.message ?? t('fallbackReply'),
          blocked: data.type === 'blocked',
          links: data.links,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: t('networkError') },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-blue/30 transition-transform hover:scale-105 active:scale-95"
        aria-label={t('toggle')}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-[var(--color-glass-border)] bg-background/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300 sm:w-96 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        style={{ maxHeight: 'min(500px, calc(100vh - 140px))' }}
      >
        {/* Header */}
        <div className="border-b border-[var(--color-glass-border)] bg-white/[0.03] px-4 py-3">
          <p className="text-sm font-medium">{t('title')}</p>
          <p className="text-xs text-foreground-tertiary">{t('subtitle')}</p>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
          {messages.length === 0 && (
            <p className="py-8 text-center text-xs text-foreground-tertiary">
              {t('placeholder')}
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 ${msg.role === 'user' ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block max-w-[85%] px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'rounded-2xl rounded-br-sm bg-gradient-to-r from-accent-blue to-accent-purple text-white'
                    : 'rounded-2xl rounded-bl-sm bg-white/[0.05] text-foreground-secondary'
                }`}
              >
                {/* Blocked warning icon */}
                {msg.blocked && (
                  <div className="mb-1.5 flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle size={14} />
                    <span className="text-xs font-medium">
                      {t('safetyBlock')}
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Related links */}
                {msg.links && msg.links.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 border-t border-[var(--color-glass-border)] pt-2">
                    {msg.links.map((link, j) => (
                      <Link
                        key={j}
                        href={`/${link.type}/${link.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-1.5 text-xs text-accent-blue transition-colors hover:text-white"
                      >
                        {link.type === 'course' ? (
                          <BookOpen size={12} />
                        ) : (
                          <BookMarked size={12} />
                        )}
                        {link.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-3">
              <div className="inline-block rounded-2xl rounded-bl-sm bg-white/[0.05] px-3 py-2">
                <Loader2 size={14} className="animate-spin text-foreground-tertiary" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[var(--color-glass-border)] bg-white/[0.02] p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder={t('inputPlaceholder')}
              className="flex-1 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-3 py-2 text-sm text-foreground placeholder:text-foreground-tertiary focus:border-accent-blue/50 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple p-2 text-white transition-all hover:brightness-110 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
