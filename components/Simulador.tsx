"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { empacar, pesoEnBinario, pesoEnTexto } from "@/lib/binario";
import { RUTA } from "@/lib/ruta";
import Mapa from "./Mapa";

// Hace de repartidor: recorre la ruta grabada y avisa su posición cada segundo.
export default function Simulador({ pedidoId }: { pedidoId: number }) {
  const [paso, setPaso] = useState<number | null>(null);
  const [enBinario, setEnBinario] = useState(false);
  const canal = useRef<RealtimeChannel | null>(null);

  // Se conecta al canal del pedido al abrir la tarjeta y se desconecta al salir.
  useEffect(() => {
    const supabase = createClient();
    const nuevo = supabase.channel(`pedido-${pedidoId}`).subscribe();
    canal.current = nuevo;
    return () => {
      supabase.removeChannel(nuevo);
    };
  }, [pedidoId]);

  // Mientras no llegue, cada segundo avanza un punto de la ruta.
  useEffect(() => {
    if (paso === null || paso === RUTA.length - 1) return;
    const reloj = setTimeout(() => setPaso(paso + 1), 1000);
    return () => clearTimeout(reloj);
  }, [paso]);

  // Cada punto nuevo se avisa por el canal, en texto o empacado en binario.
  useEffect(() => {
    if (paso === null) return;
    const [lat, lng] = RUTA[paso];
    const payload = enBinario ? empacar([[lat, lng]]) : { lat, lng };
    // Clase 6, bloque 2: aquí se manda el aviso por el canal. Por ahora solo se ve en la consola.
    console.log("Aviso listo para mandar:", payload);
  }, [paso, enBinario]);

  const posicion = paso === null ? null : RUTA[paso];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setPaso(0)}
          className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
        >
          {paso === null ? "Salir a repartir 🛵" : "Volver a salir"}
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enBinario}
            onChange={(e) => setEnBinario(e.target.checked)}
          />
          Mandar en binario
        </label>
      </div>

      <Mapa posicion={posicion} />

      <p className="mt-2 text-xs text-zinc-500">
        {posicion
          ? `Cada aviso pesa ${enBinario ? `${pesoEnBinario(posicion)} bytes en binario` : `${pesoEnTexto(posicion)} bytes en texto`}`
          : "La moto sigue en la fonda."}
      </p>
    </div>
  );
}
