"use client";

import { useEffect, useRef } from "react";
import type { Map as MapaLeaflet, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Posicion } from "@/lib/binario";
import { CENTRO, RUTA } from "@/lib/ruta";

// El mapa viene hecho; no es tema de la clase.
// Es OpenStreetMap con Leaflet: no pide llaves ni cuentas.
export default function Mapa({ posicion }: { posicion: Posicion | null }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const moto = useRef<Marker | null>(null);

  // Arma el mapa una sola vez. Leaflet necesita el navegador, por eso se carga aquí adentro.
  useEffect(() => {
    let cancelado = false;

    import("leaflet").then(({ default: L }) => {
      if (cancelado || !contenedor.current) return;
      mapa.current = L.map(contenedor.current).setView(CENTRO, 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(mapa.current);
      L.polyline(RUTA, { color: "#f97316", weight: 4, opacity: 0.4 }).addTo(mapa.current);
      moto.current = L.marker(RUTA[0], {
        icon: L.divIcon({ html: "🛵", className: "text-2xl", iconSize: [28, 28] }),
      }).addTo(mapa.current);
    });

    return () => {
      cancelado = true;
      mapa.current?.remove();
      mapa.current = null;
      moto.current = null;
    };
  }, []);

  // Cada que llega una posición nueva, la moto se mueve.
  useEffect(() => {
    if (posicion && moto.current) moto.current.setLatLng(posicion);
  }, [posicion]);

  return (
    <div
      ref={contenedor}
      className="mt-4 h-64 w-full overflow-hidden rounded-xl border border-zinc-200"
    />
  );
}
