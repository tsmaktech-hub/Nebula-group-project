
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

// Global-safe environment accessor
const getEnv = (key: string): string => {
  try {
    // Check various common places environment variables might be hidden in different runtimes
    const env = (window as any).process?.env || (typeof process !== 'undefined' ? process.env : null);
    if (env && env[key]) return String(env[key]).trim();
    
    // Also check for VITE_ or NEXT_PUBLIC_ prefixes just in case
    if (env && env[`VITE_${key}`]) return String(env[`VITE_${key}`]).trim();
    if (env && env[`NEXT_PUBLIC_${key}`]) return String(env[`NEXT_PUBLIC_${key}`]).trim();
  } catch (e) {
    console.warn(`Error accessing environment variable ${key}:`, e);
  }
  return '';
};

const getStoredConfig = () => {
  const url = localStorage.getItem('supabase_url') || getEnv('SUPABASE_URL');
  const key = localStorage.getItem('supabase_anon_key') || getEnv('SUPABASE_ANON_KEY');
  return { url, key };
};

let { url: currentUrl, key: currentKey } = getStoredConfig();

// Initialize with placeholders to prevent constructor crash, but immediately re-config if possible
export let supabase = createClient(
  currentUrl || 'https://placeholder.supabase.co', 
  currentKey || 'placeholder'
);

export const isSupabaseConfigured = () => {
  const { url, key } = getStoredConfig();
  // Basic validation: URL should look like a URL, Key should be a long string
  const hasUrl = url && url.length > 10 && (url.startsWith('http') || url.includes('.'));
  const hasKey = key && key.length > 20;
  return !!(hasUrl && hasKey);
};

export const updateSupabaseConfig = (url: string, key: string) => {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  localStorage.setItem('supabase_url', cleanUrl);
  localStorage.setItem('supabase_anon_key', cleanKey);
  supabase = createClient(cleanUrl, cleanKey);
  return true;
};
