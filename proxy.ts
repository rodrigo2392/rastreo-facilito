import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Corre antes de cada petición: si el token de la sesión está por caducar,
// lo renueva y lo guarda en las cookies.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Las imágenes y los archivos estáticos no necesitan sesión.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
