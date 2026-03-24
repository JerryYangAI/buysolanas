import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    // Store in Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert(
            { email: email.toLowerCase().trim(), source: source ?? 'unknown', subscribed_at: new Date().toISOString() },
            { onConflict: 'email' }
          );

        if (error) {
          console.error('Newsletter subscribe error:', error);
        }
      }
    } else {
      // Fallback: log to console
      console.log(`[Newsletter] New subscriber: ${email} (source: ${source})`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
