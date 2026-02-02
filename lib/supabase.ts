
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

/**
 * INSTITUTIONAL CLOUD CONFIGURATION
 * These credentials are hardcoded to ensure the portal works automatically
 * on any device without manual setup.
 */
const SUPABASE_URL = 'https://vqcbdxuklgcpoyuvjrdj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2JkeHVrbGdjcG95dXZqcmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTU4ODYsImV4cCI6MjA4NTUzMTg4Nn0.-HXi5xbCU5sUp2a7y1lh-OGZL6NsmjkEHUgw2g0ATTQ';

// Diagnostics for the browser console
if (typeof window !== 'undefined') {
  console.log(
    '%c LASUSTECH CLOUD SYNC %c', 
    'background: #2563eb; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 4px;',
    'color: #2563eb; font-weight: bold;',
    'Institutional Repository Connected'
  );
}

// Initialize client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Returns true if the institutional credentials are set.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
};
