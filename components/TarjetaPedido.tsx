import { cambiarEstado } from "@/app/acciones";
import { NOMBRE_ESTADO, siguienteEstado, type Pedido } from "@/lib/pedidos";
import EtiquetaEstado from "./EtiquetaEstado";

export default function TarjetaPedido({ pedido }: { pedido: Pedido }) {
  const siguiente = siguienteEstado(pedido.estado);
  const hora = new Date(pedido.created_at).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });

  return (
    <li className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-500">
          Pedido {pedido.id} · {hora}
        </span>
        <EtiquetaEstado estado={pedido.estado} />
      </div>

      <p className="mt-3 text-lg font-medium">{pedido.descripcion}</p>
      <p className="mt-1 text-sm text-zinc-600">
        {pedido.direccion} · {pedido.telefono}
      </p>

      {siguiente && (
        <form action={cambiarEstado} className="mt-4">
          <input type="hidden" name="id" value={pedido.id} />
          <input type="hidden" name="estado" value={siguiente} />
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
            Marcar “{NOMBRE_ESTADO[siguiente]}”
          </button>
        </form>
      )}
    </li>
  );
}
