"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Se suscribe a los cambios de la tabla de pedidos (Realtime) y, cuando llega uno,
// vuelve a renderizar la página con router.refresh(). El componente regresa null.
export default function EnVivo() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let canal: ReturnType<typeof supabase.channel> | null = null;
    let sigoAqui = true;

    async function escuchar() {
      // Primero se manda el token de la sesión. Sin esto la suscripción entra como anon
      // y las políticas RLS de la clase 2 no dejan pasar ningún cambio.
      await supabase.realtime.setAuth();
      if (!sigoAqui) return;

      canal = supabase
        .channel("pedidos")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "pedidos" },
          (aviso) => {
            console.log("Llegó un aviso:", aviso);
            router.refresh();
          }
        )
        // Los problemas del servidor llegan aquí, no como error: sin esta línea nadie los ve.
        .on("system", {}, (mensaje) => console.log("Mensaje del servidor:", mensaje))
        .subscribe();
    }

    escuchar();

    // Al salir de la página se cancela la suscripción.
    return () => {
      sigoAqui = false;
      if (canal) supabase.removeChannel(canal);
    };
  }, [router]);

  return null;
}
