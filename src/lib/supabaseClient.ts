import { createClient } from '@supabase/supabase-js';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const processEnv = typeof process !== 'undefined' ? process.env : undefined;

const supabaseUrl =
  metaEnv?.VITE_SUPABASE_URL ||
  processEnv?.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ggjcjfivtjxuyficvixu.supabase.co';

const supabaseAnonKey =
  metaEnv?.VITE_SUPABASE_ANON_KEY ||
  processEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_jLZ91VS1xYjJfM14F1J7Fg_Re0Rtum0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
