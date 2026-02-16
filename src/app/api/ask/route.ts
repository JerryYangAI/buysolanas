import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

// Simple in-memory rate limiter (per-IP, resets on deploy)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Basic input sanitizer — strip HTML tags and trim
function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'`;]/g, '')
    .trim()
    .slice(0, 1000);
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('cf-connecting-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429 }
    );
  }

  // Check Supabase configuration
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'supabase_not_configured' },
      { status: 503 }
    );
  }

  // Parse and validate body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const walletType = typeof body.wallet_type === 'string' ? sanitize(body.wallet_type) : '';
  const goal = typeof body.goal === 'string' ? sanitize(body.goal) : '';
  const stuckPoint = typeof body.stuck_point === 'string' ? sanitize(body.stuck_point) : '';
  const locale = typeof body.locale === 'string' ? sanitize(body.locale) : 'en';

  if (!walletType || !goal || !stuckPoint) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  // Insert into Supabase
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 });
  }

  const { error } = await supabase.from('questions').insert({
    wallet_type: walletType,
    goal,
    stuck_point: stuckPoint,
    locale,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
