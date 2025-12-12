import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
// Replace these with your actual Supabase credentials from https://supabase.com
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://jjsuqhccwfakyyhfhksz.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impqc3VxaGNjd2Zha3l5aGZoa3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NTkwNTAsImV4cCI6MjA4MTAzNTA1MH0.tQAsjxWIFUldY4zS6ytuGQu-SOoBR3iacBYh-6jRTaA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);