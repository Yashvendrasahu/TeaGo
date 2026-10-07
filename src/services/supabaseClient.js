import { createClient } from '@supabase/supabase-js';

let envUrl = import.meta.env.VITE_SUPABASE_URL || '';
let envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export let isClientSupabaseConfigured = Boolean(
  envUrl &&
  envAnonKey &&
  !envUrl.includes('your-project')
);

export let supabaseClient = isClientSupabaseConfigured
  ? createClient(envUrl, envAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    })
  : null;

// Async auto-initializer from backend config if VITE_ vars were not statically bundled
export async function initSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  try {
    const res = await fetch('/api/supabase/config');
    const data = await res.json();
    if (data?.isConfigured && data.supabaseUrl && data.supabaseAnonKey) {
      envUrl = data.supabaseUrl;
      envAnonKey = data.supabaseAnonKey;
      isClientSupabaseConfigured = true;
      supabaseClient = createClient(envUrl, envAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      });
      return supabaseClient;
    }
  } catch (e) {
    console.warn('Could not auto-initialize supabase client from server config:', e);
  }
  return null;
}

// Call on startup
initSupabaseClient().catch(console.warn);
