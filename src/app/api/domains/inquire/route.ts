import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, domains, message, budget } = body;

    if (!email || !domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json({ error: 'invalid_input' }, { status: 400 });
    }

    // Sanitize
    const sanitizedEmail = String(email).slice(0, 200).trim();
    const sanitizedDomains = domains.map((d: string) => String(d).slice(0, 100));
    const sanitizedMessage = String(message ?? '').slice(0, 1000).trim();
    const sanitizedBudget = String(budget ?? '').slice(0, 50).trim();

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('domain_inquiries').insert({
        email: sanitizedEmail,
        domains: sanitizedDomains,
        message: sanitizedMessage,
        budget: sanitizedBudget,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase insert error:', error);
        // Still return success — we don't want to block the user
      }
    } else {
      // Log to console if Supabase not configured
      console.log('Domain inquiry (no Supabase):', { email: sanitizedEmail, domains: sanitizedDomains, budget: sanitizedBudget });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
