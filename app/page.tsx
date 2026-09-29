import { redirect } from "next/navigation";
import { salir } from "@/app/login/acciones";
import EnLinea from "@/components/EnLinea";
import EnVivo from "@/components/EnVivo";
import FormularioPedido from "@/components/FormularioPedido";
import TarjetaPedido from "@/components/TarjetaPedido";
import type { Pedido } from "@/lib/pedidos";
import { createClient } from "@/lib/supabase/server";

// Server Component: corre en el servidor y consulta los pedidos en Supabase
// antes de mandar el HTML al navegador.
export default async function Inicio() {
  const supabase = await createClient();

  // Sin sesión válida, redirige a /login.
  const { data: sesion } = await supabase.auth.getClaims();
  if (!sesion) redirect("/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("nombre, rol")
    .eq("id", sesion.claims.sub)
    .maybeSingle();
  const esTienda = perfil?.rol === "tienda";

  // La base solo regresa los pedidos que sus reglas te dejan ver.
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  const pedidos: Pedido[] = data ?? [];

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-orange-600">Fonda La Esquina</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {esTienda ? "Pedidos" : "Mis pedidos"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {perfil?.nombre || sesion.claims.email} · {esTienda ? "Tienda" : "Cliente"}
          </p>
          <EnLinea soyTienda={esTienda} />
        </div>
        <form action={salir}>
          <button className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100">
            Salir
          </button>
        </form>
      </header>

      {/* Clase 3: cuando cambia un pedido, la página se actualiza sola. */}
      <EnVivo conSonido={esTienda} />

      {!esTienda && <FormularioPedido />}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <p className="font-semibold">Supabase respondió con un error</p>
          <p className="mt-1">{error.message}</p>
          {error.hint && <p className="mt-1">Pista: {error.hint}</p>}
        </div>
      )}

      <ul className="mt-8 grid gap-4">
        {pedidos.map((pedido) => (
          <TarjetaPedido key={pedido.id} pedido={pedido} puedeCambiarEstado={esTienda} />
        ))}
      </ul>

      {!error && pedidos.length === 0 && (
        <p className="mt-8 text-center text-zinc-500">
          {esTienda ? "Todavía no hay pedidos." : "Todavía no tienes pedidos."}
        </p>
      )}
    </main>
  );
}
