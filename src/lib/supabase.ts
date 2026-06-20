import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Shared types that mirror the Supabase schema ──────────────────────────

export type DbLogEntry = {
  id: string;
  user_id: string;
  monster_id: string;
  monster_name: string;
  monster_flavor: string;
  monster_cat: string;
  rating_val: number;
  note: string;
  c1: string;
  c2: string;
  lbl: string;
  str: string;
  logged_at: string;
};

export type Profile = {
  id: string;
  username: string;
  created_at: string;
};

// What DetailScreen passes to addLog (user_id is added by the hook)
export type AddLogPayload = Omit<DbLogEntry, 'id' | 'user_id' | 'logged_at'>;
