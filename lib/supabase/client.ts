import { createBrowserClient } from "@supabase/ssr";

// Crea el cliente de Supabase para el navegador.
// Solo se usa en componentes que empiezan con "use client".
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
