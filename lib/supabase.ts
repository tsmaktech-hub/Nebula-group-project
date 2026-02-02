
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

const getEnv = (key: string): string | null => {
  try {
    return (window as any).process?.env?.[key] || (process as any)?.env?.[key] || null;
  } catch {
    return null;
  }
};

const getStoredConfig = () => {
  const url = localStorage.getItem('supabase_url') || getEnv('SUPABASE_URL') || '';
  const key = localStorage.getItem('supabase_anon_key') || getEnv('SUPABASE_ANON_KEY') || '';
  return { url, key };
};

let { url: currentUrl, key: currentKey } = getStoredConfig();

// Use placeholders only if absolutely nothing is provided to prevent constructor error
export let supabase = createClient(
  currentUrl || 'https://placeholder.supabase.co', 
  currentKey || 'placeholder'
);

export const isSupabaseConfigured = () => {
  const config = getStoredConfig();
  return config.url.includes('supabase.co') && config.key.length > 20;
};

export const updateSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('supabase_url', url);
  localStorage.setItem('supabase_anon_key', key);
  supabase = createClient(url, key);
  return true;
};
