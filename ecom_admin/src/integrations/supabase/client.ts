// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://igzzrnfqbhzyqduqtsxx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnenpybmZxYmh6eXFkdXF0c3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDI0MzIsImV4cCI6MjA2ODAxODQzMn0.w6TiiP6PEso6HIo1_PbvhSefm8laeDUHxBV0ZvH6YdU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});