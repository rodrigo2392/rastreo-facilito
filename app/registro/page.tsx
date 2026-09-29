import Link from "next/link";
import { registrarse } from "@/app/login/acciones";

const campo =
  "rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-zinc-900";

// Crear cuenta es solo para clientes: la cuenta de la tienda se crea desde la base.
// El teléfono y la dirección se piden una vez aquí y cada pedido los toma de tu perfil.
export default async function Registro(props: PageProps<"/registro">) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <p className="text-sm font-semibold text-orange-600">Fonda La Esquina</p>
      <h1 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Para hacer tus pedidos y seguirlos en vivo. Tu dirección y tu teléfono se guardan con tu
        cuenta, así no los escribes en cada pedido.
      </p>

      <form
        action={registrarse}
        className="mt-8 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <input name="nombre" required placeholder="Tu nombre" className={campo} />
        <input name="telefono" type="tel" required placeholder="Teléfono" className={campo} />
        <input name="direccion" required placeholder="Dirección de entrega" className={campo} />
        <input name="correo" type="email" required placeholder="Correo" className={campo} />
        <input
          name="contrasena"
          type="password"
          required
          minLength={6}
          placeholder="Contraseña (mínimo 6)"
          className={campo}
        />
        <button className="rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-500">
          Crear cuenta
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-orange-600 hover:underline">
          Entra
        </Link>
      </p>
    </main>
  );
}
