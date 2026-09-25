import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_SUPABASE_URL
  : (typeof process !== 'undefined' && process.env ? process.env.VITE_SUPABASE_URL : '');

const supabasePublishableKey = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  : (typeof process !== 'undefined' && process.env ? process.env.VITE_SUPABASE_PUBLISHABLE_KEY : '');

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-publishable-key'
);
