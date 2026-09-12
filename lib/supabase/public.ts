import {createClient} from '@supabase/supabase-js';

// Pour les routes purement publiques et sans session (ex. sitemap.ts) : évite toute dépendance
// à next/headers, qui n'est pas nécessaire ici puisque les données lues sont de toute façon
// accessibles à tout le monde (RLS "select" public sur activities).
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
