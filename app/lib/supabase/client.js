import { createBrowserClient } from "@supabase/ssr";

let browserClient;

export function createClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing Supabase environment variables. Check .env.local.",
    );
  }

  browserClient = createBrowserClient(url, publishableKey);

  return browserClient;
}