import { createClient } from "@supabase/supabase-js";

/**
 * OBS-02: Client Supabase Securizat Server-Side
 *
 * SECURITATE:
 * 1. Preferă SUPABASE_SERVICE_ROLE_KEY pe server (fără prefix NEXT_PUBLIC_).
 * 2. Dacă este folosit NEXT_PUBLIC_SUPABASE_ANON_KEY, acesta trebuie restricționat
 *    strict prin politici Row Level Security (RLS) care interzic SELECT/UPDATE/DELETE public.
 * 3. Nu aruncă eroare fatală la import dacă variabilele lipsesc în dev.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Export pentru compatibilitate inversă (dacă variabilele sunt prezente)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;