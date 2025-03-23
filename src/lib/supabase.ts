import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase-types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key. Check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
