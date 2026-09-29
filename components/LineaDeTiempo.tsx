import { NOMBRE_ESTADO, horaMexico, type Historial } from "@/lib/pedidos";

// El rastreo del pedido, como en las paqueterías: cada paso con su hora.
// Nadie lo escribe a mano: la base lo anota sola cada que cambia el estado.
export default function LineaDeTiempo({ historial }: { historial: Historial[] }) {
  if (historial.length === 0) return null;

  return (
    <ol className="mt-4 space-y-1 border-l-2 border-orange-200 pl-4 text-sm">
      {historial.map((paso) => (
        <li key={paso.id}>
          <span className="font-medium">{NOMBRE_ESTADO[paso.estado]}</span>{" "}
          <span className="text-zinc-500">{horaMexico(paso.created_at)}</span>
        </li>
      ))}
    </ol>
  );
}
