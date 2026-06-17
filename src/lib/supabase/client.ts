import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (typeof window !== 'undefined') {
    const isUrlOk = !!supabaseUrl && supabaseUrl.startsWith('https://');
    const isKeyOk = !!supabaseAnonKey && supabaseAnonKey.length > 20;
    
    console.log('Supabase Client Diagnostics:', {
      url_configured: !!supabaseUrl,
      url_starts_with_https: isUrlOk,
      key_configured: !!supabaseAnonKey,
      key_length_ok: isKeyOk,
    });

    if (!isUrlOk || !isKeyOk) {
      console.error('Supabase configuration error. Check your Vercel environment variables.');
    }
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
  )
}
