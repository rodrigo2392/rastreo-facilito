"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Presence: quién está conectado ahora mismo, como el "en línea" de WhatsApp.
export default function EnLinea({ soyTienda }: { soyTienda: boolean }) {
  const [tiendaEnLinea, setTiendaEnLinea] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const canal = supabase.channel("fonda");

    canal
      .on("presence", { event: "sync" }, () => {
        // Solo la tienda se anota en la lista, así que si hay alguien, es la tienda.
        setTiendaEnLinea(Object.keys(canal.presenceState()).length > 0);
      })
      .subscribe(async (estado) => {
        if (soyTienda && estado === "SUBSCRIBED") {
          await canal.track({ rol: "tienda" });
        }
      });

    return () => {
      supabase.removeChannel(canal);
    };
  }, [soyTienda]);

  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
      <span
        className={`h-2.5 w-2.5 rounded-full ${tiendaEnLinea ? "bg-emerald-500" : "bg-zinc-300"}`}
      />
      {tiendaEnLinea ? "La tienda está en línea" : "La tienda no está conectada"}
    </p>
  );
}
