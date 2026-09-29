import FormularioPedido from "@/components/FormularioPedido";
import TarjetaPedido from "@/components/TarjetaPedido";
import type { Pedido } from "@/lib/pedidos";

// Pedidos de ejemplo escritos en el código: no se guardan en ningún lado,
// así que un pedido nuevo no lo ve nadie más.
// En la clase 1 los cambiamos por una consulta a la tabla de Supabase.
const pedidos: Pedido[] = [
  {
    id: 3,
    created_at: "2026-10-14T19:20:00Z",
    descripcion: "Pozole grande para llevar",
    direccion: "Calle Allende 12, Col. Roma",
    telefono: "55 2468 1357",
    estado: "en_camino",
  },
  {
    id: 2,
    created_at: "2026-10-14T19:10:00Z",
    descripcion: "Orden de quesadillas y un refresco",
    direccion: "Av. Hidalgo 210, Col. Juárez",
    telefono: "55 8765 4321",
    estado: "preparando",
  },
  {
    id: 1,
    created_at: "2026-10-14T19:05:00Z",
    descripcion: "3 tacos al pastor y una horchata",
    direccion: "Calle Morelos 45, Centro",
    telefono: "55 1234 5678",
    estado: "recibido",
  },
];

export default function Inicio() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold text-orange-600">Fonda La Esquina</p>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
      </header>

      <FormularioPedido />

      <ul className="mt-8 grid gap-4">
        {pedidos.map((pedido) => (
          <TarjetaPedido key={pedido.id} pedido={pedido} />
        ))}
      </ul>
    </main>
  );
}
