
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';

// Fallback to placeholders to prevent 'URL is required' crash during initialization
const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = !!(process.env as any).SUPABASE_URL && !!(process.env as any).SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
