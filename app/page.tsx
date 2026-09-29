import FormularioPedido from "@/components/FormularioPedido";
import TarjetaPedido from "@/components/TarjetaPedido";
import type { Pedido } from "@/lib/pedidos";
import { createClient } from "@/lib/supabase/server";

// Server Component: corre en el servidor y consulta los pedidos en Supabase
// antes de mandar el HTML al navegador.
export default async function Inicio() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  const pedidos: Pedido[] = data ?? [];

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold text-orange-600">Fonda La Esquina</p>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
      </header>

      <FormularioPedido />

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p className="font-semibold">Supabase respondió con un error</p>
          <p className="mt-1">{error.message}</p>
          {error.hint && <p className="mt-1">Pista: {error.hint}</p>}
        </div>
      )}

      <ul className="mt-8 grid gap-4">
        {pedidos.map((pedido) => (
          <TarjetaPedido key={pedido.id} pedido={pedido} />
        ))}
      </ul>

      {!error && pedidos.length === 0 && (
        <p className="mt-8 text-center text-zinc-500">Todavía no hay pedidos.</p>
      )}
    </main>
  );
}
