import { NOMBRE_ESTADO, type Estado } from "@/lib/pedidos";

const COLORES = {
  recibido: "bg-zinc-100 text-zinc-700",
  preparando: "bg-amber-100 text-amber-800",
  en_camino: "bg-sky-100 text-sky-800",
  entregado: "bg-emerald-100 text-emerald-800",
};

export default function EtiquetaEstado({ estado }: { estado: Estado }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${COLORES[estado]}`}>
      {NOMBRE_ESTADO[estado]}
    </span>
  );
}
