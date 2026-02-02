
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

/**
 * SENIOR ENGINEER NOTE: 
 * We use direct literals for process.env and import.meta.env.
 * Many build tools (Vercel, Vite, Webpack) perform static analysis and 
 * string-replacement. They will only find and replace these variables 
 * if they are written out exactly like this.
 */

const getUrl = (): string => {
  // Try various common environment patterns
  const url = 
    (typeof process !== 'undefined' ? process.env?.SUPABASE_URL : '') ||
    (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_SUPABASE_URL : '') ||
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (import.meta as any).env?.SUPABASE_URL ||
    '';
  return String(url).trim().replace(/['"]/g, '');
};

const getKey = (): string => {
  const key = 
    (typeof process !== 'undefined' ? process.env?.SUPABASE_ANON_KEY : '') ||
    (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_SUPABASE_ANON_KEY : '') ||
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    (import.meta as any).env?.SUPABASE_ANON_KEY ||
    '';
  return String(key).trim().replace(/['"]/g, '');
};

const URL = getUrl();
const KEY = getKey();

// Diagnostic logging for the browser console (safe for production)
if (typeof window !== 'undefined') {
  console.log(
    '%c LASUSTECH CLOUD SYNC %c', 
    'background: #2563eb; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 4px;',
    'color: #2563eb; font-weight: bold;',
    URL ? 'Connection Initialized' : 'Missing Environment Variables'
  );
}

// Initialize the client. 
// If variables are missing, we use placeholders to prevent crashing,
// and the app will handle the 'unconfigured' state via isSupabaseConfigured().
export const supabase = createClient(
  URL || 'https://placeholder-lasustech.supabase.co',
  KEY || 'placeholder-key'
);

/**
 * Returns true only if the environment variables were successfully detected.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(URL && KEY && URL.length > 10 && KEY.length > 20);
};
