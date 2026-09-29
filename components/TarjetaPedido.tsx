import { cambiarEstado, subirFotoEntrega } from "@/app/acciones";
import { NOMBRE_ESTADO, siguienteEstado, type Pedido } from "@/lib/pedidos";
import BarraProgreso from "./BarraProgreso";
import EtiquetaEstado from "./EtiquetaEstado";
import FotoEntrega from "./FotoEntrega";

export default function TarjetaPedido({
  pedido,
  puedeCambiarEstado,
}: {
  pedido: Pedido;
  puedeCambiarEstado: boolean;
}) {
  const siguiente = siguienteEstado(pedido.estado);
  const puedeSubirFoto =
    puedeCambiarEstado && (pedido.estado === "en_camino" || pedido.estado === "entregado");
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

      {!puedeCambiarEstado && <BarraProgreso estado={pedido.estado} />}

      {puedeCambiarEstado && siguiente && (
        <form action={cambiarEstado} className="mt-4">
          <input type="hidden" name="id" value={pedido.id} />
          <input type="hidden" name="estado" value={siguiente} />
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
            Marcar “{NOMBRE_ESTADO[siguiente]}”
          </button>
        </form>
      )}

      {/* Clase 5: la foto de entrega. */}
      {pedido.foto_entrega && <FotoEntrega ruta={pedido.foto_entrega} />}

      {puedeSubirFoto && (
        <form action={subirFotoEntrega} className="mt-4 flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={pedido.id} />
          {/* En el celular, "capture" abre la cámara directo. */}
          <input
            type="file"
            name="foto"
            accept="image/*"
            capture="environment"
            required
            className="text-sm"
          />
          <button className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100">
            Subir foto de entrega
          </button>
        </form>
      )}
    </li>
  );
}
