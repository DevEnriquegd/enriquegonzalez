import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseServer = null;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
} else {
  // In development we may intentionally not set Supabase; use local JSON fallback.
  // Avoid throwing here so routes can decide to fallback to file storage.
  // eslint-disable-next-line no-console
  console.warn("Supabase server keys are not set; using local file fallback.");
}

export default supabaseServer;

export { supabaseServer };
