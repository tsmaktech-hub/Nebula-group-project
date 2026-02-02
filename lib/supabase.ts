
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

/**
 * We use direct process.env literals here. 
 * Many build tools (like Vercel's or Vite) perform a literal string replacement 
 * and will only find variables if they are written exactly as 'process.env.NAME'.
 */
const RAW_URL = process.env.SUPABASE_URL || (process.env as any).NEXT_PUBLIC_SUPABASE_URL || '';
const RAW_KEY = process.env.SUPABASE_ANON_KEY || (process.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Clean the strings (remove quotes or whitespace if injected incorrectly)
const clean = (val: string) => val.replace(/['"]/g, '').trim();

export const SUPABASE_URL = clean(RAW_URL);
export const SUPABASE_ANON_KEY = clean(RAW_KEY);

// Diagnostics for the browser console to help you debug
if (typeof window !== 'undefined') {
  console.group('🛠 LASUSTECH Portal: Cloud Sync Status');
  console.log('Target URL:', SUPABASE_URL ? '✅ Detected' : '❌ Missing');
  console.log('Security Key:', SUPABASE_ANON_KEY ? '✅ Detected' : '❌ Missing');
  console.log('Build Environment:', typeof process !== 'undefined' ? 'Node/Transpiler' : 'Browser-Only');
  console.groupEnd();
}

// Initialize client
// If variables are missing, we use placeholders to prevent the app from crashing on boot,
// but operations will fail gracefully via the isSupabaseConfigured() check.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder'
);

/**
 * Validates if the credentials are present and look correct.
 */
export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL.length > 10 && 
    SUPABASE_URL.startsWith('http') && 
    SUPABASE_ANON_KEY.length > 20
  );
};
