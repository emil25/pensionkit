import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

// Akkor tekintjük beállítottnak, ha a config.js ki van töltve.
const url = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
export const isConfigured = typeof url === 'string' && url.startsWith('https://') && typeof key === 'string' && key.length > 20;

export const supabase = isConfigured
  ? createClient(url, key)
  : null;
