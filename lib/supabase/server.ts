import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Crea el cliente de Supabase para el servidor de Next.js.
// Se usa en páginas y en Server Actions, nunca en el navegador.
// Lo de las cookies cobra sentido en la clase 2, cuando haya inicio de sesión.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Una página no puede escribir cookies.
            // En la clase 2, proxy.ts se encarga de eso.
          }
        },
      },
    }
  );
}
