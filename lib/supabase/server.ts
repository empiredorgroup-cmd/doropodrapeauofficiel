import {createServerClient, type CookieOptions} from '@supabase/ssr';
import {cookies} from 'next/headers';

// SERVER-ONLY — utilise next/headers (cookies), à n'importer que depuis des composants serveur,
// des Route Handlers ou des Server Actions. Ne jamais importer depuis un composant 'use client'.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: {name: string; value: string; options: CookieOptions}[]) {
          try {
            cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options));
          } catch {
            // Appelé depuis un Server Component (pas une Server Action) : la session est de toute
            // façon rafraîchie par le middleware, cette erreur est sans conséquence.
          }
        },
      },
    }
  );
}
