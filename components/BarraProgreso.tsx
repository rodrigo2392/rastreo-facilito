import { ESTADOS, NOMBRE_ESTADO, type Estado } from "@/lib/pedidos";

// Los cuatro pasos del pedido; se marcan los que ya pasaron.
export default function BarraProgreso({ estado }: { estado: Estado }) {
  const actual = ESTADOS.indexOf(estado);

  return (
    <ol className="mt-4 grid grid-cols-4 gap-2">
      {ESTADOS.map((paso, i) => (
        <li key={paso} className="text-center text-xs">
          <div className={`h-2 rounded-full ${i <= actual ? "bg-orange-500" : "bg-zinc-200"}`} />
          <span
            className={`mt-1 block ${i === actual ? "font-semibold text-zinc-900" : "text-zinc-400"}`}
          >
            {NOMBRE_ESTADO[paso]}
          </span>
        </li>
      ))}
    </ol>
  );
}
