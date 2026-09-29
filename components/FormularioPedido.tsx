import { crearPedido } from "@/app/acciones";

const campo =
  "rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-zinc-900";

export default function FormularioPedido() {
  return (
    <form
      action={crearPedido}
      className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold">Haz tu pedido</h2>
      <input
        name="descripcion"
        required
        placeholder="¿Qué vas a pedir? Ej. 3 tacos al pastor y una horchata"
        className={campo}
      />
      <input name="direccion" required placeholder="Dirección" className={campo} />
      <input name="telefono" type="tel" required placeholder="Teléfono" className={campo} />
      <button className="rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-500">
        Agregar pedido
      </button>
    </form>
  );
}
