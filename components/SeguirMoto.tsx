"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { desempacar, type Posicion } from "@/lib/binario";
import Mapa from "./Mapa";

// Lo que ve el cliente: la moto moviéndose en el mapa.
// Broadcast manda mensajes al momento y no los guarda en la base:
// la ubicación de cada segundo solo sirve en el momento y no hace falta guardarla.
export default function SeguirMoto({ pedidoId }: { pedidoId: number }) {
  const [posicion, setPosicion] = useState<Posicion | null>(null);
  const [peso, setPeso] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const canal = supabase
      .channel(`pedido-${pedidoId}`)
      .on("broadcast", { event: "posicion" }, ({ payload }) => {
        if (payload instanceof ArrayBuffer) {
          // Llegó empacado en binario.
          setPosicion(desempacar(payload)[0]);
          setPeso(`${payload.byteLength} bytes en binario`);
        } else {
          // Llegó como texto (JSON).
          setPosicion([payload.lat, payload.lng]);
          setPeso(`${JSON.stringify(payload).length} bytes en texto`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [pedidoId]);

  return (
    <div>
      <Mapa posicion={posicion} />
      <p className="mt-2 text-xs text-zinc-500">
        {peso ? `Último aviso de la moto: ${peso}` : "Esperando a que el repartidor salga."}
      </p>
    </div>
  );
}
