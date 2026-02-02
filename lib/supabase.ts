
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

/**
 * Robustly retrieves environment variables from multiple possible sources
 * commonly used in modern frontend deployments.
 */
const getEnv = (key: string): string => {
  try {
    // 1. Try standard process.env (Bundlers/Node)
    const processEnv = (typeof process !== 'undefined' ? process.env : null) || (window as any).process?.env;
    if (processEnv?.[key]) return String(processEnv[key]).trim();

    // 2. Try import.meta.env (Vite/ESM Standard)
    const metaEnv = (import.meta as any).env;
    if (metaEnv?.[key]) return String(metaEnv[key]).trim();
    if (metaEnv?.[`VITE_${key}`]) return String(metaEnv[`VITE_${key}`]).trim();

    // 3. Try common public prefixes
    if (processEnv?.[`NEXT_PUBLIC_${key}`]) return String(processEnv[`NEXT_PUBLIC_${key}`]).trim();
    if (processEnv?.[`REACT_APP_${key}`]) return String(processEnv[`REACT_APP_${key}`]).trim();

    // 4. Try window globals (sometimes used for runtime injection)
    const winEnv = (window as any).__ENV__ || (window as any).env;
    if (winEnv?.[key]) return String(winEnv[key]).trim();
  } catch (e) {
    // Silent catch to prevent app crash during detection
  }
  return '';
};

const getStoredConfig = () => {
  const url = localStorage.getItem('supabase_url') || getEnv('SUPABASE_URL');
  const key = localStorage.getItem('supabase_anon_key') || getEnv('SUPABASE_ANON_KEY');
  return { url, key };
};

// Initial config check
let { url: currentUrl, key: currentKey } = getStoredConfig();

// Diagnostics (Hidden in production usually, but helpful for setup)
console.group('🛠 LASUSTECH Portal: Database Diagnostics');
console.log('Supabase URL detected:', currentUrl ? '✅ FOUND' : '❌ MISSING');
console.log('Anon Key detected:', currentKey ? `✅ FOUND (${currentKey.slice(0, 8)}...)` : '❌ MISSING');
console.groupEnd();

// Initialize client
export let supabase = createClient(
  currentUrl || 'https://placeholder.supabase.co', 
  currentKey || 'placeholder'
);

/**
 * Validates if the configuration is active and working.
 */
export const isSupabaseConfigured = () => {
  const { url, key } = getStoredConfig();
  
  // Re-sync local variables if they were found via getEnv but not yet in memory
  if (url && key && (url !== currentUrl || key !== currentKey)) {
    currentUrl = url;
    currentKey = key;
    supabase = createClient(url, key);
  }

  const hasUrl = url && url.length > 10 && (url.startsWith('http') || url.includes('.supabase.co'));
  const hasKey = key && key.length > 20;
  return !!(hasUrl && hasKey);
};

/**
 * Manually updates the configuration (used for the setup UI fallback).
 */
export const updateSupabaseConfig = (url: string, key: string) => {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  localStorage.setItem('supabase_url', cleanUrl);
  localStorage.setItem('supabase_anon_key', cleanKey);
  
  // Update internal state and re-initialize client
  currentUrl = cleanUrl;
  currentKey = cleanKey;
  supabase = createClient(cleanUrl, cleanKey);
  
  console.log('🚀 Database configuration updated manually.');
  return true;
};
