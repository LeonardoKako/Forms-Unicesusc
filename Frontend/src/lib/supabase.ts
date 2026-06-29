import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Using fallback for Vercel demo.");
}

const safeUrl = supabaseUrl && supabaseUrl.startsWith("http") ? supabaseUrl : "https://placeholder-supabase.co";
const safeKey = supabaseAnonKey || "placeholder-key";

export const supabase = createClient(safeUrl, safeKey);
