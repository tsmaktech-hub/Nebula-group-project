
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

/**
 * Robustly retrieves environment variables from multiple possible sources
 * commonly used in modern frontend deployments (Vercel, Vite, ESM).
 */
const getEnv = (key: string): string => {
  try {
    // 1. Try standard process.env (Bundlers/Node/Vercel)
    const processEnv = (typeof process !== 'undefined' ? process.env : null) || (window as any).process?.env;
    if (processEnv?.[key]) return String(processEnv[key]).trim();

    // 2. Try import.meta.env (Vite/ESM Standard)
    const metaEnv = (import.meta as any).env;
    if (metaEnv?.[key]) return String(metaEnv[key]).trim();
    if (metaEnv?.[`VITE_${key}`]) return String(metaEnv[`VITE_${key}`]).trim();

    // 3. Try common public prefixes
    if (processEnv?.[`NEXT_PUBLIC_${key}`]) return String(processEnv[`NEXT_PUBLIC_${key}`]).trim();
    if (processEnv?.[`REACT_APP_${key}`]) return String(processEnv[`REACT_APP_${key}`]).trim();

    // 4. Try window globals
    const winEnv = (window as any).__ENV__ || (window as any).env;
    if (winEnv?.[key]) return String(winEnv[key]).trim();
  } catch (e) {
    // Silent catch
  }
  return '';
};

// Get values from environment only
const url = getEnv('SUPABASE_URL');
const key = getEnv('SUPABASE_ANON_KEY');

// Diagnostics for the developer in the browser console
console.group('🛠 LASUSTECH Portal: Cloud Sync Status');
console.log('Target URL:', url ? '✅ Detected' : '❌ Missing (Check Vercel Env Vars)');
console.log('Security Key:', key ? '✅ Detected' : '❌ Missing (Check Vercel Env Vars)');
console.groupEnd();

// Initialize client (using placeholders if missing to avoid crash, though it won't work)
export const supabase = createClient(
  url || 'https://placeholder.supabase.co', 
  key || 'placeholder'
);

/**
 * Checks if the Supabase client has been provided with valid-looking credentials.
 */
export const isSupabaseConfigured = () => {
  const currentUrl = getEnv('SUPABASE_URL');
  const currentKey = getEnv('SUPABASE_ANON_KEY');
  return !!(currentUrl && currentUrl.length > 10 && currentKey && currentKey.length > 20);
};
