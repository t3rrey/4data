//Supabase link, url and key to access the data in the database
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://pukkfcmklvjmkwjatoox.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1a2tmY21rbHZqbWt3amF0b294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2ODgxODIsImV4cCI6MTk5NjI2NDE4Mn0.8WF5XcS__ohnsGkT806gksoX69xL7LHlX6x7A9wg1ek";
export const supabase = createClient(supabaseUrl, supabaseKey);
