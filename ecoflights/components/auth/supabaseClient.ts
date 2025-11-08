
// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types' // <-- Import the new types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be set in .env.local')
}

// Pass the 'Database' type to createClient
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)